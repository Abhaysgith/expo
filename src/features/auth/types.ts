export interface SessionData {
  userId: string;
  role: 'sales' | 'admin';
  name: string;
  phone: string;
  isLoggedIn: boolean;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  username: string | null;
  role: 'sales' | 'admin';
  created_at: string;
}
