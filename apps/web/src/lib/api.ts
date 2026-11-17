export const API_BASE = typeof window !== 'undefined' ? '' : (process.env.FASTIFY_API_URL || 'http://127.0.0.1:4000');

export async function fetchProducts() {
  try {
    const res = await fetch(`${API_BASE}/api/v1/products`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    return data.products;
  } catch (err) {
    console.warn('API fetch fallback for products:', err);
    return [];
  }
}

export async function fetchProductBySlug(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/api/v1/products/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.product;
  } catch (err) {
    console.warn('API fetch fallback for product slug:', err);
    return null;
  }
}

export async function fetchReels() {
  try {
    const res = await fetch(`${API_BASE}/api/v1/reels`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch reels');
    const data = await res.json();
    return data.reels;
  } catch (err) {
    console.warn('API fetch fallback for reels:', err);
    return [];
  }
}

export async function fetchSocialProof() {
  try {
    const res = await fetch(`${API_BASE}/api/v1/social-proof`);
    if (!res.ok) throw new Error('Failed to fetch social proof');
    return await res.json();
  } catch (err) {
    return {
      settings: { mode: 'hybrid', initialDelayMs: 3000, displayDurationMs: 5000, rotationIntervalMs: 8000, isEnabled: true },
      events: [
        { id: 'spe-1', customerName: 'Someone', city: 'Lahore (DHA)', productName: 'Wayfarer Bold Acetate (Polarized)', timeAgo: '2 minutes ago' },
        { id: 'spe-2', customerName: 'Usman K.', city: 'Karachi (Clifton)', productName: 'Aviator SkyMaster Titanium (Gold)', timeAgo: '5 minutes ago' },
        { id: 'spe-3', customerName: 'Dr. Fatima', city: 'Islamabad (F-10)', productName: 'Clubmaster Browline (Blue-Cut)', timeAgo: '8 minutes ago' },
      ],
    };
  }
}

export async function submitCodCheckout(payload: any) {
  const res = await fetch(`${API_BASE}/api/v1/orders/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to complete COD order');
  }
  return data;
}

export async function trackOrder(orderNumber: string) {
  const res = await fetch(`${API_BASE}/api/v1/orders/track/${encodeURIComponent(orderNumber)}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Order not found');
  }
  return data;
}

export async function askOpticianAi(message: string, faceShape?: string) {
  const res = await fetch(`${API_BASE}/api/v1/optician/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, faceShape }),
  });
  return await res.json();
}
