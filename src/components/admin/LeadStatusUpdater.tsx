'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle2 } from 'lucide-react';

type LeadStatus = 'new' | 'contacted' | 'qualified' | 'lost';

const STATUS_OPTIONS: { value: LeadStatus; label: string; active: string; inactive: string }[] = [
  { value: 'new',       label: 'New',       active: 'bg-blue-500 text-white ring-2 ring-blue-300',   inactive: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
  { value: 'contacted', label: 'Contacted', active: 'bg-amber-500 text-white ring-2 ring-amber-300', inactive: 'bg-amber-50 text-amber-600 hover:bg-amber-100' },
  { value: 'qualified', label: 'Qualified', active: 'bg-green-500 text-white ring-2 ring-green-300', inactive: 'bg-green-50 text-green-600 hover:bg-green-100' },
  { value: 'lost',      label: 'Lost',      active: 'bg-red-500 text-white ring-2 ring-red-300',     inactive: 'bg-red-50 text-red-600 hover:bg-red-100' },
];

interface LeadStatusUpdaterProps {
  leadId: string;
  currentStatus: LeadStatus;
}

export default function LeadStatusUpdater({
  leadId,
  currentStatus,
}: LeadStatusUpdaterProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<LeadStatus>(currentStatus);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleUpdate = async () => {
    if (selected === currentStatus) return;
    setLoading(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/leads/${leadId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: selected }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setSelected(opt.value)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              selected === opt.value ? opt.active : opt.inactive
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleUpdate}
          disabled={loading || selected === currentStatus}
          className="px-5 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Status'}
        </button>
        {saved && (
          <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" /> Saved
          </span>
        )}
      </div>
    </div>
  );
}
