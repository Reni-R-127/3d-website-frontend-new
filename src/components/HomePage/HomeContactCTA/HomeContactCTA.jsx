import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "./HomeContactCTA.css";

export default function HomeContactCTA() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return undefined;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.25,
        rootMargin: "0px 0px -20px 0px",
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`home-contact-cta ${
        isVisible ? "home-contact-cta--visible" : ""
      }`}
      aria-labelledby="home-contact-cta-title"
    >
      <div className="home-contact-cta__inner">
        <div className="home-contact-cta__content">
          <span className="home-contact-cta__eyebrow">
            HAVE A PROJECT IN MIND?
          </span>

          <h2 id="home-contact-cta-title">
            Got an idea that
            <br className="home-contact-cta__desktop-break" /> isn't on the
            shelf?
          </h2>

          <p>
            Tell us what you have in mind — a file, a sketch, a photo or just a
            sentence. We'll reply with options and a quote.
          </p>
        </div>

        <div className="home-contact-cta__actions">
          <Link
            to="/custom-printing"
            className="home-contact-cta__button home-contact-cta__button--primary"
          >
            Start a custom request
            <ArrowRight
              className="home-contact-cta__arrow"
              size={17}
              aria-hidden="true"
            />
          </Link>

          <Link
            to="/contact"
            className="home-contact-cta__button home-contact-cta__button--secondary"
          >
            Contact us
          </Link>
        </div>
      </div>
    </section>
  );
}
