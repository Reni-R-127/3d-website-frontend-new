import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice.js';
import { useCart } from '../context/CartContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { apiRequest, normalizeProduct } from '../utils/api.js';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);
  const [personalization, setPersonalization] = useState('');
  const [added, setAdded] = useState(false);
  const cart = useCart();
  useDocumentTitle(product?.name || 'Product');

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(''); setProduct(null); setAdded(false); setQty(1); setPersonalization('');
    Promise.all([apiRequest(`/products/${encodeURIComponent(id)}`), apiRequest('/products?limit=12')])
      .then(([detail, list]) => {
        if (cancelled) return;
        const current = normalizeProduct(detail.data || detail);
        setProduct(current);
        setRelated((list.data || list.items || []).map(normalizeProduct).filter((item) => item.id !== current.id).slice(0, 3));
      })
      .catch((requestError) => { if (!cancelled) setError(requestError.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <section className="section container empty-state"><span className="eyebrow">PRODUCT CATALOGUE</span><h1>Loading product…</h1><p>Fetching the latest product details from the store.</p></section>;
  if (error || !product) return <section className="section container empty-state"><span className="eyebrow">PRODUCT NOT AVAILABLE</span><h1>We couldn't load this print.</h1><p>{error || 'The product may have been unpublished or removed.'}</p><Link className="button coral" to="/shop">Back to shop</Link></section>;

  const canOrder = product.status !== 'Out of stock' || product.madeToOrder;
  return <section className="section container">
    <p className="breadcrumbs"><Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / {product.name}</p>
    <div className="product-detail">
      <div className={`product-art detail-art art-${product.visual}`}>
        {product.imageUrl ? <img src={product.imageUrl} alt={product.name} /> : <span className="art-icon">{({ key: 'A', vase: '♨', lamp: '☾', dino: '〰', rocket: '🚀', paint: '✿' })[product.visual] || '◆'}</span>}
      </div>
      <div>
        <span className="eyebrow">{product.category}</span><h1>{product.name}</h1>
        <p className="detail-price">{formatPrice(product.price)} {product.oldPrice && <del>{formatPrice(product.oldPrice)}</del>}</p>
        <p>{product.description || 'Product details will be confirmed by the ProJenius 3D team.'}</p>
        <p className="stock">● {product.status}</p>
        {product.personalize && <label className="option-field">Personalisation note<input value={personalization} onChange={(event) => setPersonalization(event.target.value)} maxLength={250} placeholder="Name or message to print" /></label>}
        <label className="option-field">Quantity<div className="quantity"><button type="button" aria-label="Decrease quantity" onClick={() => setQty(Math.max(1, qty - 1))}>−</button><output>{qty}</output><button type="button" aria-label="Increase quantity" onClick={() => setQty(Math.min(99, qty + 1))}>+</button></div></label>
        <button className="button coral" disabled={!canOrder} onClick={() => { cart.add(product, qty, product.personalize ? personalization : ''); setAdded(true); }}>{canOrder ? `Add to cart — ${formatPrice(product.price * qty)}` : 'Currently unavailable'}</button>
        {added && <p className="form-success" role="status">Added to cart. <Link to="/cart">View cart ↗</Link></p>}
        <p className="fine-print">Free standard delivery above ₹999. Customisations are confirmed before printing.</p>
      </div>
    </div>
    {related.length > 0 && <><h2 className="related-title">You may also like</h2><div className="product-grid">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></>}
  </section>;
}
