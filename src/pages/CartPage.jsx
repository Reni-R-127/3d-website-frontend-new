import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useCart } from '../context/CartContext.jsx';
import { formatPrice } from '../utils/formatPrice.js';
import { apiRequest } from '../utils/api.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import './CartPage.css';

const FREE_DELIVERY_LIMIT = 999;
const DELIVERY_FEE = 79;

function Reveal({ children, className = '', delay = 0 }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.12 }}
      transition={{ duration: reduceMotion ? 0 : 0.48, delay: reduceMotion ? 0 : delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

function ProductIllustration({ visual, name }) {
  const icons = { dino: '🦕', key: '🔑', vase: '🏺', lamp: '🌙', rocket: '🚀', paint: '🎨' };
  return <div className={`cart-product-art cart-art-${visual || 'default'}`} role="img" aria-label={`${name} illustration`}>
    <span>{icons[visual] || '◆'}</span>
  </div>;
}

export default function CartPage() {
  useDocumentTitle('Your Cart');
  const cart = useCart();
  const [coupon, setCoupon] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const [couponBusy, setCouponBusy] = useState(false);
  const [freeDeliveryLimit, setFreeDeliveryLimit] = useState(FREE_DELIVERY_LIMIT);
  const items = useMemo(() => Object.entries(cart.items).map(([lineId, item]) => ({ lineId, ...item })), [cart.items]);
  useEffect(() => {
    let cancelled = false;
    apiRequest('/settings/public').then((result) => {
      const threshold = Number((result.data || result)?.shippingThreshold);
      if (!cancelled && Number.isFinite(threshold) && threshold >= 0) setFreeDeliveryLimit(threshold);
    }).catch(() => { /* Use the documented default when no store settings are configured. */ });
    return () => { cancelled = true; };
  }, []);
  const remaining = Math.max(0, freeDeliveryLimit - cart.subtotal);
  const shipping = items.length && remaining === 0 ? 0 : items.length ? DELIVERY_FEE : 0;
  const total = cart.subtotal - cart.couponDiscount + shipping;

  async function applyCoupon(event) {
    event.preventDefault();
    if (!coupon.trim()) { setCouponMessage('Enter a coupon code first.'); return; }
    if (!items.length) { setCouponMessage('Add a product to your cart first.'); return; }
    setCouponBusy(true); setCouponMessage('');
    try {
      const result = await apiRequest('/coupons/validate', { method: 'POST', body: JSON.stringify({ code: coupon.trim(), subtotal: cart.subtotal }) });
      const saved = result.data || result;
      cart.setCoupon({ code: saved.code, discountType: saved.discountType, discountValue: saved.discountValue });
      setCouponMessage(`Coupon ${saved.code} applied — ${formatPrice(saved.discountAmount)} off.`);
    } catch (error) { cart.clearCoupon(); setCouponMessage(error.message || 'This coupon could not be applied.'); }
    finally { setCouponBusy(false); }
  }

  return (
    <main className="cart-page">
      <div className="cart-page-inner">
        <Reveal className="cart-page-heading">
          <div>
            <h1>Your cart</h1>
            <p>{cart.count} {cart.count === 1 ? 'item' : 'items'} · prices include taxes</p>
          </div>
          <Link className="cart-continue-link" to="/shop">← Continue shopping</Link>
        </Reveal>

        {!items.length ? (
          <Reveal className="cart-empty-card">
            <div className="cart-empty-icon" aria-hidden="true">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Find a ready-made print or personalised gift to get started.</p>
            <Link className="cart-primary-button" to="/shop">Explore products</Link>
          </Reveal>
        ) : (
          <div className="cart-content-grid">
            <div className="cart-main-column">
              <Reveal className="delivery-progress-card">
                <p>{remaining > 0 ? <>Add <strong>{formatPrice(remaining)}</strong> more for free standard delivery.</> : 'You unlocked free standard delivery!'}</p>
                <div className="delivery-progress-track" aria-label={`${Math.min(100, (cart.subtotal / Math.max(1, freeDeliveryLimit)) * 100)}% toward free delivery`}>
                  <span style={{ width: `${Math.min(100, (cart.subtotal / Math.max(1, freeDeliveryLimit)) * 100)}%` }} />
                </div>
              </Reveal>

              <div className="cart-items-list">
                {items.map(({ lineId, product, quantity, personalization }, index) => (
                  <Reveal key={lineId} delay={index * 0.06} className="cart-item-card">
                    <ProductIllustration visual={product.visual} name={product.name} />
                    <div className="cart-item-details">
                      <Link className="cart-item-name" to={`/product/${product.id}`}>{product.name}</Link>
                      {personalization && <p className="cart-personalization">Personalisation: {personalization}</p>}
                      <div className="cart-item-controls">
                        <div className="cart-quantity-control" aria-label={`Quantity for ${product.name}`}>
                          <button type="button" aria-label="Decrease quantity" onClick={() => cart.setQuantity(lineId, quantity - 1)}>−</button>
                          <span aria-live="polite">{quantity}</span>
                          <button type="button" aria-label="Increase quantity" onClick={() => cart.setQuantity(lineId, quantity + 1)}>+</button>
                        </div>
                        <button className="cart-remove-button" type="button" onClick={() => cart.remove(lineId)}>Remove</button>
                      </div>
                    </div>
                    <strong className="cart-item-price">{formatPrice(product.price * quantity)}</strong>
                  </Reveal>
                ))}
              </div>
            </div>

            <Reveal className="cart-order-summary" delay={0.08}>
              <h2>Order summary</h2>
              <div className="cart-summary-row"><span>Subtotal</span><strong>{formatPrice(cart.subtotal)}</strong></div>
              <div className="cart-summary-row"><span>Estimated delivery</span><strong>{shipping === 0 ? 'Free' : formatPrice(shipping)}</strong></div>
              <div className="cart-summary-row"><span>Taxes</span><span>Included</span></div>
              <form className="cart-coupon-form" onSubmit={applyCoupon}>
                <label className="sr-only" htmlFor="cart-coupon">Coupon code</label>
                <input id="cart-coupon" value={coupon} onChange={e => { setCoupon(e.target.value); setCouponMessage(''); if (cart.coupon) cart.clearCoupon(); }} placeholder="Coupon code" autoComplete="off" />
                <button type="submit" disabled={couponBusy}>{couponBusy ? 'Checking…' : 'Apply'}</button>
              </form>
              {cart.coupon && <div className="cart-summary-row"><span>Coupon ({cart.coupon.code})</span><strong>−{formatPrice(cart.couponDiscount)}</strong><button type="button" className="remove-button" onClick={() => { cart.clearCoupon(); setCoupon(''); setCouponMessage('Coupon removed.'); }}>Remove</button></div>}
              {couponMessage && <p className="cart-coupon-message" role="status">{couponMessage}</p>}
              <div className="cart-summary-total"><span>Total</span><strong>{formatPrice(total)}</strong></div>
              <Link className="cart-primary-button cart-checkout-button" to="/checkout">Proceed to checkout</Link>
              <p className="cart-summary-note">Personalised items are made after your order is confirmed.</p>
            </Reveal>
          </div>
        )}
      </div>
    </main>
  );
}
