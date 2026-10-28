import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { useCart } from "../context/CartContext.jsx";
import { apiRequest } from "../utils/api.js";
import { formatPrice } from "../utils/formatPrice.js";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import "./CheckoutPage.css";

const deliveryOptions = [
  {
    id: "standard",
    title: "Standard delivery",
    detail: "Estimated timeline",
    price: 79,
  },
  {
    id: "express",
    title: "Express delivery",
    detail: "Where available",
    price: 179,
  },
  {
    id: "pickup",
    title: "Studio pickup",
    detail: "We'll share pickup details",
    price: 0,
  },
];
const paymentOptions = [
  { id: "upi", title: "UPI", detail: "Instructions confirmed by the team" },
  { id: "card", title: "Card", detail: "Not processed online yet" },
  { id: "bank", title: "Net banking", detail: "Not processed online yet" },
  { id: "cod", title: "Cash on delivery", detail: "Subject to studio confirmation" },
];
const states = [
  "Tamil Nadu",
  "Kerala",
  "Karnataka",
  "Andhra Pradesh",
  "Telangana",
  "Maharashtra",
  "Delhi",
  "Other",
];

function Reveal({ children, className = "", delay = 0 }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.12 }}
      transition={{
        duration: reduceMotion ? 0 : 0.42,
        delay: reduceMotion ? 0 : delay,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}
function ProductThumb({ visual, name }) {
  const icons = {
    dino: "🦕",
    key: "🔑",
    vase: "🏺",
    lamp: "🌙",
    rocket: "🚀",
    paint: "🎨",
  };
  return (
    <span
      className={`checkout-thumb art-${visual || "default"}`}
      role="img"
      aria-label={`${name} illustration`}
    >
      {icons[visual] || "◆"}
    </span>
  );
}

export default function CheckoutPage() {
  useDocumentTitle("Checkout");
  const cart = useCart();
  const [delivery, setDelivery] = useState("standard");
  const [payment, setPayment] = useState("upi");
  const [accepted, setAccepted] = useState(false);
  const [message, setMessage] = useState("");
  const [shippingThreshold, setShippingThreshold] = useState(999);

  useEffect(() => {
    let cancelled = false;
    apiRequest("/settings/public")
      .then((result) => {
        const threshold = Number((result.data || result)?.shippingThreshold);
        if (!cancelled && Number.isFinite(threshold) && threshold >= 0) setShippingThreshold(threshold);
      })
      .catch(() => { /* The server uses its documented default threshold when no store setting exists. */ });
    return () => { cancelled = true; };
  }, []);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pin: "",
  });
  const items = useMemo(
    () =>
      Object.entries(cart.items).map(([lineId, item]) => ({ lineId, ...item })),
    [cart.items],
  );
  const deliveryFee = !items.length || delivery === "pickup"
    ? 0
    : delivery === "express"
      ? 179
      : cart.subtotal >= shippingThreshold
        ? 0
        : 79;
  const total = cart.subtotal - cart.couponDiscount + deliveryFee;
  const update = (event) =>
    setForm((old) => ({ ...old, [event.target.name]: event.target.value }));

  async function submit(event) {
    event.preventDefault();
    setMessage("");
    try {
      const result = await apiRequest("/orders", {
        method: "POST",
        body: JSON.stringify({
          customer: {
            ...form,
            address: `${form.address}, ${form.city}, ${form.state} ${form.pin}`,
          },
          items: items.map(({ product, quantity, personalization }) => ({
            productId: product._id || product.id,
            quantity,
            personalization: personalization || "",
          })),
          paymentMethod: payment,
          deliveryMethod: delivery,
          couponCode: cart.coupon?.code || '', 
        }),
      });
      cart.clear();
      setMessage(
        `Order ${result.data?.orderNumber || ""} was saved. ${result.message || "Our team will confirm the next steps."}`,
      );
    } catch (error) {
      setMessage(error.message || "Unable to place order. Please try again.");
    }
  }

  if (!items.length)
    return (
      <main className="checkout-page">
        <div className="checkout-inner">
          <Reveal className="checkout-empty">
            <span aria-hidden="true">🛒</span>
            <h1>Your cart is empty</h1>
            <p>Add a product before continuing to checkout.</p>
            <Link className="checkout-primary" to="/shop">
              Explore products
            </Link>
          </Reveal>
        </div>
      </main>
    );

  return (
    <main className="checkout-page">
      <div className="checkout-inner">
        <div className="checkout-main">
          <Reveal className="checkout-heading">
            <h1>Checkout</h1>
            <p>
              Have an account? <Link to="/contact">Sign in</Link> · or continue
              as guest
            </p>
          </Reveal>
          <form className="checkout-form" onSubmit={submit}>
            <Reveal className="checkout-panel">
              <h2>
                <span>1</span> Contact details
              </h2>
              <div className="checkout-fields two-cols">
                <label>
                  Full name
                  <input
                    name="name"
                    value={form.name}
                    onChange={update}
                    placeholder="Your name"
                    autoComplete="name"
                    required
                  />
                </label>
                <label>
                  Phone
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={update}
                    placeholder="+91 for delivery updates"
                    autoComplete="tel"
                    type="tel"
                    required
                  />
                </label>
                <label className="field-full">
                  Email
                  <input
                    name="email"
                    value={form.email}
                    onChange={update}
                    placeholder="name@example.com"
                    autoComplete="email"
                    type="email"
                    required
                  />
                </label>
              </div>
            </Reveal>
            <Reveal className="checkout-panel" delay={0.04}>
              <h2>
                <span>2</span> Delivery address
              </h2>
              <div className="checkout-fields">
                <label>
                  House / flat, street
                  <input
                    name="address"
                    value={form.address}
                    onChange={update}
                    placeholder="Door no., street, area"
                    autoComplete="street-address"
                    required
                  />
                </label>
                <div className="three-cols">
                  <label>
                    City
                    <input
                      name="city"
                      value={form.city}
                      onChange={update}
                      placeholder="City"
                      autoComplete="address-level2"
                      required
                    />
                  </label>
                  <label>
                    State
                    <select
                      name="state"
                      value={form.state}
                      onChange={update}
                      autoComplete="address-level1"
                      required
                    >
                      <option value="">Select state</option>
                      {states.map((state) => (
                        <option key={state}>{state}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    PIN code
                    <input
                      name="pin"
                      value={form.pin}
                      onChange={update}
                      placeholder="6-digit PIN"
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      autoComplete="postal-code"
                      required
                    />
                  </label>
                </div>
                <fieldset className="checkout-choice-group">
                  <legend>Delivery option</legend>
                  {deliveryOptions.map((option) => (
                    <label
                      className={`delivery-choice ${delivery === option.id ? "selected" : ""}`}
                      key={option.id}
                    >
                      <input
                        type="radio"
                        name="delivery"
                        value={option.id}
                        checked={delivery === option.id}
                        onChange={() => setDelivery(option.id)}
                      />
                      <span className="choice-copy">
                        <strong>{option.title}</strong>
                        <small>{option.detail}</small>
                      </span>
                      <b>
                        {option.id === "pickup" || (option.id === "standard" && cart.subtotal >= shippingThreshold)
                          ? "Free"
                          : `+${formatPrice(option.price)}`}
                      </b>
                    </label>
                  ))}
                </fieldset>
              </div>
            </Reveal>
            <Reveal className="checkout-panel" delay={0.08}>
              <div className="checkout-panel-title">
                <h2>
                  <span>3</span> Payment
                </h2>
                <span className="preview-badge">
                  Payment method preference
                </span>
              </div>
              <div className="payment-options">
                {paymentOptions.map((option) => (
                  <label
                    className={`payment-choice ${payment === option.id ? "selected" : ""}`}
                    key={option.id}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={option.id}
                      checked={payment === option.id}
                      onChange={() => setPayment(option.id)}
                    />
                    <strong>{option.title}</strong>
                    <small>{option.detail}</small>
                  </label>
                ))}
              </div>
              <label className="checkout-terms">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(event) => setAccepted(event.target.checked)}
                  required
                />{" "}
                I agree to the <Link to="/faq">terms</Link> and understand
                personalised items are made to order.
              </label>
            </Reveal>
            <button className="checkout-primary checkout-submit" type="submit">
              Place order · {formatPrice(total)}
            </button>
            {message && (
              <p className="checkout-message" role="status">
                {message}
              </p>
            )}
          </form>
        </div>
        <Reveal className="checkout-summary" delay={0.1}>
          <h2>
            Order summary · {cart.count} {cart.count === 1 ? "item" : "items"}
          </h2>
          <div className="checkout-summary-items">
            {items.map(({ lineId, product, quantity, personalization }) => (
              <div className="checkout-summary-item" key={lineId}>
                <ProductThumb visual={product.visual} name={product.name} />
                <span>
                  {product.name}
                  {personalization ? ` · ${personalization}` : ""} × {quantity}
                </span>
                <strong>{formatPrice(product.price * quantity)}</strong>
              </div>
            ))}
          </div>
          <div className="checkout-total-row">
            <span>Subtotal</span>
            <strong>{formatPrice(cart.subtotal)}</strong>
          </div>
          <div className="checkout-total-row">
            <span>Delivery</span>
            <strong>{deliveryFee ? formatPrice(deliveryFee) : "Free"}</strong>
          </div>
          {cart.coupon && <div className="checkout-total-row"><span>Coupon ({cart.coupon.code})</span><strong>−{formatPrice(cart.couponDiscount)}</strong></div>}
          <div className="checkout-grand-total">
            <span>Total</span>
            <strong>{formatPrice(total)}</strong>
          </div>
          <button
            className="checkout-primary summary-submit"
            type="submit"
            form="checkout-hidden-form"
            onClick={(event) => {
              event.preventDefault();
              document.querySelector(".checkout-submit")?.click();
            }}
          >
            Place order · {formatPrice(total)}
          </button>
          <p className="checkout-disclaimer">
            Online payments are not processed on this website yet. Selecting UPI, card or net banking records your preference only; the team will confirm payment instructions separately.
          </p>
        </Reveal>
      </div>
    </main>
  );
}
