import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { syncLeadSchema } from '@/lib/validation/schemas';
import { getSession } from '@/features/auth/session';
import { ok, err } from '@/lib/api';
import { v4 as uuidv4 } from 'uuid';
import { sendFranchiseLeadWhatsApp, sendSalesLeadAlertWhatsApp } from '@/features/notifications/providers/zixflow';

const syncBodySchema = z.object({
  leads: z.array(syncLeadSchema),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.isLoggedIn) return err('Unauthorized', 401);
  if (session.role !== 'sales') return err('Forbidden', 403);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return err('Invalid JSON body', 400);
  }

  const parsed = syncBodySchema.safeParse(body);
  if (!parsed.success) {
    return err(parsed.error.issues.map((i) => i.message).join(', '), 422);
  }

  const db = getDb();

  // Verify session user exists in this DB (protects against stale session after volume reset)
  const userExists = !!db.prepare('SELECT 1 FROM users WHERE id = ?').get(session.userId);
  if (!userExists) return err('Session expired. Please log in again.', 401);

  const upsert = db.prepare(
    `INSERT INTO leads
      (id, customer_name, customer_phone, customer_email, city, note, budget,
       preferred_location, owner_user_id, owner_name, owner_phone, sync_status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'synced', ?, datetime('now'))
     ON CONFLICT(id) DO UPDATE SET
       customer_name = excluded.customer_name,
       customer_phone = excluded.customer_phone,
       customer_email = excluded.customer_email,
       city = excluded.city,
       note = excluded.note,
       budget = excluded.budget,
       preferred_location = excluded.preferred_location,
       sync_status = 'synced',
       updated_at = datetime('now')`
  );

  const enqueueJob = db.prepare(
    `INSERT OR IGNORE INTO notification_jobs (id, lead_id, provider, payload, created_at, updated_at)
     VALUES (?, ?, 'whatsapp', ?, datetime('now'), datetime('now'))`
  );

  const syncAll = db.transaction(
    (leads: z.infer<typeof syncLeadSchema>[]) => {
      for (const lead of leads) {
        upsert.run(
          lead.id,
          lead.customerName,
          lead.customerPhone,
          lead.customerEmail || null,
          lead.city,
          lead.note || null,
          lead.budget || null,
          lead.preferredLocation || null,
          session.userId,
          session.name,
          session.phone,
          lead.createdAt
        );
        enqueueJob.run(
          uuidv4(),
          lead.id,
          JSON.stringify({
            customerName: lead.customerName,
            customerPhone: lead.customerPhone,
            city: lead.city,
          })
        );
      }
    }
  );

  syncAll(parsed.data.leads);

  // Fire WhatsApp for each synced lead (non-blocking)
  for (const lead of parsed.data.leads) {
    // Notify customer
    const expoDate   = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    const salesName  = session.name  ?? 'UClean Team';
    const salesPhone = session.phone ?? '';
    sendFranchiseLeadWhatsApp(lead.customerPhone, lead.customerName, expoDate, salesName, salesPhone)
      .then(result => {
        const status    = result.success ? 'sent' : 'failed';
        const updateNow = new Date().toISOString();
        db.prepare(`UPDATE notification_jobs SET status=?, attempts=1, last_error=?, updated_at=? WHERE lead_id=?`)
          .run(status, result.success ? null : JSON.stringify(result.response), updateNow, lead.id);
        db.prepare(`UPDATE leads SET whatsapp_status=?, updated_at=? WHERE id=?`)
          .run(status, updateNow, lead.id);
        console.log(`[WA sync customer] lead=${lead.id} status=${status}`);
      })
      .catch(e => console.error('[WA sync customer] unexpected error:', e));

    // Notify sales person
    if (session.phone) {
      sendSalesLeadAlertWhatsApp(session.phone, salesName, lead.customerName, lead.customerPhone, lead.city)
        .then(result => console.log(`[WA sync sales] lead=${lead.id} success=${result.success}`))
        .catch(e => console.error('[WA sync sales] unexpected error:', e));
    }
  }

  return ok({ synced: parsed.data.leads.length }, 'Leads synced');
}
