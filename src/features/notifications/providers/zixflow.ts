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

/** Normalize to international format — strips +, spaces, dashes; prepends 91 for 10-digit Indian numbers */
function normalizePhone(mobile: string): string {
  let num = mobile.replace(/[\s\-().+]/g, '');
  if (num.length === 10) num = '91' + num;          // 10-digit → add India code
  else if (num.startsWith('0')) num = '91' + num.slice(1); // 0XXXXXXXXXX → 91XXXXXXXXXX
  return num;
}

async function send(
  mobile: string,
  templateName: string,
  variables: Record<string, string>,
  bearerToken: string,
): Promise<ZixflowResult> {
  const to = normalizePhone(mobile);
  const payload = {
    to,
    phoneId: PHONE_ID,
    templateName,
    language: 'en',
    variables,
    submissionStatus: true,
  };

  try {
    console.log(`[Zixflow] → to=${to} (raw=${mobile}) template=${templateName}`);

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
 * Template: expo_lead
 * {{1}} = customerName, {{2}} = date, {{3}} = salesPersonName, {{4}} = salesPersonName, {{5}} = salesPersonPhone
 */
const BROCHURE_URL = process.env.BROCHURE_URL || 'https://ucleanlaundry.up.railway.app/UClean%20Franchise%20Brochure%202026.pdf';

export async function sendFranchiseLeadWhatsApp(
  mobile: string,
  customerName: string,
  date: string,
  salesPersonName: string,
  salesPersonPhone: string,
) {
  return send(
    mobile,
    'expo_lead',
    {
      document: BROCHURE_URL,
      body_1: customerName,
      body_2: date,
      body_3: salesPersonName,
      body_4: salesPersonName,
      body_5: salesPersonPhone,
    },
    TRANS_KEY,
  );
}

/**
 * Notify the SALES PERSON that their lead was captured successfully.
 * Template: lead_sales
 * {{1}} = salesPersonName, {{2}} = customerName, {{3}} = customerPhone, {{4}} = city
 */
export async function sendSalesLeadAlertWhatsApp(
  salesPhone: string,
  salesPersonName: string,
  customerName: string,
  customerPhone: string,
  city: string,
) {
  return send(
    salesPhone,
    'lead_sales',
    {
      body_1: salesPersonName,
      body_2: customerName,
      body_3: customerPhone,
      body_4: city,
    },
    TRANS_KEY,
  );
}

/**
 * Notify the SALES PERSON that a customer clicked "Call Me" CTA.
 * Template: lead_sales_callback
 * {{1}} = customerName, {{2}} = customerPhone
 */
export async function sendCallRequestAlertWhatsApp(
  salesPhone: string,
  customerName: string,
  customerPhone: string,
) {
  return send(
    salesPhone,
    'lead_sales_callback',
    { body_1: customerName, body_2: customerPhone },
    TRANS_KEY,
  );
}
