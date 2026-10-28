import { apiRequest } from './api.js';

export async function submitInquiry(payload) {
  const { attachments = [], ...fields } = payload || {};
  const type = String(fields.type || fields.kind || fields.requestType || 'contact');
  const values = { ...fields, type, kind: fields.kind || type };
  try {
    let body;
    if (attachments.length) {
      body = new FormData();
      Object.entries(values).forEach(([key, value]) => body.append(key, value == null ? '' : String(value)));
      attachments.forEach((file) => body.append('attachments', file));
    } else {
      body = JSON.stringify(values);
    }
    return { ok: true, data: await apiRequest('/enquiries', { method: 'POST', body }) };
  } catch (error) {
    return { ok: false, kind: 'server', message: error.message || 'We could not submit this request. Please try again later.' };
  }
}
