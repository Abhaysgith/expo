import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { SessionData } from './types';

export const sessionOptions = {
  password:
    process.env.SESSION_SECRET ||
    'expo-session-secret-must-be-at-least-32-chars-long',
  cookieName: 'expo_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

export async function getSession() {
  const cookieStore = cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}
