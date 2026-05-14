import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '@/lib/db';
import { leadSchema } from '@/lib/validation/schemas';
import { getSession } from '@/features/auth/session';
import { ok, err } from '@/lib/api';
import { sendFranchiseLeadWhatsApp } from '@/features/notifications/providers/zixflow';

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
    isLoggedInSales ? session.userId : null,
    isLoggedInSales ? session.name   : null,
    isLoggedInSales ? session.phone  : null,
    brochureUrl || null,
    now,
    now
  );

  // Send WhatsApp + log the job (only when a sales person submitted)
  if (isLoggedInSales) {
    const jobId = uuidv4();
    const jobPayload = JSON.stringify({ customerName, customerPhone, city, salesName: session.name });

    // Insert job as queued
    db.prepare(
      `INSERT INTO notification_jobs (id, lead_id, provider, payload, created_at, updated_at)
       VALUES (?, ?, 'whatsapp', ?, ?, ?)`
    ).run(jobId, id, jobPayload, now, now);

    // Fire WhatsApp (non-blocking — don't await in the response path)
    sendFranchiseLeadWhatsApp(customerPhone, customerName, id)
      .then(result => {
        const status    = result.success ? 'sent' : 'failed';
        const waStatus  = result.success ? 'sent' : 'failed';
        const updateNow = new Date().toISOString();
        db.prepare(
          `UPDATE notification_jobs SET status=?, attempts=1, last_error=?, updated_at=? WHERE id=?`
        ).run(status, result.success ? null : JSON.stringify(result.response), updateNow, jobId);
        db.prepare(
          `UPDATE leads SET whatsapp_status=?, updated_at=? WHERE id=?`
        ).run(waStatus, updateNow, id);
        console.log(`[WA] lead=${id} status=${status}`);
      })
      .catch(e => console.error('[WA] unexpected error:', e));
  }

  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(id);
  return ok({ lead }, 'Lead created');
}
