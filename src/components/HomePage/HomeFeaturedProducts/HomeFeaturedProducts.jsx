import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "../../../context/CartContext";
import { apiRequest, normalizeProduct } from "../../../utils/api.js";
import "./HomeFeaturedProducts.css";

function ProductArtwork({ theme, label }) {
  return (
    <div
      className={`hfp-art hfp-art--${theme}`}
      aria-hidden="true"
    >
      <span className="hfp-art__shadow" />

      {theme === "keychain" && (
        <div className="hfp-keychain">
          <span className="hfp-keychain__ring" />
          <span className="hfp-keychain__tag">
            <span>{String(label || "3D PRINT").slice(0, 12).toUpperCase()}</span>
          </span>
        </div>
      )}

      {theme === "vase" && (
        <div className="hfp-vase">
          <span className="hfp-vase__rim" />
          <span className="hfp-vase__stripe hfp-vase__stripe--one" />
          <span className="hfp-vase__stripe hfp-vase__stripe--two" />
          <span className="hfp-vase__stripe hfp-vase__stripe--three" />
          <span className="hfp-vase__stripe hfp-vase__stripe--four" />
        </div>
      )}

      {theme === "moon" && (
        <div className="hfp-moon">
          <span className="hfp-moon__crater hfp-moon__crater--one" />
          <span className="hfp-moon__crater hfp-moon__crater--two" />
          <span className="hfp-moon__crater hfp-moon__crater--three" />
          <span className="hfp-moon__crater hfp-moon__crater--four" />
          <span className="hfp-moon__base" />
        </div>
      )}

      {theme === "dino" && (
        <div className="hfp-dino">
          <span className="hfp-dino__body" />
          <span className="hfp-dino__neck" />
          <span className="hfp-dino__head" />
          <span className="hfp-dino__eye" />
          <span className="hfp-dino__tail" />
          <span className="hfp-dino__leg hfp-dino__leg--one" />
          <span className="hfp-dino__leg hfp-dino__leg--two" />
          <span className="hfp-dino__ribs" />
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, index, addToCart }) {
  const handleAction = () => {
    if (product.personalized) {
      return;
    }

    addToCart(product);
  };

  return (
    <article
      className="hfp-card"
      style={{ "--hfp-index": index }}
    >
      <Link
        to={product.href}
        className="hfp-card__art-link"
        aria-label={`View ${product.name}`}
      >
        {product.imageUrl ? <img className="hfp-card__image" src={product.imageUrl} alt={product.name} loading="lazy" /> : <ProductArtwork theme={product.theme} label={product.name} />}

        <span
          className={`hfp-badge ${
            product.badge === "Personalise" ||
            String(product.badge || "").startsWith("-")
              ? "hfp-badge--highlight"
              : ""
          }`}
        >
          {product.badge}
        </span>
      </Link>

      <div className="hfp-card__content">
        <span className="hfp-card__category">
          {product.category}
        </span>

        <Link
          to={product.href}
          className="hfp-card__title-link"
        >
          <h3>{product.name}</h3>
        </Link>

        <div className="hfp-card__price">
          <span>₹{product.price.toLocaleString("en-IN")}</span>

          {product.originalPrice && (
            <del>
              ₹{product.originalPrice.toLocaleString("en-IN")}
            </del>
          )}
        </div>

        <p
          className={`hfp-card__stock hfp-card__stock--${product.stockType}`}
        >
          <span aria-hidden="true" />
          {product.stock}
        </p>

        {product.personalized ? (
          <Link
            to={product.href}
            className="hfp-card__button"
          >
            {product.action}
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        ) : (
          <button
            type="button"
            className="hfp-card__button"
            onClick={handleAction}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag size={15} aria-hidden="true" />
            {product.action}
          </button>
        )}
      </div>
    </article>
  );
}

export default function HomeFeaturedProducts() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const { add: addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");

  useEffect(() => {
    let cancelled = false;
    apiRequest("/products?featured=true&limit=4")
      .then((payload) => {
        if (cancelled) return;
        const records = (payload.data || payload.items || []).map(normalizeProduct);
        setProducts(records.map((product) => ({
          ...product,
          category: String(product.category || "3D PRINTS").toUpperCase(),
          badge: product.personalize ? "Personalise" : product.oldPrice ? `-${Math.round((1 - product.price / product.oldPrice) * 100)}%` : "Featured",
          stock: product.status,
          stockType: product.status === "In stock" ? "available" : product.status === "Low stock" ? "low-stock" : product.status === "Made to order" ? "made-to-order" : "unavailable",
          theme: ({ key: "keychain", vase: "vase", lamp: "moon", dino: "dino", rocket: "dino", paint: "dino" })[product.visual] || "keychain",
          action: product.personalize ? "Personalise" : "Add to cart",
          href: product.personalize ? "/personalized-gifts" : `/product/${product.id}`,
          personalized: Boolean(product.personalize),
        })));
      })
      .catch((error) => { if (!cancelled) setProductsError(error.message); })
      .finally(() => { if (!cancelled) setProductsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return undefined;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -25px 0px",
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`home-featured-products ${
        isVisible ? "hfp--visible" : ""
      }`}
      aria-labelledby="hfp-title"
    >
      <div className="hfp-container">
        <header className="hfp-header">
          <div className="hfp-header__copy">
            <span className="hfp-eyebrow hfp-reveal">
              FEATURED
            </span>

            <h2 id="hfp-title" className="hfp-reveal">
              Customer favourites
            </h2>
          </div>

          <Link
            to="/shop"
            className="hfp-view-all hfp-reveal"
          >
            See all products
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </header>

        <div className="hfp-grid">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} addToCart={addToCart} />
          ))}
        </div>
        {productsLoading && <p className="hfp-empty" role="status">Loading featured products…</p>}
        {!productsLoading && productsError && <p className="hfp-empty" role="alert">{productsError}</p>}
        {!productsLoading && !productsError && products.length === 0 && <p className="hfp-empty">No featured products have been published yet. Check back soon or browse the full catalogue.</p>}
      </div>
    </section>
  );
}
