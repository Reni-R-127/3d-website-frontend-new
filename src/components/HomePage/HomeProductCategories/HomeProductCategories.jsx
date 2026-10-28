import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../../utils/api.js";
import { ArrowRight, ShoppingBag } from "lucide-react";
import "./HomeProductCategories.css";

function categoryTheme(name = "") {
  const value = String(name).toLowerCase();
  if (value.includes("key")) return "keychain";
  if (value.includes("decor") || value.includes("vase") || value.includes("lamp")) return "vase";
  if (value.includes("toy") || value.includes("kid") || value.includes("kit")) return "dinosaur";
  if (value.includes("gift")) return "gift";
  if (value.includes("functional") || value.includes("stand") || value.includes("organ")) return "stand";
  if (value.includes("figurine") || value.includes("statue") || value.includes("model")) return "figurine";
  return "keychain";
}

function normalizeCategory(row) {
  const title = String(row?.name || row?.title || row?.categoryName || "").trim();
  return {
    id: String(row?._id || row?.id || row?.slug || title),
    title,
    description: String(row?.description || "Browse published 3D prints"),
    category: title,
    theme: categoryTheme(title),
  };
}

function ProductIllustration({ theme }) {
  return (
    <div className={`hpc-art hpc-art--${theme}`} aria-hidden="true">
      <span className="hpc-art__shadow" />

      {theme === "keychain" && (
        <div className="hpc-keychain">
          <span className="hpc-keychain__ring" />
          <span className="hpc-keychain__tag">NAME</span>
        </div>
      )}

      {theme === "vase" && (
        <div className="hpc-vase">
          <span className="hpc-vase__rim" />
          <span className="hpc-vase__line hpc-vase__line--one" />
          <span className="hpc-vase__line hpc-vase__line--two" />
          <span className="hpc-vase__line hpc-vase__line--three" />
          <span className="hpc-vase__line hpc-vase__line--four" />
        </div>
      )}

      {theme === "dinosaur" && (
        <div className="hpc-dino">
          <span className="hpc-dino__body" />
          <span className="hpc-dino__neck" />
          <span className="hpc-dino__head" />
          <span className="hpc-dino__eye" />
          <span className="hpc-dino__tail" />
          <span className="hpc-dino__leg hpc-dino__leg--one" />
          <span className="hpc-dino__leg hpc-dino__leg--two" />
          <span className="hpc-dino__spikes" />
        </div>
      )}

      {theme === "gift" && (
        <div className="hpc-gift">
          <span className="hpc-gift__box" />
          <span className="hpc-gift__ribbon" />
          <span className="hpc-gift__bow hpc-gift__bow--one" />
          <span className="hpc-gift__bow hpc-gift__bow--two" />
        </div>
      )}

      {theme === "stand" && (
        <div className="hpc-stand">
          <span className="hpc-stand__base" />
          <span className="hpc-stand__neck" />
          <span className="hpc-stand__holder" />
        </div>
      )}

      {theme === "figurine" && (
        <div className="hpc-figurine">
          <span className="hpc-figurine__head" />
          <span className="hpc-figurine__body" />
          <span className="hpc-figurine__base" />
          <span className="hpc-figurine__shine" />
        </div>
      )}
    </div>
  );
}

function CategoryCard({ category, index }) {
  const destination =
    category.href || `/shop?category=${encodeURIComponent(category.category)}`;

  return (
    <Link
      to={destination}
      className="hpc-card"
      style={{ "--hpc-index": index }}
      aria-label={`Explore ${category.title}`}
    >
      <div className="hpc-card__art-wrap">
        <ProductIllustration theme={category.theme} />

        <span className="hpc-card__art-badge" aria-hidden="true">
          <ShoppingBag size={15} strokeWidth={1.8} />
        </span>
      </div>

      <div className="hpc-card__content">
        <h3>{category.title}</h3>
        <p>{category.description}</p>

        <span className="hpc-card__link">
          Explore
          <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

export default function HomeProductCategories() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      apiRequest("/categories").catch((error) => ({ error })),
      apiRequest("/products?limit=300").catch((error) => ({ error })),
    ]).then(([categoryResult, productResult]) => {
      if (cancelled) return;
      const categoryRows = Array.isArray(categoryResult?.data) ? categoryResult.data : Array.isArray(categoryResult?.items) ? categoryResult.items : [];
      const productRows = Array.isArray(productResult?.data) ? productResult.data : Array.isArray(productResult?.items) ? productResult.items : [];
      let rows = categoryRows.map(normalizeCategory).filter((row) => row.title);
      if (!rows.length && productRows.length) {
        const uniqueNames = [...new Set(productRows.map((product) => String(product.categoryName || product.category?.name || product.category || "").trim()).filter(Boolean))];
        rows = uniqueNames.map((name) => normalizeCategory({ name, description: "Browse published 3D prints" }));
      }
      setCategories(rows);
      if (!rows.length && categoryResult?.error && productResult?.error) setCategoriesError(categoryResult.error.message || productResult.error.message || "Categories could not be loaded.");
    }).catch((error) => { if (!cancelled) setCategoriesError(error.message || "Categories could not be loaded."); })
      .finally(() => { if (!cancelled) setCategoriesLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          // Reset when the section leaves the viewport,
          // so it animates again on the next visit.
          setIsVisible(false);
        }
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`home-product-categories ${isVisible ? "hpc--visible" : ""}`}
      aria-labelledby="hpc-title"
    >
      <div className="hpc-container">
        <header className="hpc-header">
          <div className="hpc-header__copy hpc-reveal">
            <span className="hpc-eyebrow">SHOP BY CATEGORY</span>

            <h2 id="hpc-title">
              Ready to order <span>today?</span>
            </h2>

            <p className="hpc-header__mobile-description">
              Find something special or create a print of your own.
            </p>
          </div>

          <Link to="/shop" className="hpc-view-all hpc-reveal">
            View all products
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </header>

        <div className="hpc-grid">
          {categories.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>
        {categoriesLoading && <p className="hpc-empty" role="status">Loading categories…</p>}
        {!categoriesLoading && categoriesError && <p className="hpc-empty" role="alert">{categoriesError}</p>}
        {!categoriesLoading && !categoriesError && categories.length === 0 && <p className="hpc-empty">No product categories have been added yet.</p>}

        {/* <div className="hpc-bottom-note hpc-reveal">
          <span className="hpc-bottom-note__dot" />
          <p>
            Made with care. Personalised for you. Printed layer by layer.
          </p>
          <Link to="/custom-printing">
            Create your own
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div> */}
      </div>
    </section>
  );
}
