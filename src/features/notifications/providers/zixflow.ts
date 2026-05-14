/**
 * Zixflow WhatsApp Provider
 * Ported from uclean-storeAPI/api/services/whatsappService.js
 */

const ZIXFLOW_API = 'https://api.zixflow.com/api/v1/campaign/whatsapp/send';
const PHONE_ID    = process.env.ZIXFLOW_PHONE_ID      || '725043027370143';
const API_KEY     = process.env.ZIXFLOW_API_KEY        || '';
const TRANS_KEY   = process.env.ZIXFLOW_TRANSACTIONAL_KEY || '';

export interface ZixflowResult {
  success: boolean;
  templateName: string;
  payload: object;
  response: unknown;
}

async function send(
  mobile: string,
  templateName: string,
  variables: Record<string, string>,
  bearerToken: string,
): Promise<ZixflowResult> {
  const payload = {
    to: mobile,
    phoneId: PHONE_ID,
    templateName,
    language: 'en',
    variables,
    submissionStatus: true,
  };

  try {
    console.log(`[Zixflow] → to=${mobile} template=${templateName}`);

    const res = await fetch(ZIXFLOW_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    const success = !!(data && data.status);
    console.log(`[Zixflow] ← status=${res.status} success=${success}`, data);
    return { success, templateName, payload, response: data };

  } catch (err) {
    console.error('[Zixflow] ✗ fetch error:', err);
    return { success: false, templateName, payload, response: null };
  }
}

// ─── Exported functions (mirrors whatsappService.js) ──────────────────────────

/** Send OTP via WhatsApp (auth template) */
export async function sendWhatsappOTP(mobile: string, otp: string) {
  return send(mobile, 'auth', { otp }, API_KEY);
}

/** Send order status / invoice update (generate_invoice template) */
export async function sendOrderStatusWhatsApp(
  mobile: string,
  bookingCode: string,
  bookingId: string,
) {
  return send(
    mobile,
    'generate_invoice',
    { body_1: bookingCode, button_1: bookingId },
    TRANS_KEY,
  );
}

/** Send order confirmation (order_confirm template) */
export async function sendOrderConfirmWhatsApp(
  mobile: string,
  bookingCode: string,
  bookingId: string,
) {
  return send(
    mobile,
    'order_confirm',
    { body_1: bookingCode, button_1: bookingId },
    TRANS_KEY,
  );
}

/**
 * Send franchise lead notification to the CUSTOMER.
 * Uses order_confirm as a placeholder template for now.
 */
export async function sendFranchiseLeadWhatsApp(
  mobile: string,
  customerName: string,
  leadId: string,
) {
  return send(
    mobile,
    'order_confirm',                         // ← swap to franchise template later
    { body_1: customerName, button_1: leadId.slice(0, 8) },
    TRANS_KEY,
  );
}

/**
 * Notify the SALES PERSON that their lead was captured successfully.
 * Uses same order_confirm template for now.
 */
export async function sendSalesLeadAlertWhatsApp(
  salesPhone: string,
  customerName: string,
  leadId: string,
) {
  return send(
    salesPhone,
    'order_confirm',
    { body_1: customerName, button_1: leadId.slice(0, 8) },
    TRANS_KEY,
  );
}

/**
 * Notify the SALES PERSON that a customer clicked "Call Me" CTA.
 * Uses same order_confirm template for now — swap to a dedicated template later.
 */
export async function sendCallRequestAlertWhatsApp(
  salesPhone: string,
  customerName: string,
  customerPhone: string,
) {
  return send(
    salesPhone,
    'order_confirm',
    { body_1: customerName, button_1: customerPhone },
    TRANS_KEY,
  );
}
