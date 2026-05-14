// Queue processor — called by API or cron
// In first pass, this is a stub that can be wired up later

export async function processNotificationQueue(): Promise<void> {
  // TODO: fetch queued jobs, call provider, update status
  // Provider selection: process.env.WHATSAPP_PROVIDER || 'console'
  //
  // Example implementation:
  // const db = getDb();
  // const jobs = db.prepare(
  //   `SELECT * FROM notification_jobs WHERE status = 'queued' AND attempts < 3 LIMIT 10`
  // ).all();
  //
  // const provider = new ConsoleProvider();
  // for (const job of jobs) {
  //   try {
  //     db.prepare(`UPDATE notification_jobs SET status = 'processing', attempts = attempts + 1, updated_at = datetime('now') WHERE id = ?`).run(job.id);
  //     const result = await provider.send({ ...job, payload: JSON.parse(job.payload) });
  //     db.prepare(`UPDATE notification_jobs SET status = ?, updated_at = datetime('now') WHERE id = ?`).run(result.success ? 'sent' : 'failed', job.id);
  //   } catch (err) {
  //     db.prepare(`UPDATE notification_jobs SET status = 'failed', last_error = ?, updated_at = datetime('now') WHERE id = ?`).run(String(err), job.id);
  //   }
  // }
  console.log('[Queue] processNotificationQueue called (stub)');
}
