import { getSession } from '@/features/auth/session';
import { ok } from '@/lib/api';

export async function GET() {
  const session = await getSession();

  if (!session.isLoggedIn) {
    return ok({ user: null });
  }

  return ok({
    user: {
      id: session.userId,
      name: session.name,
      role: session.role,
      phone: session.phone,
    },
  });
}
