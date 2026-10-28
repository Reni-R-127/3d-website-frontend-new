import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const CART_STORAGE_KEY = 'projenius-cart-v2';
const COUPON_STORAGE_KEY = 'projenius-coupon-v1';
function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '{}'); }
  catch { return {}; }
}
function loadCoupon() {
  try { return JSON.parse(localStorage.getItem(COUPON_STORAGE_KEY) || 'null'); }
  catch { return null; }
}
function calculateDiscount(coupon, subtotal) {
  if (!coupon || !Number.isFinite(Number(subtotal))) return 0;
  const value = Number(coupon.discountValue || 0);
  if (value <= 0) return 0;
  const discount = String(coupon.discountType || '').toLowerCase() === 'percent'
    ? Math.round(Number(subtotal) * Math.min(value, 100) / 100)
    : Math.round(value);
  return Math.min(Math.max(0, Number(subtotal)), Math.max(0, discount));
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);
  const [coupon, setCouponState] = useState(loadCoupon);
  useEffect(() => {
    try { localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items)); }
    catch { /* Storage may be disabled; cart remains available for this session. */ }
  }, [items]);
  useEffect(() => {
    try {
      if (coupon) localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(coupon));
      else localStorage.removeItem(COUPON_STORAGE_KEY);
    } catch { /* Applied coupon remains available for this session. */ }
  }, [coupon]);

  const api = useMemo(() => {
    const count = Object.values(items).reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = Object.values(items).reduce((sum, item) => sum + Number(item.product.price || 0) * item.quantity, 0);
    return {
      items, count, subtotal, coupon, couponDiscount: calculateDiscount(coupon, subtotal),
      setCoupon(value) { setCouponState(value || null); },
      clearCoupon() { setCouponState(null); },
      add(product, quantity = 1, personalization = '') {
        if (!product?.id || !Number.isFinite(Number(product.price)) || Number(product.price) < 0) throw new Error('This product cannot be added to the cart. Refresh the catalogue and try again.');
        const lineId = personalization ? `${product.id}::${personalization.trim().toLowerCase()}` : product.id;
        setItems((old) => {
          const addQuantity = Math.max(1, Math.min(99, Math.floor(Number(quantity) || 1)));
          const existing = old[lineId];
          const nextQuantity = Math.min(99, (Number(existing?.quantity) || 0) + addQuantity);
          return { ...old, [lineId]: { product, quantity: nextQuantity, personalization: String(personalization || '').trim(), lineId } };
        });
      },
      setQuantity(lineId, quantity) {
        setItems((old) => {
          if (quantity <= 0) { const next = { ...old }; delete next[lineId]; return next; }
          return old[lineId] ? { ...old, [lineId]: { ...old[lineId], quantity: Math.min(99, Math.floor(Number(quantity) || 1)) } } : old;
        });
      },
      remove(lineId) { setItems((old) => { const next = { ...old }; delete next[lineId]; return next; }); },
      clear() { setItems({}); setCouponState(null); },
    };
  }, [items, coupon]);
  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}
export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error('useCart requires CartProvider');
  return value;
}
