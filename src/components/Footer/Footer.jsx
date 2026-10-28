import { Link } from "react-router-dom";
import "./Footer.css";

const quickLinks = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "FAQs", path: "/faq" },
  { label: "Contact", path: "/contact" },
  { label: "My Account", path: "/login" },
];

const shopLinks = [
  { label: "All Products", path: "/shop" },
  { label: "Keychains", path: "/shop?category=Keychains" },
  { label: "Home Decor", path: "/shop?category=Home%20Decor" },
  { label: "Toys & Creative Kits", path: "/kids-creative-kits" },
  { label: "Gifts", path: "/personalized-gifts" },
];

const serviceLinks = [
  { label: "Custom 3D Printing", path: "/custom-printing" },
  { label: "Personalized Gifts", path: "/personalized-gifts" },
  { label: "Photo-to-3D Figurines", path: "/photo-to-3d" },
  { label: "Bulk & Event Orders", path: "/bulk-orders" },
  { label: "3D Design & Prototyping", path: "/design-services" },
];

const socialLinks = [
  {
    label: "Instagram",
    shortLabel: "IG",
    href: "https://www.instagram.com/",
  },
  {
    label: "YouTube",
    shortLabel: "YT",
    href: "https://www.youtube.com/",
  },
  {
    label: "LinkedIn",
    shortLabel: "in",
    href: "https://www.linkedin.com/",
  },
  {
    label: "WhatsApp",
    shortLabel: "WA",
    href: "https://wa.me/",
  },
];

function FooterLinkColumn({ title, links }) {
  return (
    <nav className="pj-footer__column" aria-label={title}>
      <h3 className="pj-footer__heading">{title}</h3>

      <ul className="pj-footer__link-list">
        {links.map(({ label, path }) => (
          <li key={`${label}-${path}`}>
            <Link to={path}>{label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function BrandLogo() {
  return (
    <span className="pj-footer__logo" aria-hidden="true">
      <span className="pj-footer__logo-dot" />
      <span className="pj-footer__logo-line pj-footer__logo-line--one" />
      <span className="pj-footer__logo-line pj-footer__logo-line--two" />
      <span className="pj-footer__logo-line pj-footer__logo-line--three" />
    </span>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="pj-footer">
      <div className="pj-footer__container">
        <div className="pj-footer__main">
          {/* Brand section */}
          <div className="pj-footer__brand-column">
            <Link to="/" className="pj-footer__brand">
              <BrandLogo />

              <span className="pj-footer__brand-name">
                ProJenius <strong>3D</strong>
              </span>
            </Link>

            <p className="pj-footer__description">
              Ready-made 3D prints, personalised gifts and custom printing
              from your files — made layer by layer, checked by a person.
            </p>

            <Link to="/contact" className="pj-footer__contact-link">
              Have a project in mind? <span>Let's talk ↗</span>
            </Link>

            <nav className="pj-footer__socials" aria-label="Social media">
              {socialLinks.map(({ label, shortLabel, href }) => (
                <a
                  key={label}
                  href={href}
                  className="pj-footer__social"
                  aria-label={label}
                  title={label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span aria-hidden="true">{shortLabel}</span>
                </a>
              ))}
            </nav>
          </div>

          {/* Navigation columns */}
          <FooterLinkColumn title="Quick links" links={quickLinks} />

          <FooterLinkColumn title="Shop" links={shopLinks} />

          <FooterLinkColumn title="Services" links={serviceLinks} />
        </div>

        {/* Footer bottom */}
        <div className="pj-footer__bottom">
          <p className="pj-footer__copyright">
            © {currentYear} ProJenius 3D Printing. All rights reserved.
          </p>

          <nav className="pj-footer__legal" aria-label="Legal links">
            <Link to="/shipping">Shipping</Link>
            <Link to="/returns">Returns &amp; Refunds</Link>
            <Link to="/privacy">Privacy</Link>

            <a
              href="https://projenius.com/"
              className="pj-footer__company-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              ProJenius company website <span aria-hidden="true">↗</span>
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}