import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import { apiRequest, normalizeProduct } from "../../../utils/api.js";
import "./HomeKidsCreativeKits.css";

function ProductIllustration({ theme, age, imageUrl, name }) {
  return (
    <div
      className={`hck-art hck-art--${theme}`}
      aria-label={`${theme} product illustration`}
      role="img"
    >
      {imageUrl ? <img className="hck-art__product-image" src={imageUrl} alt={name} loading="lazy" /> : <><span className="hck-art__shadow" />

      <span className="hck-art__age">{age}</span>

      {theme === "dino" && (
        <div className="hck-dino">
          <span className="hck-dino__tail" />
          <span className="hck-dino__body" />
          <span className="hck-dino__neck" />
          <span className="hck-dino__head" />
          <span className="hck-dino__eye" />
          <span className="hck-dino__leg hck-dino__leg--one" />
          <span className="hck-dino__leg hck-dino__leg--two" />
          <span className="hck-dino__stripes" />
        </div>
      )}

      {theme === "rocket" && (
        <div className="hck-rocket">
          <span className="hck-rocket__body" />
          <span className="hck-rocket__window" />
          <span className="hck-rocket__fin hck-rocket__fin--left" />
          <span className="hck-rocket__fin hck-rocket__fin--right" />
          <span className="hck-rocket__flame" />
        </div>
      )}

      {theme === "figurine" && (
        <div className="hck-figurine">
          <span className="hck-figurine__head" />
          <span className="hck-figurine__body" />
          <span className="hck-figurine__base" />
          <span className="hck-figurine__shine" />
        </div>
      )}</>}
    </div>
  );
}

function ProductCard({ product, index, onAddToCart }) {
  return (
    <article
      className="hck-card hck-reveal"
      style={{ "--hck-delay": `${index * 140}ms` }}
    >
      <Link
        to={`/product/${product.id}`}
        className="hck-card__image-link"
        aria-label={`View ${product.name}`}
      >
        <ProductIllustration theme={product.theme} age={product.age || "Made to order"} imageUrl={product.imageUrl} name={product.name} />
      </Link>

      <div className="hck-card__content">
        <span className="hck-card__category">
          TOYS &amp; CREATIVE KITS
        </span>

        <Link
          to={`/product/${product.id}`}
          className="hck-card__title"
        >
          {product.name}
        </Link>

        <p className="hck-card__price">
          ₹{Number(product.price || 0).toLocaleString("en-IN")}
        </p>

        <span
          className={`hck-card__stock hck-card__stock--${product.stockStatus}`}
        >
          <span aria-hidden="true" />
          {product.stock}
        </span>

        <button type="button" className="hck-card__button" disabled={product.status === "Out of stock" && !product.madeToOrder} onClick={() => onAddToCart(product)}>
          {product.status === "Out of stock" && !product.madeToOrder ? "Out of stock" : "Add to cart"}
        </button>
      </div>
    </article>
  );
}

export default function HomeKidsCreativeKits() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { add: addToCart } = useCart();

  useEffect(() => {
    let cancelled = false;
    apiRequest("/products?limit=300")
      .then((payload) => {
        if (cancelled) return;
        const items = (payload.data || payload.items || []).map(normalizeProduct);
        setProducts(items.filter((product) => /toy|creative kit|kids|figurine kit/i.test(`${product.category} ${product.name}`)).map((product) => ({
          ...product,
          theme: product.visual === "rocket" ? "rocket" : product.visual === "paint" ? "figurine" : "dino",
          age: product.age || product.ageGuidance || "Product details",
          stock: product.status,
          stockStatus: product.status === "Low stock" ? "low" : product.status === "Out of stock" ? "unavailable" : "available",
        })));
      })
      .catch((requestError) => { if (!cancelled) setError(requestError.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return undefined;

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    if (
      motionPreference.matches ||
      !("IntersectionObserver" in window)
    ) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const handleAddToCart = (product) => addToCart(product);

  return (
    <section
      ref={sectionRef}
      className={`home-kids-creative-kits ${
        isVisible ? "hck--visible" : ""
      }`}
      aria-labelledby="hck-title"
    >
      <div className="hck-container">
        <header className="hck-header hck-reveal">
          <div>
            <span className="hck-eyebrow">
              KIDS’ TOYS &amp; CREATIVE KITS
            </span>

            <h2 id="hck-title">
              Wiggle, build, paint, puzzle
            </h2>
          </div>

          <Link
            to="/kids-creative-kits"
            className="hck-shop-link"
          >
            Shop kids' kits
          </Link>
        </header>

        <div className="hck-grid">
          {products.map((product, index) => <ProductCard key={product.id} product={product} index={index} onAddToCart={handleAddToCart} />)}
        </div>
        {loading && <p className="hck-empty" role="status">Loading available products…</p>}
        {!loading && error && <p className="hck-empty" role="alert">{error}</p>}
        {!loading && !error && products.length === 0 && <p className="hck-empty">No published toys or creative kits are available yet.</p>}

        <p className="hck-note hck-reveal">
          Age guidance is indicative. Many items contain small parts
          — not suitable for children under 3. Adult supervision
          recommended.
        </p>
      </div>
    </section>
  );
}