import { NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { sendCallRequestAlertWhatsApp } from '@/features/notifications/providers/zixflow';

/**
 * Zixflow webhook — fires when a customer interacts with a WhatsApp template button.
 * Zixflow Dashboard → Settings → Webhooks → set URL to:
 *   https://yourdomain.com/api/webhooks/zixflow
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  // Log raw payload for debugging — remove once confirmed working
  console.log('[Zixflow Webhook] raw payload:', JSON.stringify(body, null, 2));

  const payload = body as Record<string, unknown>;

  // Zixflow sends button click events — extract customer phone and button action
  // Adjust field names below once you confirm the exact payload from Zixflow dashboard
  const eventType   = (payload.event_type ?? payload.type ?? payload.eventType) as string | undefined;
  const fromPhone   = extractPhone(payload);
  const buttonText  = extractButtonText(payload);

  if (!fromPhone) {
    console.log('[Zixflow Webhook] no phone found in payload — skipping');
    return new Response('OK', { status: 200 });
  }

  console.log(`[Zixflow Webhook] event=${eventType} from=${fromPhone} button=${buttonText}`);

  // Only act on button click events that look like "call" requests
  const isCallRequest = buttonText
    ? /call|callback|call me|call us/i.test(buttonText)
    : false;

  if (!isCallRequest) {
    console.log('[Zixflow Webhook] not a call request — ignoring');
    return new Response('OK', { status: 200 });
  }

  // Find the lead by customer phone to get the sales owner
  const db = getDb();
  const lead = db.prepare(
    `SELECT id, customer_name, customer_phone, owner_name, owner_phone
     FROM leads
     WHERE customer_phone = ? AND deleted_at IS NULL
     ORDER BY created_at DESC
     LIMIT 1`
  ).get(fromPhone.replace(/\D/g, '').slice(-10)) as {
    id: string;
    customer_name: string;
    customer_phone: string;
    owner_name: string | null;
    owner_phone: string | null;
  } | undefined;

  if (!lead) {
    console.log(`[Zixflow Webhook] no lead found for phone=${fromPhone}`);
    return new Response('OK', { status: 200 });
  }

  if (!lead.owner_phone) {
    console.log(`[Zixflow Webhook] lead ${lead.id} has no sales owner — cannot notify`);
    return new Response('OK', { status: 200 });
  }

  // Send WhatsApp alert to the sales person
  const result = await sendCallRequestAlertWhatsApp(
    lead.owner_phone,
    lead.customer_name,
    lead.customer_phone,
  );

  console.log(`[Zixflow Webhook] call alert sent to sales=${lead.owner_name} success=${result.success}`);

  return new Response('OK', { status: 200 });
}

// ─── Helpers to extract fields from Zixflow payload ───────────────────────────
// Zixflow may nest fields differently — this handles common structures

function extractPhone(payload: Record<string, unknown>): string | null {
  // Common locations Zixflow uses for sender phone
  const candidates = [
    payload.from,
    payload.sender,
    payload.mobile,
    payload.phone,
    payload.lead,
    (payload.contact as Record<string, unknown>)?.phone,
    (payload.contact as Record<string, unknown>)?.mobile,
    (payload.message as Record<string, unknown>)?.from,
    (payload.data as Record<string, unknown>)?.from,
    (payload.data as Record<string, unknown>)?.mobile,
  ];
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim()) return c.trim();
  }
  return null;
}

function extractButtonText(payload: Record<string, unknown>): string | null {
  const candidates = [
    payload.button_text,
    payload.buttonText,
    payload.button_payload,
    payload.text,
    (payload.message as Record<string, unknown>)?.button_text,
    (payload.message as Record<string, unknown>)?.text,
    (payload.data as Record<string, unknown>)?.button_text,
    (payload.data as Record<string, unknown>)?.text,
  ];
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim()) return c.trim();
  }
  return null;
}
