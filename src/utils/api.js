const configuredBase = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '';
const developmentFallback = import.meta.env.DEV ? 'http://localhost:5000/api' : '';

function normalizeBase(value) {
  const cleaned = String(value || '').trim().replace(/\/+$/, '');
  if (!cleaned) return '';
  return /\/api$/i.test(cleaned) ? cleaned : `${cleaned}/api`;
}

export const API_BASE_URL = normalizeBase(configuredBase || developmentFallback);

export function apiUrl(endpoint) {
  if (!API_BASE_URL) {
    throw new Error('The API is not configured. Set VITE_API_BASE_URL in Vercel and redeploy this frontend.');
  }
  const path = String(endpoint || '').startsWith('/api/')
    ? String(endpoint).slice(4)
    : `/${String(endpoint || '').replace(/^\/+/, '')}`;
  return `${API_BASE_URL}${path}`;
}

export async function apiRequest(endpoint, options = {}) {
  let url;
  try { url = apiUrl(endpoint); } catch (error) { throw error; }
  const isForm = typeof FormData !== 'undefined' && options.body instanceof FormData;
  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers: {
        ...(options.body && !isForm ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error('The server could not be reached. Check the API URL and whether the backend is running.');
  }
  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json().catch(() => ({}))
    : await response.text().catch(() => '');
  if (!response.ok) {
    const message = typeof payload === 'object' && payload !== null
      ? payload.message || `Request failed (${response.status}).`
      : payload || `Request failed (${response.status}).`;
    throw new Error(message);
  }
  return payload;
}

export function normalizeProduct(product) {
  const price = Number(product?.salePrice ?? product?.price ?? 0);
  const originalPrice = Number(product?.price ?? 0);
  const stock = Math.max(0, Number(product?.stock || 0));
  const category = product?.categoryName || product?.category?.name || product?.category || 'Other';
  const nameSlug = `${product?.name || ''} ${product?.slug || ''} ${category}`.toLowerCase();
  const visual = /keychain|key ring/.test(nameSlug) ? 'key'
    : /vase|decor|planter/.test(nameSlug) ? 'vase'
    : /lamp|moon/.test(nameSlug) ? 'lamp'
    : /dino|dinosaur|toy|kit/.test(nameSlug) ? 'dino'
    : /rocket/.test(nameSlug) ? 'rocket'
    : /paint|figurine|statue/.test(nameSlug) ? 'paint'
    : 'key';
  const status = product?.madeToOrder ? 'Made to order'
    : stock <= 0 ? 'Out of stock'
    : stock <= 5 ? 'Low stock'
    : 'In stock';
  return {
    ...product,
    id: String(product?._id || product?.id || product?.slug || ''),
    category,
    price,
    oldPrice: product?.salePrice != null && product.salePrice !== '' && originalPrice > price ? originalPrice : undefined,
    status,
    visual,
    imageUrl: product?.imageUrl || product?.images?.[0]?.url || '',
    personalize: Boolean(product?.personalize),
    personalized: Boolean(product?.personalize),
  };
}
