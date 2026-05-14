import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '@/lib/db';
import { signupSchema } from '@/lib/validation/schemas';
import { getSession } from '@/features/auth/session';
import { ok, err } from '@/lib/api';

// Simple in-memory rate limiter: max 10 signups/minute per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '127.0.0.1';

  if (!checkRateLimit(ip)) {
    return err('Too many signup attempts. Try again in a minute.', 429);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return err('Invalid JSON body', 400);
  }

  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return err(parsed.error.issues.map((i) => i.message).join(', '), 422);
  }

  const { name, phone, email, username, password, role } = parsed.data;

  const db = getDb();

  // Check uniqueness
  if (email) {
    const existing = db
      .prepare('SELECT id FROM users WHERE email = ?')
      .get(email);
    if (existing) return err('Email already registered', 409);
  }
  if (username) {
    const existing = db
      .prepare('SELECT id FROM users WHERE username = ?')
      .get(username);
    if (existing) return err('Username already taken', 409);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const id = uuidv4();

  db.prepare(
    `INSERT INTO users (id, name, phone, email, username, password_hash, role)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    name,
    phone,
    email || null,
    username || null,
    passwordHash,
    role
  );

  const session = await getSession();
  session.userId = id;
  session.role = role;
  session.name = name;
  session.phone = phone;
  session.isLoggedIn = true;
  await session.save();

  return ok({ user: { id, name, role } }, 'Account created');
}
