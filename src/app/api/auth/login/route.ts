import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDb } from '@/lib/db';
import { loginSchema } from '@/lib/validation/schemas';
import { getSession } from '@/features/auth/session';
import { ok, err } from '@/lib/api';

interface DbUser {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  username: string | null;
  password_hash: string;
  role: 'sales' | 'admin';
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return err('Invalid JSON body', 400);
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return err(parsed.error.issues.map((i) => i.message).join(', '), 422);
  }

  const { identifier, password } = parsed.data;

  const db = getDb();
  const user = db
    .prepare(
      `SELECT * FROM users WHERE email = ? OR username = ? LIMIT 1`
    )
    .get(identifier, identifier) as DbUser | undefined;

  if (!user) {
    return err('Invalid credentials', 401);
  }

  const passwordMatch = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatch) {
    return err('Invalid credentials', 401);
  }

  const session = await getSession();
  session.userId = user.id;
  session.role = user.role;
  session.name = user.name;
  session.phone = user.phone;
  session.isLoggedIn = true;
  await session.save();

  return ok({ user: { id: user.id, name: user.name, role: user.role } }, 'Logged in');
}
