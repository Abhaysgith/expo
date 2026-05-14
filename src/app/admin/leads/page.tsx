import { redirect } from 'next/navigation';
import { getSession } from '@/features/auth/session';
import { getDb } from '@/lib/db';
import AdminLeadList from '@/components/admin/AdminLeadList';
import LogoutButton from '@/components/shared/LogoutButton';
import { Users, TrendingUp, Clock } from 'lucide-react';

export const dynamic  = 'force-dynamic';

export default async function AdminLeadsPage() {
  const session = await getSession();
  if (!session.isLoggedIn || session.role !== 'admin') redirect('/admin-login');

  const db = getDb();
  type LeadRow = {
    id: string; customer_name: string; customer_phone: string;
    customer_email: string | null; city: string; budget: string | null;
    owner_name: string | null; owner_phone: string | null;
    note: string | null;
    status: 'new' | 'contacted' | 'qualified' | 'lost';
    whatsapp_status: 'none' | 'queued' | 'sent' | 'failed';
    brochure_url: string | null; created_at: string;
  };

  const leads = db.prepare(
    `SELECT l.*, u.email as owner_email FROM leads l
     LEFT JOIN users u ON u.id = l.owner_user_id
     WHERE l.deleted_at IS NULL ORDER BY l.created_at DESC`
  ).all() as LeadRow[];

  const total     = leads.length;
  const newLeads  = leads.filter(l => l.status === 'new').length;
  const qualified = leads.filter(l => l.status === 'qualified').length;

  const stats = [
    {
      label: 'Total Leads', value: total, icon: Users,
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
      shadow: '0 4px 20px rgba(59,130,246,0.35)',
    },
    {
      label: 'New Leads', value: newLeads, icon: Clock,
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      shadow: '0 4px 20px rgba(245,158,11,0.35)',
    },
    {
      label: 'Qualified', value: qualified, icon: TrendingUp,
      gradient: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
      shadow: '0 4px 20px rgba(34,197,94,0.35)',
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#F1F5F9' }}>

      {/* Header */}
      <header className="bg-white sticky top-0 z-20" style={{ borderBottom: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#22C55E,#16A34A)', boxShadow: '0 2px 8px rgba(34,197,94,0.4)' }}>
              <span className="text-white font-black text-lg">U</span>
            </div>
            <div>
              <p className="text-gray-900 font-bold text-base leading-none">UClean Lead Management</p>
              <p className="text-gray-500 text-xs mt-0.5 font-medium">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-black uppercase tracking-wider" style={{ color: '#6B7280' }}>Admin</p>
              <p className="text-sm font-black" style={{ color: '#111827' }}>{session.name}</p>
            </div>
            <LogoutButton redirectTo="/admin-login" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">All Leads</h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">Track and manage all franchise prospects</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {stats.map(({ label, value, icon: Icon, gradient, shadow }) => (
            <div
              key={label}
              className="rounded-2xl p-6 text-white relative overflow-hidden"
              style={{ background: gradient, boxShadow: shadow }}
            >
              {/* decorative circle */}
              <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full" style={{ background: 'rgba(255,255,255,0.10)' }} />
              <div className="absolute -right-2 -bottom-6 w-16 h-16 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white text-xs font-black uppercase tracking-widest">{label}</span>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.20)' }}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                </div>
                <p className="text-5xl font-black text-white">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Lead list */}
        <AdminLeadList leads={leads} />
      </main>
    </div>
  );
}
