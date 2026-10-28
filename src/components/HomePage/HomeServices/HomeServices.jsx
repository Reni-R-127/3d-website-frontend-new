import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Gift,
  UserRound,
  Boxes,
  PencilRuler,
} from "lucide-react";
import "./HomeServices.css";

const services = [
  {
    id: "personalized-gifts",
    title: "Personalized Gifts",
    description: "Names, dates and messages on keychains, lamps and décor.",
    linkText: "Personalize",
    href: "/personalized-gifts",
    icon: Gift,
    theme: "gift",
  },
  {
    id: "photo-to-3d",
    title: "Photo-to-3D Figurines",
    description: "Send photos; approve a preview before we print.",
    linkText: "Send photos",
    href: "/photo-to-3d",
    icon: UserRound,
    theme: "figurine",
  },
  {
    id: "bulk-orders",
    title: "Bulk & Event Orders",
    description: "Corporate gifts, fest merchandise and return gifts.",
    linkText: "Get a bulk quote",
    href: "/bulk-orders",
    icon: Boxes,
    theme: "bulk",
  },
  {
    id: "design-services",
    title: "3D Design & Prototyping",
    description: "From a sketch or idea to a print-ready model.",
    linkText: "Share your idea",
    href: "/design-services",
    icon: PencilRuler,
    theme: "design",
  },
];

function ServiceIllustration({ theme }) {
  return (
    <span
      className={`home-services__illustration home-services__illustration--${theme}`}
      aria-hidden="true"
    >
      {theme === "gift" && (
        <span className="hs-gift">
          <span className="hs-gift__lid" />
          <span className="hs-gift__body" />
          <span className="hs-gift__ribbon" />
          <span className="hs-gift__bow hs-gift__bow--left" />
          <span className="hs-gift__bow hs-gift__bow--right" />
        </span>
      )}

      {theme === "figurine" && (
        <span className="hs-figurine">
          <span className="hs-figurine__head" />
          <span className="hs-figurine__body" />
          <span className="hs-figurine__base" />
        </span>
      )}

      {theme === "bulk" && (
        <span className="hs-bulk">
          <span className="hs-bulk__box" />
          <span className="hs-bulk__ribbon" />
          <span className="hs-bulk__bow" />
        </span>
      )}

      {theme === "design" && (
        <span className="hs-design">
          <span className="hs-design__pencil" />
          <span className="hs-design__base" />
        </span>
      )}
    </span>
  );
}

function FeaturedIllustration() {
  return (
    <div className="home-services__featured-art" aria-hidden="true">
      <span className="hs-cube">
        <span className="hs-cube__top" />
        <span className="hs-cube__left" />
        <span className="hs-cube__right" />
        <span className="hs-cube__edge hs-cube__edge--one" />
        <span className="hs-cube__edge hs-cube__edge--two" />
        <span className="hs-cube__edge hs-cube__edge--three" />
      </span>
      <span className="hs-cube-shadow" />
    </div>
  );
}

function ServiceCard({ service, index }) {
  const Icon = service.icon;

  return (
    <article
      className={`home-services__card home-services__card--${service.theme}`}
      style={{ "--card-index": index }}
    >
      <ServiceIllustration theme={service.theme} />

      <h3>{service.title}</h3>

      <p>{service.description}</p>

      <Link className="home-services__card-link" to={service.href}>
        {service.linkText}
        <ArrowRight size={14} aria-hidden="true" />
      </Link>
    </article>
  );
}

export default function HomeServices() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

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
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
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

  return (
    <section
      ref={sectionRef}
      className={`home-services ${isVisible ? "is-visible" : ""}`}
      aria-labelledby="home-services-title"
    >
      <div className="home-services__container">
        <header className="home-services__header">
          <div className="home-services__heading-group hs-reveal hs-reveal--heading">
            <span className="home-services__eyebrow">
              WHAT WE MAKE FOR YOU
            </span>

            <h2 id="home-services-title">
              Five ways to get
              <br className="home-services__desktop-break" /> something printed
            </h2>
          </div>

          <p className="home-services__intro hs-reveal hs-reveal--intro">
            Pick a ready product, add your names, or send us a file, a photo
            or just an idea.
          </p>
        </header>

        <div className="home-services__layout">
          <article className="home-services__featured hs-reveal hs-reveal--featured">
            <div className="home-services__featured-copy">
              <span className="home-services__badge">MOST REQUESTED</span>

              <h3>Custom 3D Printing</h3>

              <p>
                Upload STL, 3MF or OBJ files. We check printability, suggest a
                material and send you a quote.
              </p>
            </div>

            <FeaturedIllustration />

            <Link
              to="/custom-printing"
              className="home-services__featured-link"
            >
              Upload a file
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </article>

          <div className="home-services__grid">
            {services.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}