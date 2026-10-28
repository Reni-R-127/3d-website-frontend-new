import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import ProductCard from "../components/ProductCard.jsx";
import Reveal from "../components/Reveal.jsx";

import useDocumentTitle from "../hooks/useDocumentTitle.js";
import { apiRequest, normalizeProduct } from "../utils/api.js";
import "./ShopPage.css";

const PRICE_FILTERS = [
  { label: "Any price", value: "all" },
  { label: "Under ₹300", value: "under-300" },
  { label: "₹300 – ₹700", value: "300-700" },
  { label: "₹700 – ₹1,200", value: "700-1200" },
  { label: "Above ₹1,200", value: "above-1200" },
];

const AVAILABILITY_FILTERS = [
  "In stock",
  "Low stock",
  "Made to order",
  "Out of stock",
];

const DEFAULT_CATEGORY_LABELS = [{ label: "All products", value: "All" }];

function priceMatches(price, range) {
  if (range === "under-300") return price < 300;
  if (range === "300-700") return price >= 300 && price <= 700;
  if (range === "700-1200") return price > 700 && price <= 1200;
  if (range === "above-1200") return price > 1200;
  return true;
}

export default function ShopPage() {
  useDocumentTitle("Shop");
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get("search") || "");
  const [priceRange, setPriceRange] = useState(params.get("price") || "all");
  const [availability, setAvailability] = useState(
    params.getAll("availability"),
  );
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categoryLabels, setCategoryLabels] = useState(DEFAULT_CATEGORY_LABELS);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      apiRequest("/products?limit=300"),
      apiRequest("/categories").catch(() => ({ data: [] })),
    ])
      .then(([productPayload, categoryPayload]) => {
        if (cancelled) return;
        const records = (productPayload.data || productPayload.items || []).map(normalizeProduct);
        setProducts(records);
        const categoryRows = categoryPayload.data || categoryPayload.items || [];
        const savedNames = categoryRows.map((row) => String(row.name || row.title || "").trim()).filter(Boolean);
        const names = savedNames.length ? savedNames : [...new Set(records.map((product) => String(product.category || "").trim()).filter((name) => name && name !== "Other"))];
        setCategoryLabels([...DEFAULT_CATEGORY_LABELS, ...names.map((name) => ({ label: name, value: name }))]);
      })
      .catch((error) => { if (!cancelled) setProductsError(error.message); })
      .finally(() => { if (!cancelled) setProductsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const category = params.get("category") || "All";
  const sort = params.get("sort") || "featured";

  useEffect(() => {
    setSearch(params.get("search") || "");
    setPriceRange(params.get("price") || "all");
    setAvailability(params.getAll("availability"));
  }, [params]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setParams(
        (current) => {
          const next = new URLSearchParams(current);
          const query = search.trim();
          if (query) next.set("search", query);
          else next.delete("search");
          return next;
        },
        { replace: true },
      );
    }, 180);
    return () => window.clearTimeout(timer);
  }, [search, setParams]);

  const list = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const matchesCategory =
        category === "All" || product.category === category;
      const matchesSearch =
        !query ||
        `${product.name} ${product.category} ${product.description}`
          .toLowerCase()
          .includes(query);
      const matchesPrice = priceMatches(product.price, priceRange);
      const matchesAvailability =
        availability.length === 0 || availability.includes(product.status);
      return (
        matchesCategory && matchesSearch && matchesPrice && matchesAvailability
      );
    });

    if (sort === "price-low")
      return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === "price-high")
      return [...filtered].sort((a, b) => b.price - a.price);
    if (sort === "name")
      return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    return filtered;
  }, [category, search, priceRange, availability, sort]);

  const updateParam = (key, value) => {
    setParams((current) => {
      const next = new URLSearchParams(current);
      if (!value || value === "All" || value === "all") next.delete(key);
      else next.set(key, value);
      return next;
    });
  };

  const toggleAvailability = (value) => {
    setAvailability((current) => {
      const nextValues = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      setParams((currentParams) => {
        const next = new URLSearchParams(currentParams);
        next.delete("availability");
        nextValues.forEach((item) => next.append("availability", item));
        return next;
      });
      return nextValues;
    });
  };

  const clearFilters = () => {
    setSearch("");
    setPriceRange("all");
    setAvailability([]);
    setParams({});
    setMobileFiltersOpen(false);
  };

  const filterPanel = (
    <aside className="shop-filter-panel" aria-label="Product filters">
      <div className="shop-filter-heading">
        <h2>Filters</h2>
        <button
          type="button"
          className="shop-clear-button"
          onClick={clearFilters}
        >
          Clear all
        </button>
      </div>

      <fieldset className="shop-filter-group">
        <legend>Price</legend>
        {PRICE_FILTERS.map((filter) => (
          <label className="shop-filter-option" key={filter.value}>
            <input
              type="radio"
              name="price-range"
              value={filter.value}
              checked={priceRange === filter.value}
              onChange={() => {
                setPriceRange(filter.value);
                updateParam("price", filter.value);
              }}
            />
            <span>{filter.label}</span>
          </label>
        ))}
      </fieldset>

      <fieldset className="shop-filter-group">
        <legend>Availability</legend>
        {AVAILABILITY_FILTERS.map((value) => (
          <label className="shop-filter-option" key={value}>
            <input
              type="checkbox"
              checked={availability.includes(value)}
              onChange={() => toggleAvailability(value)}
            />
            <span>{value}</span>
          </label>
        ))}
      </fieldset>

      <label className="shop-sort-field">
        <span>Sort by</span>
        <select
          value={sort}
          onChange={(event) => updateParam("sort", event.target.value)}
          aria-label="Sort products"
        >
          <option value="featured">Featured</option>
          <option value="price-low">Price: low to high</option>
          <option value="price-high">Price: high to low</option>
          <option value="name">Name: A–Z</option>
        </select>
      </label>

      <Link className="shop-filter-promo" to="/custom-printing">
        <strong>Need something custom?</strong>
        <span>Send us your idea for a quote →</span>
      </Link>
    </aside>
  );

  return (
    <main className="shop-page">
      <section className="shop-intro">
        <div className="shop-container">
          <p className="shop-breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <strong>Shop</strong>
          </p>
          <div className="shop-intro-row">
            <div>
              <h1>All products</h1>
              <p>Ready-made prints, gifts and kits — order today.</p>
            </div>
            <label className="shop-search">
              <Search size={19} aria-hidden="true" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search keychains, vases, kits..."
                aria-label="Search products"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </label>
          </div>

          <nav className="shop-category-pills" aria-label="Shop by category">
            {categoryLabels.map((item) => (
              <button
                type="button"
                key={item.value}
                className={`shop-category-pill${category === item.value ? " is-active" : ""}`}
                onClick={() => updateParam("category", item.value)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </section>

      <section className="shop-results">
        <div className="shop-container shop-layout">
          <button
            type="button"
            className="shop-mobile-filter-toggle"
            aria-expanded={mobileFiltersOpen}
            onClick={() => setMobileFiltersOpen((open) => !open)}
          >
            <SlidersHorizontal size={17} /> Filters & sort
          </button>

          <div className={`shop-sidebar${mobileFiltersOpen ? " is-open" : ""}`}>
            {filterPanel}
          </div>

          <div className="shop-products-area">
            <div className="shop-results-count" aria-live="polite">
              <strong>{list.length}</strong>{" "}
              {list.length === 1 ? "product" : "products"}
            </div>

            {productsLoading ? (
              <div className="shop-empty-state">
                <h2>Loading products…</h2>
              </div>
            ) : productsError ? (
              <div className="shop-empty-state">
                <h2>Products could not be loaded.</h2>
                <p>
                  {productsError} Check the backend URL and ensure the API is
                  running.
                </p>
              </div>
            ) : list.length > 0 ? (
              <div className="product-grid shop-product-grid">
                {list.map((product, index) => (
                  <Reveal
                    key={product.id}
                    delay={Math.min(index % 3, 2) * 0.06}
                    className="shop-product-reveal"
                    once={false}
                  >
                    <ProductCard product={product} />
                  </Reveal>
                ))}
              </div>
            ) : (
              <div className="shop-empty-state">
                <span className="eyebrow">NO MATCHES YET</span>
                <h2>We couldn't find those products.</h2>
                <p>Try another search or remove one of your filters.</p>
                <button
                  className="button dark"
                  type="button"
                  onClick={clearFilters}
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
