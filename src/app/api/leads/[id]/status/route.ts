import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { getSession } from '@/features/auth/session';
import { ok, err } from '@/lib/api';

const statusSchema = z.object({
  status: z.enum(['new', 'contacted', 'qualified', 'lost']),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session.isLoggedIn) return err('Unauthorized', 401);
  if (session.role !== 'admin') return err('Forbidden', 403);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return err('Invalid JSON body', 400);
  }

  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) {
    return err(parsed.error.issues.map((i) => i.message).join(', '), 422);
  }

  const db = getDb();
  const lead = db
    .prepare('SELECT id FROM leads WHERE id = ? AND deleted_at IS NULL')
    .get(params.id);

  if (!lead) return err('Lead not found', 404);

  db.prepare(
    `UPDATE leads SET status = ?, updated_at = datetime('now') WHERE id = ?`
  ).run(parsed.data.status, params.id);

  const updated = db.prepare('SELECT * FROM leads WHERE id = ?').get(params.id);
  return ok({ lead: updated }, 'Status updated');
}
