import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { SessionData } from '@/features/auth/types';

const sessionOptions = {
  password:
    process.env.SESSION_SECRET ||
    'expo-session-secret-must-be-at-least-32-chars-long',
  cookieName: 'expo_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  },
};

// iron-session v8 with middleware: use req/res directly
// We cast req.cookies to unknown first to satisfy the type checker
async function getMiddlewareSession(req: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return getIronSession<SessionData>(req.cookies as any, sessionOptions);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const res = NextResponse.next();

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    const session = await getMiddlewareSession(req);
    if (!session.isLoggedIn || session.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin-login', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*'],
};
