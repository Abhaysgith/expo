import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/features/auth/session';
import { getDb } from '@/lib/db';
import LogoutButton from '@/components/shared/LogoutButton';
import LeadStatusUpdater from '@/components/admin/LeadStatusUpdater';
import { ArrowLeft, User, Phone, Mail, MapPin, IndianRupee, MessageSquare, FileText, Calendar, MessageCircle, Activity } from 'lucide-react';

export const dynamic = 'force-dynamic';

type LeadStatus = 'new' | 'contacted' | 'qualified' | 'lost';
type WhatsappStatus = 'none' | 'queued' | 'sent' | 'failed';

interface Lead {
  id: string; customer_name: string; customer_phone: string; customer_email: string | null;
  city: string; note: string | null; budget: string | null;
  owner_name: string | null; owner_phone: string | null;
  status: LeadStatus; whatsapp_status: WhatsappStatus;
  brochure_url: string | null; created_at: string; updated_at: string;
}

const STATUS: Record<LeadStatus, { label: string; bg: string; color: string }> = {
  new:       { label: 'New',       bg: '#DBEAFE', color: '#1E3A8A' },
  contacted: { label: 'Contacted', bg: '#FEF3C7', color: '#78350F' },
  qualified: { label: 'Qualified', bg: '#DCFCE7', color: '#14532D' },
  lost:      { label: 'Lost',      bg: '#FFE4E6', color: '#881337' },
};

const WA: Record<WhatsappStatus, { label: string; color: string }> = {
  none:   { label: 'None',   color: '#374151' },
  queued: { label: 'Queued', color: '#78350F' },
  sent:   { label: 'Sent',   color: '#14532D' },
  failed: { label: 'Failed', color: '#881337' },
};

function Field({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string | null }) {
  return (
    <div className="flex items-start gap-3 py-3" style={{ borderBottom: '1px solid #F3F4F6' }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: '#F3F4F6' }}>
        <Icon className="w-4 h-4" style={{ color: '#374151' }} />
      </div>
      <div>
        <p className="text-[11px] font-black uppercase tracking-wider" style={{ color: '#6B7280' }}>{label}</p>
        <p className="text-sm font-bold mt-0.5" style={{ color: '#111827' }}>{value || '—'}</p>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-6" style={{ border: '1.5px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <p className="text-[11px] font-black uppercase tracking-widest mb-4" style={{ color: '#6B7280' }}>{title}</p>
      {children}
    </div>
  );
}

export default async function AdminLeadDetailPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session.isLoggedIn || session.role !== 'admin') redirect('/admin-login');

  const db = getDb();
  const lead = db.prepare('SELECT * FROM leads WHERE id = ? AND deleted_at IS NULL').get(params.id) as Lead | undefined;
  if (!lead) notFound();

  return (
    <div className="min-h-screen" style={{ background: '#F1F5F9' }}>

      {/* Header */}
      <header className="bg-white sticky top-0 z-20" style={{ borderBottom: '1.5px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/admin/leads" className="flex items-center gap-2 text-sm font-bold transition-colors" style={{ color: '#111827' }}>
            <ArrowLeft className="w-4 h-4" /> Back to Leads
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-black uppercase tracking-wider" style={{ color: '#6B7280' }}>Admin</p>
              <p className="text-sm font-black" style={{ color: '#111827' }}>{session.name}</p>
            </div>
            <LogoutButton redirectTo="/admin-login" />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">

        {/* Lead hero */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: '#DCFCE7' }}>
              <span className="text-2xl font-black" style={{ color: '#14532D' }}>{lead.customer_name.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h1 className="text-2xl font-black" style={{ color: '#111827' }}>{lead.customer_name}</h1>
              <p className="text-xs font-bold mt-1 font-mono" style={{ color: '#6B7280' }}>#{lead.id.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>
          <span className="px-4 py-1.5 rounded-full text-sm font-black" style={{ background: STATUS[lead.status].bg, color: STATUS[lead.status].color }}>
            {STATUS[lead.status].label}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left */}
          <div className="lg:col-span-2 space-y-5">
            <Card title="Customer Information">
              <div className="grid grid-cols-1 sm:grid-cols-2">
                <Field icon={User}        label="Full Name"  value={lead.customer_name} />
                <Field icon={Phone}       label="Phone"      value={lead.customer_phone} />
                <Field icon={Mail}        label="Email"      value={lead.customer_email} />
                <Field icon={MapPin}      label="City"       value={lead.city} />
                <Field icon={IndianRupee} label="Budget"     value={lead.budget} />
              </div>
              {lead.note && (
                <div className="flex items-start gap-3 pt-4 mt-2" style={{ borderTop: '1px solid #F3F4F6' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#F3F4F6' }}>
                    <MessageSquare className="w-4 h-4" style={{ color: '#374151' }} />
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-wider" style={{ color: '#6B7280' }}>Note</p>
                    <p className="text-sm font-semibold mt-0.5 leading-relaxed" style={{ color: '#111827' }}>{lead.note}</p>
                  </div>
                </div>
              )}
            </Card>

            <Card title="Update Status">
              <LeadStatusUpdater leadId={lead.id} currentStatus={lead.status} />
            </Card>
          </div>

          {/* Right */}
          <div className="space-y-4">
            <Card title="Sales Owner">
              {lead.owner_name
                ? <div><Field icon={User} label="Name" value={lead.owner_name} /><Field icon={Phone} label="Phone" value={lead.owner_phone} /></div>
                : <p className="text-sm font-semibold" style={{ color: '#374151' }}>Walk-in / unassigned</p>
              }
            </Card>

            <Card title="WhatsApp">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" style={{ color: '#16A34A' }} />
                <span className="text-sm font-black" style={{ color: WA[lead.whatsapp_status].color }}>
                  {WA[lead.whatsapp_status].label}
                </span>
              </div>
            </Card>

            <Card title="Brochure">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" style={{ color: '#374151' }} />
                {lead.brochure_url
                  ? <a href={lead.brochure_url} target="_blank" rel="noopener noreferrer" className="text-sm font-bold underline underline-offset-2" style={{ color: '#16A34A' }}>View Brochure</a>
                  : <span className="text-sm font-semibold" style={{ color: '#374151' }}>Not attached</span>
                }
              </div>
            </Card>

            <Card title="Timeline">
              <div className="space-y-3">
                {[
                  { icon: Calendar, label: 'Created', value: new Date(lead.created_at).toLocaleString('en-IN') },
                  { icon: Activity, label: 'Updated', value: new Date(lead.updated_at).toLocaleString('en-IN') },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-2">
                    <Icon className="w-3.5 h-3.5 mt-0.5" style={{ color: '#374151' }} />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: '#6B7280' }}>{label}</p>
                      <p className="text-xs font-bold" style={{ color: '#111827' }}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
