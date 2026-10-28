import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../../utils/api.js";
import "./HomeHero.css";

const quickActions = [
  {
    title: "Shop ready-made",
    description: "Pick, pay, done",
    path: "/shop",
    icon: "vase",
    theme: "coral",
  },
  {
    title: "Personalize a gift",
    description: "Add names & dates",
    path: "/personalized-gifts",
    icon: "gift",
    theme: "purple",
  },
  {
    title: "Print my 3D file",
    description: "STL · 3MF · OBJ",
    path: "/custom-printing",
    icon: "cube",
    theme: "cyan",
  },
  {
    title: "Photo to figurine",
    description: "Send us a photo",
    path: "/photo-to-3d",
    icon: "figurine",
    theme: "yellow",
  },
];

const trustPoints = [
  {
    title: "Checked by a person",
    description: "Before every custom print",
  },
  {
    title: "Quote before printing",
    description: "No surprises on price",
  },
  {
    title: "Made to your spec",
    description: "Size, colour, material",
  },
  {
    title: "One or one thousand",
    description: "Gifts to event runs",
  },
];

function QuickActionIcon({ type }) {
  if (type === "vase") {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <ellipse cx="32" cy="53" rx="18" ry="4" fill="#ffd0c4" />
        <path
          d="M24 13h16l-2 8c0 5 7 13 7 21 0 10-5 15-13 15S19 52 19 42c0-8 7-16 7-21z"
          fill="#ff684e"
        />
        <path d="M24 13h16l-1 4H25z" fill="#142747" />
        <path
          d="M23 29c6 3 12 3 19 0M21 38c8 3 14 3 22 0M22 47c7 3 13 3 20 0"
          fill="none"
          stroke="#ffad98"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "gift") {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <rect x="13" y="26" width="38" height="29" rx="4" fill="#8b70f5" />
        <rect x="10" y="22" width="44" height="9" rx="3" fill="#6750d8" />
        <path d="M29 22h7v33h-7z" fill="#d8ceff" />
        <path
          d="M32 22c-14 0-18-11-10-12 6-1 10 12 10 12zm0 0c0-13 10-16 13-10 3 7-13 10-13 10z"
          fill="#a18bff"
          stroke="#4f3cc5"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "cube") {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M32 8 52 19 32 30 12 19z" fill="#43cbd7" />
        <path d="M12 19 32 30v25L12 44z" fill="#13a9b9" />
        <path d="M52 19 32 30v25l20-11z" fill="#07889c" />
        <path
          d="M32 30v25M22 13l20 11M22 25v16"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.5"
          opacity=".5"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <ellipse cx="32" cy="53" rx="18" ry="4" fill="#f9dba0" />
      <path d="M24 48h16l-3-8H27z" fill="#a86b14" />
      <path d="M28 39h8v10h-8z" fill="#d9931a" />
      <circle cx="32" cy="17" r="8" fill="#ffbb43" />
      <path
        d="M30 26h4l5 13H25z"
        fill="#ffbd45"
      />
      <path d="M32 27v20" stroke="#d18b16" strokeWidth="2" />
      <path d="M22 48h20" stroke="#d18b16" strokeWidth="2" />
    </svg>
  );
}

function VaseIllustration() {
  return (
    <svg
      className="home-hero__vase-svg"
      viewBox="0 0 360 390"
      role="img"
      aria-label="Coral-coloured 3D printed vase"
    >
      <defs>
        <linearGradient id="heroVaseBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ff765e" />
          <stop offset="65%" stopColor="#ff684d" />
          <stop offset="100%" stopColor="#e64e34" />
        </linearGradient>
        <linearGradient id="heroVaseHighlight" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffb1a0" />
          <stop offset="100%" stopColor="#ff8c77" />
        </linearGradient>
      </defs>

      <ellipse
        cx="183"
        cy="352"
        rx="140"
        ry="18"
        fill="#152444"
        opacity=".09"
      />

      <path
        d="M112 35
           C110 78 78 130 69 184
           C54 267 94 331 163 340
           C237 350 284 290 281 216
           C279 157 242 98 237 35Z"
        fill="#df4d34"
        transform="translate(7 4)"
      />

      <path
        d="M112 35
           C110 78 78 130 69 184
           C54 267 94 331 163 340
           C237 350 284 290 281 216
           C279 157 242 98 237 35Z"
        fill="url(#heroVaseBody)"
      />

      <ellipse cx="174" cy="35" rx="63" ry="12" fill="#132447" />

      <g
        fill="none"
        stroke="url(#heroVaseHighlight)"
        strokeWidth="5"
        opacity=".95"
      >
        <path d="M80 158c57 20 122 20 179-3" />
        <path d="M70 201c67 25 144 25 208 0" />
        <path d="M76 244c62 23 131 24 194 0" />
        <path d="M96 286c51 19 107 20 155 0" />
      </g>

      <path
        d="M110 53c-7 52-35 93-39 144-5 61 20 107 62 127"
        fill="none"
        stroke="#ff9a85"
        strokeWidth="5"
        strokeLinecap="round"
        opacity=".65"
      />
    </svg>
  );
}

function PersonalizationCard() {
  return (
    <div className="home-hero__personal-card">
      <div className="home-hero__personal-art">
        <div className="home-hero__mini-search" />
        <div className="home-hero__name-tag">
          <span className="home-hero__name-dot" />
          YOUR NAME
        </div>
        <div className="home-hero__mini-shadow" />
      </div>

      <p>Your name, printed</p>
    </div>
  );
}

function FileStatusCard() {
  return (
    <div className="home-hero__file-card">
      <div className="home-hero__file-icon">STL</div>

      <div className="home-hero__file-copy">
        <strong>your-model.stl</strong>
        <span>File upload · ready for review</span>
      </div>
    </div>
  );
}

function HeroArtwork({ imageUrl }) {
  const safeImageUrl = /^https:\/\//i.test(String(imageUrl || "").trim()) ? String(imageUrl).trim() : "";
  if (safeImageUrl) {
    return <div className="home-hero__visual" aria-label="3D printing preview"><img className="home-hero__custom-artwork" src={safeImageUrl} alt="ProJenius 3D printing product preview" loading="lazy" /></div>;
  }
  return (
    <div className="home-hero__visual" aria-label="3D printing preview">
      <div className="home-hero__art-backdrop" />

      <div className="home-hero__art-glow" />

      <div className="home-hero__vase-wrap">
        <VaseIllustration />
      </div>

      <PersonalizationCard />
      <FileStatusCard />

      <div className="home-hero__spark home-hero__spark--one" />
      <div className="home-hero__spark home-hero__spark--two" />
    </div>
  );
}

function TrustStrip() {
  return (
    <div className="home-hero__trust-strip">
      {trustPoints.map((point, index) => (
        <div className="home-hero__trust-item" key={point.title}>
          <span className="home-hero__check" aria-hidden="true">
            ✓
          </span>

          <div>
            <strong>{point.title}</strong>
            <span>{point.description}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HomeHero() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [content, setContent] = useState(null);

  useEffect(() => {
    let cancelled = false;
    apiRequest("/homepage/public")
      .then((result) => { if (!cancelled) setContent(result.data || null); })
      .catch(() => { /* Keep the existing authored hero copy when no published CMS record exists. */ });
    return () => { cancelled = true; };
  }, []);

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
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px",
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const titleLines = String(content?.heroTitle || "Imagine it.\nWe'll print it.").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const heroPrimaryLabel = String(content?.primaryButtonLabel || "Shop products").trim();
  const configuredPrimaryUrl = String(content?.primaryButtonUrl || "/shop").trim();
  const heroPrimaryUrl = configuredPrimaryUrl.startsWith("/") && !configuredPrimaryUrl.startsWith("//") ? configuredPrimaryUrl : "/shop";

  return (
    <section
      ref={sectionRef}
      className={`home-hero ${isVisible ? "is-visible" : ""}`}
      aria-labelledby="home-hero-title"
    >
      <div className="home-hero__container">
        {/* <div className="home-hero__eyebrow home-hero__reveal">
          3D PRINTING &amp; PERSONALISATION STUDIO
        </div> */}

        <div className="home-hero__main">
          <div className="home-hero__content">
            <h1
              className="home-hero__title home-hero__reveal"
              id="home-hero-title"
            >
              <span>{titleLines[0] || "Imagine it."}</span>
              {titleLines.length > 1 && <span className="home-hero__title-accent">{titleLines.slice(1).join(" ")}</span>}
            </h1>

            <p className="home-hero__description home-hero__reveal">
              {String(content?.heroSubtitle || "Ready-made 3D prints, gifts with your names on them, and custom printing from your own files — made layer by layer and checked by a person before it ships.")}
            </p>

            <div className="home-hero__buttons home-hero__reveal">
              <Link
                to={heroPrimaryUrl}
                className="home-hero__button home-hero__button--primary"
              >
                {heroPrimaryLabel} <span aria-hidden="true">→</span>
              </Link>

              <Link
                to="/custom-printing"
                className="home-hero__button home-hero__button--secondary"
              >
                Start a custom request
              </Link>
            </div>

            <div className="home-hero__actions-label home-hero__reveal">
              What would you like to do today?
            </div>

            <div className="home-hero__quick-grid">
              {quickActions.map((action, index) => (
                <Link
                  key={action.title}
                  to={action.path}
                  className={`home-hero__quick-card home-hero__quick-card--${action.theme} home-hero__reveal`}
                  style={{ "--reveal-index": index }}
                >
                  <span className="home-hero__quick-icon">
                    <QuickActionIcon type={action.icon} />
                  </span>

                  <span className="home-hero__quick-copy">
                    <strong>{action.title}</strong>
                    <span>{action.description}</span>
                  </span>

                  <span className="home-hero__quick-arrow" aria-hidden="true">
                    ›
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="home-hero__art-column home-hero__reveal">
            <HeroArtwork imageUrl={content?.heroImage} />
          </div>
        </div>

        <div className="home-hero__trust-wrap home-hero__reveal">
          <TrustStrip />
        </div>
      </div>
    </section>
  );
}