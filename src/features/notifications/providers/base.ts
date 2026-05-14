import { NotificationProvider, NotificationJob } from '../types';

// Stub provider — logs to console, ready for real implementation
export class ConsoleProvider implements NotificationProvider {
  name = 'console';

  async send(job: NotificationJob): Promise<{ success: boolean; error?: string }> {
    console.log('[NotificationQueue] Would send:', job.payload);
    return { success: true };
  }
}
