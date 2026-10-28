import { useCallback, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  ChevronDown,
  X,
  ArrowRight,
} from "lucide-react";

import "./Navbar.css";
import logo from "../../assets/Navbar/logo.png";

/* =========================
   MEGA MENU DATA
========================= */

const menuData = {
  shop: {
    label: "SHOP BY CATEGORY",
    links: [
      { title: "All Products", description: "Browse the full catalogue", path: "/shop" },
      { title: "Keychains", description: "Names, initials and icons", path: "/shop?category=Keychains" },
      { title: "Home Decor", description: "Vases, lamps and planters", path: "/shop?category=Home%20Decor" },
      { title: "Toys & Creative Kits", description: "Play, build and paint", path: "/shop?category=Toys%20%26%20Creative%20Kits" },
      { title: "Gifts", description: "Thoughtful gifts for every occasion", path: "/shop?category=Gifts" },
      { title: "Functional 3D Prints", description: "Stands and organisers", path: "/shop?category=Functional%203D%20Prints" },
      { title: "Explore All Categories", description: "Discover every collection", path: "/shop", featured: true },
    ],
    promo: {
      eyebrow: "MADE PERSONAL",
      title: "Gifts with their name on it",
      description: "Personalise keychains, lamps and name plates with a design that feels uniquely yours.",
      action: "Personalise now",
      path: "/personalized-gifts",
      decoration: "3D",
    },
  },
  custom: {
    label: "CUSTOM PRINTING",
    links: [
      { title: "Print My 3D File", description: "We print the model you already have", path: "/custom-printing" },
      { title: "Upload STL / 3MF / OBJ", description: "Submit your 3D model for review", path: "/custom-printing" },
      { title: "3D Design & Prototyping", description: "No file? We can help design it", path: "/custom-printing?service=design" },
      { title: "Request a Custom Quote", description: "Tell us what you need", path: "/custom-printing", featured: true },
    ],
    promo: {
      eyebrow: "YOUR IDEA, OUR EXPERTISE",
      title: "Let's bring your design to life",
      description: "Share your requirements and let our team review your model and printing needs.",
      action: "Upload a file",
      path: "/custom-printing",
      decoration: "3D",
    },
  },
  gifts: {
    label: "PERSONALIZED GIFTS",
    links: [
      { title: "Name & Text Gifts", description: "Names, dates and personal messages", path: "/shop?category=Gifts", },
      { title: "Photo-to-3D Figurines", description: "Turn a photo into a special keepsake", path: "/photo-to-3d" },
      { title: "Personalized Keychains", description: "Small, light and meaningful", path: "/shop?category=Keychains" },
      { title: "Personalized Home Decor", description: "Name plates, lamps and coasters", path: "/shop?category=Home%20Decor" },
      { title: "Create a Custom Gift", description: "Describe your idea and we will help", path: "/personalized-gifts", featured: true },
    ],
    promo: {
      eyebrow: "A GIFT TO REMEMBER",
      title: "Turn memories into 3D keepsakes",
      description: "Create a personalised figurine or gift with a design made especially for someone.",
      action: "Explore photo-to-3D",
      path: "/photo-to-3d",
      decoration: "♡",
    },
  },
};

/* About Us is intentionally placed immediately after Home. */
const navItems = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Shop", path: "/shop", menu: "shop" },
  { label: "Custom Printing", path: "/custom-printing", menu: "custom" },
  { label: "Personalized Gifts", path: "/personalized-gifts", menu: "gifts" },
  { label: "Bulk Orders", path: "/bulk-orders" },
  { label: "Photo-to-3D", path: "/photo-to-3d" },
  { label: "Contact", path: "/contact" },
];

/* =========================
   CART COUNT
   Reads common localStorage cart formats.
   Dispatch "cartUpdated" after same-tab cart edits.
========================= */

const CART_STORAGE_KEYS = ["cart", "cartItems", "shoppingCart", "pj-cart", "pj_cart"];

function getItemsFromCart(value) {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object") return [];

  if (Array.isArray(value.items)) return value.items;
  if (Array.isArray(value.cartItems)) return value.cartItems;
  if (Array.isArray(value.products)) return value.products;
  if (value.data) return getItemsFromCart(value.data);

  return [];
}

function readCartCount() {
  if (typeof window === "undefined") return 0;

  for (const key of CART_STORAGE_KEYS) {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;

      const parsed = JSON.parse(raw);
      const items = getItemsFromCart(parsed);

      if (items.length) {
        return items.reduce((total, item) => {
          const quantity = Number(item?.quantity ?? item?.qty ?? item?.count ?? 1);
          return total + (Number.isFinite(quantity) && quantity > 0 ? quantity : 1);
        }, 0);
      }

      /* An existing, empty cart should correctly display zero. */
      if (Array.isArray(parsed) || Array.isArray(parsed?.items) ||
          Array.isArray(parsed?.cartItems) || Array.isArray(parsed?.products)) {
        return 0;
      }
    } catch {
      // Ignore invalid values and check the next supported key.
    }
  }

  return 0;
}

function useCartCount() {
  const [cartCount, setCartCount] = useState(readCartCount);

  const refreshCartCount = useCallback(() => {
    setCartCount(readCartCount());
  }, []);

  useEffect(() => {
    refreshCartCount();

    window.addEventListener("storage", refreshCartCount);
    window.addEventListener("cartUpdated", refreshCartCount);
    window.addEventListener("cart:updated", refreshCartCount);
    window.addEventListener("focus", refreshCartCount);

    return () => {
      window.removeEventListener("storage", refreshCartCount);
      window.removeEventListener("cartUpdated", refreshCartCount);
      window.removeEventListener("cart:updated", refreshCartCount);
      window.removeEventListener("focus", refreshCartCount);
    };
  }, [refreshCartCount]);

  return cartCount;
}

/* =========================
   MEGA MENU
========================= */

function MegaMenu({ data, onClose, id }) {
  if (!data) return null;

  return (
    <section id={id} className="pj-mega-menu" aria-label={data.label}>
      <div className="pj-mega-menu__inner">
        <div className="pj-mega-menu__main">
          <div className="pj-mega-menu__heading">
            <p className="pj-mega-menu__label">{data.label}</p>
            <button
              type="button"
              className="pj-mega-menu__close"
              aria-label="Close menu"
              onClick={onClose}
            >
              <X size={19} />
            </button>
          </div>

          <div className="pj-mega-menu__links">
            {data.links.map((item) => (
              <Link
                key={`${item.title}-${item.path}`}
                to={item.path}
                className={`pj-mega-menu__item ${item.featured ? "is-featured" : ""}`}
                onClick={onClose}
              >
                <span className="pj-mega-menu__item-content">
                  <span className="pj-mega-menu__item-title">{item.title}</span>
                  <span className="pj-mega-menu__item-description">{item.description}</span>
                </span>
                <ArrowRight className="pj-mega-menu__item-arrow" size={17} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>

        {data.promo && (
          <aside className="pj-mega-menu__promo">
            <span className="pj-mega-menu__promo-eyebrow">{data.promo.eyebrow}</span>
            <h2>{data.promo.title}</h2>
            <p>{data.promo.description}</p>
            <Link to={data.promo.path} className="pj-mega-menu__promo-link" onClick={onClose}>
              {data.promo.action}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <span className="pj-mega-menu__promo-decoration" aria-hidden="true">
              {data.promo.decoration}
            </span>
          </aside>
        )}
      </div>
    </section>
  );
}

/* =========================
   MAIN NAVBAR
========================= */

export default function Navbar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const navbarRef = useRef(null);
  const searchInputRef = useRef(null);
  const cartCount = useCartCount();

  const activeMenuId = activeMenu ? `pj-mega-menu-${activeMenu}` : undefined;

  useEffect(() => {
    setActiveMenu(null);
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setActiveMenu(null);
        setMobileOpen(false);
        setSearchOpen(false);
      }
    };

    const handlePointerDown = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setActiveMenu(null);
        setMobileOpen(false);
        setSearchOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const closeAll = useCallback(() => {
    setActiveMenu(null);
    setMobileOpen(false);
    setSearchOpen(false);
  }, []);

  const openMenuOnHover = (menu) => {
    if (window.matchMedia("(min-width: 981px)").matches) {
      setSearchOpen(false);
      setActiveMenu(menu);
    }
  };

  const toggleMenu = (menu) => {
    setSearchOpen(false);
    setActiveMenu((current) => (current === menu ? null : menu));
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const query = searchText.trim();
    closeAll();
    navigate(query ? `/shop?search=${encodeURIComponent(query)}` : "/shop");
  };

  const handleNavigationClick = () => {
    setActiveMenu(null);
    if (window.matchMedia("(max-width: 980px)").matches) {
      setMobileOpen(false);
    }
  };

  const handleNavbarMouseLeave = () => {
    if (window.matchMedia("(min-width: 981px)").matches) {
      setActiveMenu(null);
    }
  };

  return (
    <header
      className="pj-navbar"
      ref={navbarRef}
      onMouseLeave={handleNavbarMouseLeave}
    >
      <div className="pj-navbar__bar">
        <Link to="/" className="pj-navbar__brand" aria-label="ProJenius 3D home" onClick={closeAll}>
          <span className="pj-navbar__logo-wrap">
            <img src={logo} alt="" className="pj-navbar__logo" />
          </span>
          <span className="pj-navbar__brand-text">
            ProJenius <span>3D</span>
          </span>
        </Link>

        <button
          type="button"
          className="pj-navbar__mobile-toggle"
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileOpen}
          aria-controls="pj-main-navigation"
          onClick={() => {
            setMobileOpen((open) => !open);
            setActiveMenu(null);
            setSearchOpen(false);
          }}
        >
          {mobileOpen ? <X size={23} /> : <span className="pj-navbar__hamburger">☰</span>}
        </button>

        <nav
          id="pj-main-navigation"
          className={`pj-navbar__nav ${mobileOpen ? "is-mobile-open" : ""}`}
          aria-label="Main navigation"
        >
          {navItems.map((item) => {
            const isMenuOpen = activeMenu === item.menu;
            const isRouteActive = item.path === "/"
              ? location.pathname === "/"
              : location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);

            if (item.menu) {
              return (
                <button
                  key={item.label}
                  type="button"
                  className={`pj-navbar__link pj-navbar__menu-trigger ${isMenuOpen ? "is-active" : ""}`}
                  aria-expanded={Boolean(isMenuOpen)}
                  aria-controls={`pj-mega-menu-${item.menu}`}
                  onMouseEnter={() => openMenuOnHover(item.menu)}
                  onFocus={() => openMenuOnHover(item.menu)}
                  onClick={() => toggleMenu(item.menu)}
                >
                  <span>{item.label}</span>
                  <ChevronDown
                    size={15}
                    strokeWidth={1.8}
                    className={isMenuOpen ? "is-rotated" : ""}
                    aria-hidden="true"
                  />
                </button>
              );
            }

            return (
              <NavLink
                key={item.label}
                to={item.path}
                end={item.path === "/"}
                className={`pj-navbar__link ${isRouteActive ? "is-active" : ""}`}
                onClick={handleNavigationClick}
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="pj-navbar__tools">
          <button
            type="button"
            className={`pj-navbar__icon-button ${searchOpen ? "is-active" : ""}`}
            aria-label="Search products"
            aria-expanded={searchOpen}
            onClick={() => {
              setSearchOpen((open) => !open);
              setActiveMenu(null);
              setMobileOpen(false);
            }}
          >
            <Search size={20} strokeWidth={1.8} />
          </button>

          {/* Sign-in/account icon removed as requested. */}
          <Link to="/cart" className="pj-navbar__icon-button pj-navbar__cart" aria-label={`Shopping cart, ${cartCount} items`} onClick={closeAll}>
            <ShoppingCart size={21} strokeWidth={1.8} />
            {cartCount > 0 && (
              <span className="pj-navbar__cart-count" aria-live="polite">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {searchOpen && (
        <form className="pj-navbar__search-panel" onSubmit={handleSearch}>
          <Search size={19} aria-hidden="true" />
          <input
            ref={searchInputRef}
            type="search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search keychains, vases, gifts..."
            aria-label="Search products"
          />
          <button type="submit">Search</button>
          <button
            type="button"
            className="pj-navbar__search-close"
            aria-label="Close search"
            onClick={() => setSearchOpen(false)}
          >
            <X size={19} />
          </button>
        </form>
      )}

      {activeMenu && menuData[activeMenu] && (
        <>
          <button
            type="button"
            className="pj-navbar__backdrop"
            aria-label="Close menu"
            onClick={() => setActiveMenu(null)}
          />
          <MegaMenu
            id={activeMenuId}
            data={menuData[activeMenu]}
            onClose={() => setActiveMenu(null)}
          />
        </>
      )}
    </header>
  );
}
