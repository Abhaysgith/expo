import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '@/lib/db';
import { leadSchema } from '@/lib/validation/schemas';
import { getSession } from '@/features/auth/session';
import { ok, err } from '@/lib/api';
import { sendFranchiseLeadWhatsApp, sendSalesLeadAlertWhatsApp } from '@/features/notifications/providers/zixflow';

export async function GET() {
  const session = await getSession();
  if (!session.isLoggedIn) return err('Unauthorized', 401);
  if (session.role !== 'admin') return err('Forbidden', 403);

  const db = getDb();
  const leads = db.prepare(
    `SELECT l.*, u.email as owner_email
     FROM leads l
     LEFT JOIN users u ON u.id = l.owner_user_id
     WHERE l.deleted_at IS NULL
     ORDER BY l.created_at DESC`
  ).all();

  return ok({ leads });
}

// Fallback owner when no sales person is logged in
const DEFAULT_OWNER = { name: 'Abhay', phone: '9304236395' };

export async function POST(req: NextRequest) {
  // Auth is optional — if a sales person is logged in, attach them
  const session = await getSession();
  const isLoggedInSales = session.isLoggedIn && session.role === 'sales';

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return err('Invalid JSON body', 400);
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return err(parsed.error.issues.map(i => i.message).join(', '), 422);
  }

  const { customerName, customerPhone, customerEmail, city, note, budget, brochureUrl } = parsed.data;

  const db = getDb();
  const id = uuidv4();
  const now = new Date().toISOString();

  db.prepare(
    `INSERT INTO leads
      (id, customer_name, customer_phone, customer_email, city, note, budget,
       owner_user_id, owner_name, owner_phone, brochure_url, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    customerName,
    customerPhone,
    customerEmail || null,
    city,
    note || null,
    budget || null,
    isLoggedInSales ? session.userId      : null,
    isLoggedInSales ? session.name        : DEFAULT_OWNER.name,
    isLoggedInSales ? session.phone       : DEFAULT_OWNER.phone,
    brochureUrl || null,
    now,
    now
  );

  // Always send WhatsApp — use session if logged in, fallback to DEFAULT_OWNER
  const expoDate   = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const salesName  = isLoggedInSales ? (session.name  ?? DEFAULT_OWNER.name)  : DEFAULT_OWNER.name;
  const salesPhone = isLoggedInSales ? (session.phone ?? DEFAULT_OWNER.phone) : DEFAULT_OWNER.phone;

  const jobId = uuidv4();
  db.prepare(
    `INSERT INTO notification_jobs (id, lead_id, provider, payload, created_at, updated_at)
     VALUES (?, ?, 'whatsapp', ?, ?, ?)`
  ).run(jobId, id, JSON.stringify({ customerName, customerPhone, city, salesName }), now, now);

  // Fire WhatsApp to customer (non-blocking)
  sendFranchiseLeadWhatsApp(customerPhone, customerName, expoDate, salesName, salesPhone)
    .then(result => {
      const status    = result.success ? 'sent' : 'failed';
      const updateNow = new Date().toISOString();
      db.prepare(
        `UPDATE notification_jobs SET status=?, attempts=1, last_error=?, updated_at=? WHERE id=?`
      ).run(status, result.success ? null : JSON.stringify(result.response), updateNow, jobId);
      db.prepare(
        `UPDATE leads SET whatsapp_status=?, updated_at=? WHERE id=?`
      ).run(status, updateNow, id);
      console.log(`[WA customer] lead=${id} status=${status}`);
    })
    .catch(e => console.error('[WA customer] unexpected error:', e));

  // Fire WhatsApp alert to sales person (non-blocking)
  sendSalesLeadAlertWhatsApp(salesPhone, salesName, customerName, customerPhone, city)
    .then(result => console.log(`[WA sales] lead=${id} success=${result.success}`))
    .catch(e => console.error('[WA sales] unexpected error:', e));

  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(id);
  return ok({ lead }, 'Lead created');
}
