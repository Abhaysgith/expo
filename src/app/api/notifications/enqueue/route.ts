import { NextRequest } from 'next/server';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '@/lib/db';
import { getSession } from '@/features/auth/session';
import { ok, err } from '@/lib/api';

const enqueueSchema = z.object({
  leadId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.isLoggedIn) return err('Unauthorized', 401);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return err('Invalid JSON body', 400);
  }

  const parsed = enqueueSchema.safeParse(body);
  if (!parsed.success) {
    return err(parsed.error.issues.map((i) => i.message).join(', '), 422);
  }

  const db = getDb();
  const lead = db
    .prepare('SELECT * FROM leads WHERE id = ? AND deleted_at IS NULL')
    .get(parsed.data.leadId) as
    | {
        id: string;
        customer_name: string;
        customer_phone: string;
        city: string;
      }
    | undefined;

  if (!lead) return err('Lead not found', 404);

  const jobId = uuidv4();
  const now = new Date().toISOString();

  db.prepare(
    `INSERT INTO notification_jobs (id, lead_id, provider, payload, created_at, updated_at)
     VALUES (?, ?, 'whatsapp', ?, ?, ?)`
  ).run(
    jobId,
    lead.id,
    JSON.stringify({
      customerName: lead.customer_name,
      customerPhone: lead.customer_phone,
      city: lead.city,
    }),
    now,
    now
  );

  return ok({ jobId }, 'Notification job enqueued');
}
