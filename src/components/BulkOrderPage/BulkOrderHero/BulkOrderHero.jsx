import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./BulkOrderHero.css";

const products = [
  { type: "orbit", label: "3D PRINT", delay: "0s" },
  { type: "orbit", label: "3D PRINT", delay: "0.12s" },
  { type: "orbit", label: "3D PRINT", delay: "0.24s" },
  { type: "bottle", delay: "0.1s" },
  { type: "gift", delay: "0.22s" },
  { type: "nameplate", label: "YOUR NAME", delay: "0.34s" },
];

function ProductIllustration({ type, label }) {
  if (type === "orbit") {
    return (
      <div className="bulk-illustration bulk-illustration--orbit">
        <span className="bulk-orbit-ring" />

        <div className="bulk-orbit-button">
          <span className="bulk-orbit-dot" />
          {label}
        </div>

        <span className="bulk-orbit-shadow" />
      </div>
    );
  }

  if (type === "bottle") {
    return (
      <div className="bulk-illustration bulk-illustration--bottle">
        <span className="bulk-bottle-straw bulk-bottle-straw--one" />
        <span className="bulk-bottle-straw bulk-bottle-straw--two" />
        <span className="bulk-bottle-straw bulk-bottle-straw--three" />

        <div className="bulk-bottle">
          <span />
        </div>

        <span className="bulk-product-shadow" />
      </div>
    );
  }

  if (type === "gift") {
    return (
      <div className="bulk-illustration bulk-illustration--gift">
        <span className="bulk-gift-bow bulk-gift-bow--left" />
        <span className="bulk-gift-bow bulk-gift-bow--right" />

        <div className="bulk-gift-box">
          <span className="bulk-gift-ribbon" />
        </div>

        <span className="bulk-product-shadow" />
      </div>
    );
  }

  return (
    <div className="bulk-illustration bulk-illustration--nameplate">
      <div className="bulk-nameplate">
        <span>{label}</span>
      </div>

      <span className="bulk-product-shadow" />
    </div>
  );
}

export default function BulkOrderHero() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return undefined;

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`bulk-order-hero${isVisible ? " is-visible" : ""}`}
      aria-labelledby="bulk-order-heading"
    >
      <div className="bulk-order-hero__inner">
        <div className="bulk-order-hero__content">
          <nav
            className="bulk-order-hero__breadcrumb"
            aria-label="Breadcrumb"
          >
            <Link to="/">Home</Link>

            <span aria-hidden="true">/</span>

            <span aria-current="page">Bulk orders</span>
          </nav>

          <h1
            id="bulk-order-heading"
            className="bulk-order-hero__title"
          >
            Bulk &amp; event orders,
            <br />
            made to match
          </h1>

          <p className="bulk-order-hero__description">
            Corporate gifts, fest merchandise, wedding favours and return
            gifts — with your logo, theme or every guest&apos;s name. We
            share a sample before the full run.
          </p>

          <Link
            to="/bulk-orders#bulk-quote"
            className="bulk-order-hero__cta"
          >
            Get a bulk quote
            <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div
          className="bulk-order-hero__visuals"
          role="img"
          aria-label="Illustrations of personalised products, bottles, gifts and nameplates"
        >
          {products.map((product, index) => (
            <div
              key={`${product.type}-${index}`}
              className="bulk-order-hero__tile"
              style={{ "--tile-delay": product.delay }}
              aria-hidden="true"
            >
              <ProductIllustration
                type={product.type}
                label={product.label}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}