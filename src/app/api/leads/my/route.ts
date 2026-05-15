import { getSession } from '@/features/auth/session';
import { getDb } from '@/lib/db';
import { ok, err } from '@/lib/api';

export async function GET() {
  const session = await getSession();
  if (!session.isLoggedIn) return err('Unauthorized', 401);
  if (session.role !== 'sales') return err('Forbidden', 403);

  const db = getDb();
  const leads = db.prepare(
    `SELECT id, customer_name, customer_phone, customer_email, city, budget, note,
            preferred_location, status, whatsapp_status, created_at
     FROM leads
     WHERE (owner_user_id = ? OR (owner_user_id IS NULL AND owner_name = ?))
       AND deleted_at IS NULL
     ORDER BY created_at DESC`
  ).all(session.userId, session.name);

  return ok({ leads });
}
