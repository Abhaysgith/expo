'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronRight, Download } from 'lucide-react';

type LeadStatus = 'new' | 'contacted' | 'qualified' | 'lost';
type WhatsappStatus = 'none' | 'queued' | 'sent' | 'failed';

interface Lead {
  id: string; customer_name: string; customer_phone: string;
  customer_email: string | null; city: string; budget: string | null;
  owner_name: string | null; status: LeadStatus; note: string | null;
  whatsapp_status: WhatsappStatus; created_at: string;
}

const STATUS: Record<LeadStatus, { label: string; bg: string; text: string; dot: string }> = {
  new:       { label: 'New',       bg: '#DBEAFE', text: '#1E3A8A', dot: '#2563EB' },
  contacted: { label: 'Contacted', bg: '#FEF3C7', text: '#78350F', dot: '#D97706' },
  qualified: { label: 'Qualified', bg: '#DCFCE7', text: '#14532D', dot: '#16A34A' },
  lost:      { label: 'Lost',      bg: '#FFE4E6', text: '#881337', dot: '#E11D48' },
};

const WA: Record<WhatsappStatus, { label: string; color: string; dot: string }> = {
  none:   { label: '—',       color: '#374151', dot: '#9CA3AF' },
  queued: { label: 'Queued',  color: '#78350F', dot: '#D97706' },
  sent:   { label: 'Sent',    color: '#14532D', dot: '#16A34A' },
  failed: { label: 'Failed',  color: '#881337', dot: '#E11D48' },
};

const AVATAR_COLORS = [
  ['#EDE9FE','#4C1D95'], ['#DBEAFE','#1E3A8A'], ['#DCFCE7','#14532D'],
  ['#FEF3C7','#78350F'], ['#FCE7F3','#831843'],
];

function Avatar({ name }: { name: string }) {
  const [bg, color] = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
  return (
    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0" style={{ background: bg, color }}>
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

function timeAgo(iso: string) {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' });
}

function downloadCSV(leads: Lead[]) {
  const headers = ['Name', 'Phone', 'Email', 'City', 'Budget', 'Sales Person', 'Note', 'Status', 'WhatsApp', 'Created At'];
  const rows = leads.map(l => [
    l.customer_name,
    l.customer_phone,
    l.customer_email || '',
    l.city,
    l.budget || '',
    l.owner_name || 'Walk-in',
    (l.note || '').replace(/,/g, ';'),
    STATUS[l.status].label,
    WA[l.whatsapp_status].label,
    new Date(l.created_at).toLocaleString('en-IN'),
  ]);
  const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `uclean-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminLeadList({ leads }: { leads: Lead[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<LeadStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = leads
    .filter(l => filter === 'all' || l.status === filter)
    .filter(l => !search ||
      l.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      l.city.toLowerCase().includes(search.toLowerCase()) ||
      l.customer_phone.includes(search)
    );

  return (
    <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1.5px solid #E5E7EB', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>

      {/* Toolbar */}
      <div className="px-6 py-4 flex items-center gap-3 flex-wrap" style={{ borderBottom: '1.5px solid #F3F4F6' }}>
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#6B7280' }} />
          <input
            type="text"
            placeholder="Search name, city, phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm font-medium rounded-xl focus:outline-none transition-all"
            style={{ background: '#F9FAFB', border: '1.5px solid #D1D5DB', color: '#111827' }}
            onFocus={e => (e.target.style.borderColor = '#16A34A')}
            onBlur={e => (e.target.style.borderColor = '#D1D5DB')}
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {(['all', 'new', 'contacted', 'qualified', 'lost'] as const).map(s => {
            const active = filter === s;
            const cfg = s !== 'all' ? STATUS[s] : null;
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className="px-4 py-1.5 rounded-full text-xs font-bold transition-all"
                style={active
                  ? { background: s === 'all' ? '#111827' : cfg!.bg, color: s === 'all' ? '#fff' : cfg!.text, border: `2px solid ${s === 'all' ? '#111827' : cfg!.dot}` }
                  : { background: '#F9FAFB', color: '#374151', border: '2px solid #E5E7EB' }
                }
              >
                {s === 'all' ? 'All' : STATUS[s].label}
                <span className="ml-1.5">{s === 'all' ? leads.length : leads.filter(l => l.status === s).length}</span>
              </button>
            );
          })}
        </div>

        {/* Download button */}
        <button
          onClick={() => downloadCSV(filtered)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all"
          style={{ background: '#F0FDF4', color: '#15803D', border: '1.5px solid #86EFAC' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#DCFCE7'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#F0FDF4'; }}
        >
          <Download className="w-3.5 h-3.5" />
          Download CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ background: '#F9FAFB', borderBottom: '1.5px solid #E5E7EB' }}>
              {['Customer', 'Phone', 'City', 'Budget', 'Sales Person', 'Note', 'Status', 'WhatsApp', 'Time', ''].map(h => (
                <th key={h} className="text-left px-5 py-3.5 text-xs font-black uppercase tracking-wider" style={{ color: '#374151' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} className="py-20 text-center text-sm font-semibold" style={{ color: '#374151' }}>
                  {search ? 'No results found' : 'No leads yet'}
                </td>
              </tr>
            )}
            {filtered.map((lead, i) => (
              <tr
                key={lead.id}
                onClick={() => router.push(`/admin/leads/${lead.id}`)}
                className="cursor-pointer group transition-colors"
                style={{ borderTop: i > 0 ? '1px solid #F3F4F6' : undefined }}
                onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={lead.customer_name} />
                    <div>
                      <p className="text-sm font-bold" style={{ color: '#111827' }}>{lead.customer_name}</p>
                      {lead.customer_email && <p className="text-xs font-medium truncate max-w-[160px]" style={{ color: '#374151' }}>{lead.customer_email}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm font-bold font-mono" style={{ color: '#111827' }}>{lead.customer_phone}</td>
                <td className="px-5 py-4 text-sm font-bold" style={{ color: '#111827' }}>{lead.city}</td>
                <td className="px-5 py-4 text-sm font-semibold" style={{ color: '#1F2937' }}>{lead.budget || '—'}</td>
                <td className="px-5 py-4 text-sm font-bold" style={{ color: '#111827' }}>
                  {lead.owner_name || <span className="text-xs font-semibold italic" style={{ color: '#6B7280' }}>Walk-in</span>}
                </td>
                <td className="px-5 py-4 text-sm max-w-[140px]" style={{ color: '#374151' }}>
                  {lead.note
                    ? <span className="truncate block font-medium" title={lead.note}>{lead.note}</span>
                    : <span className="text-xs" style={{ color: '#9CA3AF' }}>—</span>
                  }
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black" style={{ background: STATUS[lead.status].bg, color: STATUS[lead.status].text }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS[lead.status].dot }} />
                    {STATUS[lead.status].label}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: WA[lead.whatsapp_status].dot }} />
                    <span className="text-xs font-black" style={{ color: WA[lead.whatsapp_status].color }}>{WA[lead.whatsapp_status].label}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-xs font-bold whitespace-nowrap" style={{ color: '#1F2937' }}>{timeAgo(lead.created_at)}</td>
                <td className="px-3 py-4">
                  <ChevronRight className="w-4 h-4 group-hover:text-green-600 transition-colors" style={{ color: '#6B7280' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length > 0 && (
        <div className="px-6 py-3 flex items-center justify-between" style={{ borderTop: '1.5px solid #F3F4F6' }}>
          <p className="text-xs font-bold" style={{ color: '#374151' }}>
            Showing <span style={{ color: '#111827' }}>{filtered.length}</span> of <span style={{ color: '#111827' }}>{leads.length}</span> leads
          </p>
          <button
            onClick={() => downloadCSV(filtered)}
            className="flex items-center gap-1.5 text-xs font-bold transition-colors"
            style={{ color: '#15803D' }}
          >
            <Download className="w-3 h-3" />
            Export {filtered.length} rows
          </button>
        </div>
      )}
    </div>
  );
}
