import { getSession } from '@/features/auth/session';
import { getDb } from '@/lib/db';
import { err } from '@/lib/api';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getSession();
  if (!session.isLoggedIn) return err('Unauthorized', 401);
  if (session.role !== 'admin') return err('Forbidden', 403);

  const db = getDb();

  const leads = db.prepare(`SELECT * FROM leads WHERE deleted_at IS NULL ORDER BY created_at DESC`).all();
  const users = db.prepare(`SELECT id, name, phone, email, username, role, created_at FROM users`).all();

  const backup = {
    exported_at: new Date().toISOString(),
    leads,
    users,
  };

  return new NextResponse(JSON.stringify(backup, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="uclean-backup-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}
