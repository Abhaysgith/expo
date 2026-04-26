/**
 * Exports collected leads (stored in localStorage) to a CSV file.
 * Entirely client-side — no server required.
 */

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  investmentBudget: string;
  cityTier: string;
  message: string;
  submittedAt: string;
  source: 'nfc' | 'dashboard';
  syncStatus: 'pending' | 'synced';
}

export function exportLeadsToCSV(leads: Lead[]): void {
  if (leads.length === 0) {
    alert('No leads to export yet.');
    return;
  }

  const headers = [
    'ID', 'Name', 'Email', 'Phone', 'City',
    'Investment Budget', 'City Tier', 'Message', 'Submitted At', 'Source'
  ];

  const rows = leads.map(lead => [
    lead.id,
    lead.name,
    lead.email,
    lead.phone,
    lead.city,
    lead.investmentBudget,
    lead.cityTier,
    `"${lead.message.replace(/"/g, '""')}"`, // escape quotes in message
    lead.submittedAt,
    lead.source,
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

  // Create a Blob and trigger browser download — no server needed
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `uclean-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function generateLeadId(): string {
  return `LEAD-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}
