import { NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { getSession } from '@/features/auth/session';
import { ok, err } from '@/lib/api';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session.isLoggedIn) return err('Unauthorized', 401);

  const db = getDb();
  const lead = db
    .prepare('SELECT * FROM leads WHERE id = ? AND deleted_at IS NULL')
    .get(params.id) as { owner_user_id: string } | undefined;

  if (!lead) return err('Lead not found', 404);

  // Sales can only see their own leads
  if (session.role === 'sales' && lead.owner_user_id !== session.userId) {
    return err('Forbidden', 403);
  }

  return ok({ lead });
}
