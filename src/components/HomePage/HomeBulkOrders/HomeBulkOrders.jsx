import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "./HomeBulkOrders.css";

const bulkServices = [
  {
    id: "merchandise",
    title: "Event merchandise",
    description: "Logo keychains, badges and stands for fests and launches.",
    theme: "merchandise",
    artwork: (
      <div className="hbo-keychain" aria-hidden="true">
        <span className="hbo-keychain__ring" />
        <span className="hbo-keychain__tag">NAME</span>
      </div>
    ),
  },
  {
    id: "personalized",
    title: "Bulk personalised gifts",
    description: "Every piece with its own name — teams, classrooms.",
    theme: "personalized",
    artwork: (
      <div className="hbo-nameplate" aria-hidden="true">
        <span>Your Name</span>
      </div>
    ),
  },
  {
    id: "corporate",
    title: "Corporate gifts",
    description: "Branded desk accessories and mementos.",
    theme: "corporate",
    artwork: (
      <div className="hbo-organizer" aria-hidden="true">
        <span className="hbo-organizer__base" />
        <span className="hbo-organizer__body" />
        <span className="hbo-organizer__pen hbo-organizer__pen--one" />
        <span className="hbo-organizer__pen hbo-organizer__pen--two" />
        <span className="hbo-organizer__pen hbo-organizer__pen--three" />
      </div>
    ),
  },
  {
    id: "events",
    title: "Custom event orders",
    description: "Wedding favours, return gifts and trophies.",
    theme: "events",
    artwork: (
      <div className="hbo-gift" aria-hidden="true">
        <span className="hbo-gift__box" />
        <span className="hbo-gift__ribbon" />
        <span className="hbo-gift__bow hbo-gift__bow--left" />
        <span className="hbo-gift__bow hbo-gift__bow--right" />
      </div>
    ),
  },
];

function BulkServiceCard({ service, index }) {
  return (
    <article
      className={`hbo-card hbo-card--${service.theme}`}
      style={{ "--hbo-index": index }}
    >
      <div className="hbo-card__art">{service.artwork}</div>

      <div className="hbo-card__content">
        <h3>{service.title}</h3>
        <p>{service.description}</p>
      </div>

      <span className="hbo-card__arrow" aria-hidden="true">
        <ArrowRight size={17} />
      </span>
    </article>
  );
}

export default function HomeBulkOrders() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return undefined;

    const motionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    if (
      motionQuery.matches ||
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
        threshold: 0.16,
        rootMargin: "0px 0px -25px 0px",
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`home-bulk-orders ${
        isVisible ? "hbo--visible" : ""
      }`}
      aria-labelledby="hbo-title"
    >
      <div className="hbo-container">
        <div className="hbo-layout">
          <div className="hbo-intro hbo-reveal">
            <span className="hbo-eyebrow">
              BULK &amp; EVENT ORDERS
            </span>

            <h2 id="hbo-title">
              Made for teams,
              <br />
              fests and big days
            </h2>

            <p className="hbo-intro__description">
              Tell us the quantity, date and idea. We share a
              sample for approval, then produce the full run.
            </p>

            <Link
              to="/bulk-orders"
              className="hbo-cta"
            >
              Request a bulk quote
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>

          <div className="hbo-grid">
            {bulkServices.map((service, index) => (
              <BulkServiceCard
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