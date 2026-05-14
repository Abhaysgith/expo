export interface NotificationJob {
  id: string;
  leadId: string;
  provider: string;
  status: 'queued' | 'processing' | 'sent' | 'failed';
  attempts: number;
  lastError?: string;
  payload: Record<string, unknown>;
  createdAt: string;
}

export interface NotificationProvider {
  name: string;
  send(job: NotificationJob): Promise<{ success: boolean; error?: string }>;
}
