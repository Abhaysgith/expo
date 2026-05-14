import { getSession } from '@/features/auth/session';
import { ok } from '@/lib/api';

export async function POST() {
  const session = await getSession();
  session.destroy();
  return ok(null, 'Logged out');
}
