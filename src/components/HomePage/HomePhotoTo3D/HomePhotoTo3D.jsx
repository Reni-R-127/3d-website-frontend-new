import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Info } from "lucide-react";
import "./HomePhotoTo3D.css";

const steps = [
  {
    number: "Step 1",
    title: "Request",
    description: "Photos & style",
  },
  {
    number: "Step 2",
    title: "Review",
    description: "Team checks photos",
  },
  {
    number: "Step 3",
    title: "Preview",
    description: "Revisions if needed",
  },
  {
    number: "Step 4",
    title: "Approve",
    description: "You say go",
  },
  {
    number: "Step 5",
    title: "Quote",
    description: "Final price",
  },
];

function PhotoIllustration() {
  return (
    <div
      className="home-photo-3d__art home-photo-3d__art--photo"
      aria-label="Illustration of a photograph"
      role="img"
    >
      <div className="hp3d-photo">
        <span className="hp3d-photo__sun" />

        <svg
          className="hp3d-photo__landscape"
          viewBox="0 0 160 100"
          aria-hidden="true"
        >
          <path d="M10 90 L58 25 L88 61 L108 39 L150 90 Z" />
        </svg>
      </div>

      <span className="home-photo-3d__platform" />
    </div>
  );
}

function FigurineIllustration() {
  return (
    <div
      className="home-photo-3d__art home-photo-3d__art--figurine"
      aria-label="Illustration of a finished 3D figurine"
      role="img"
    >
      <div className="hp3d-figurine">
        <span className="hp3d-figurine__head" />
        <span className="hp3d-figurine__body" />
        <span className="hp3d-figurine__base" />
      </div>

      <span className="home-photo-3d__platform" />
    </div>
  );
}

function ProcessCard({ step, index }) {
  return (
    <article
      className="home-photo-3d__step"
      style={{ "--hp3d-index": index }}
    >
      <span className="home-photo-3d__step-number">
        {step.number}
      </span>

      <h3>{step.title}</h3>

      <p>{step.description}</p>
    </article>
  );
}

export default function HomePhotoTo3D() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return undefined;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    if (
      reducedMotion.matches ||
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
        rootMargin: "0px 0px -25px 0px",
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`home-photo-3d ${
        isVisible ? "hp3d--visible" : ""
      }`}
      aria-labelledby="home-photo-3d-title"
    >
      <div className="home-photo-3d__container">
        {/* LEFT CONTENT */}
        <div className="home-photo-3d__content">
          <span className="home-photo-3d__eyebrow hp3d-reveal hp3d-reveal--1">
            PHOTO-TO-3D FIGURINES
          </span>

          <h2
            id="home-photo-3d-title"
            className="home-photo-3d__title hp3d-reveal hp3d-reveal--2"
          >
            From a favourite photo
            <br className="home-photo-3d__desktop-break" />
            {" "}to a figurine you can hold
          </h2>

          <p className="home-photo-3d__description hp3d-reveal hp3d-reveal--3">
            Share a few clear photos and choose a style. Our team
            designs a preview for your feedback — you approve it
            before we quote and print.
          </p>

          <div className="home-photo-3d__notice hp3d-reveal hp3d-reveal--4">
            <Info
              size={19}
              strokeWidth={1.8}
              aria-hidden="true"
            />

            <p>
              You're sending a request for review, not placing an
              order. Nothing is charged until you approve the
              preview and quote.
            </p>
          </div>

          <div className="home-photo-3d__actions hp3d-reveal hp3d-reveal--5">
            <Link
              to="/photo-to-3d"
              className="home-photo-3d__button"
            >
              Start a figurine request
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* RIGHT VISUALS */}
        <div className="home-photo-3d__visuals">
          <div className="home-photo-3d__comparison">
            <div className="home-photo-3d__visual-item hp3d-reveal hp3d-reveal--2">
              <PhotoIllustration />
            </div>

            <div
              className="home-photo-3d__arrow hp3d-reveal hp3d-reveal--3"
              aria-hidden="true"
            >
              <ArrowRight size={21} strokeWidth={1.8} />
            </div>

            <div className="home-photo-3d__visual-item hp3d-reveal hp3d-reveal--4">
              <FigurineIllustration />
            </div>
          </div>

          <div className="home-photo-3d__steps">
            {steps.map((step, index) => (
              <ProcessCard
                key={step.number}
                step={step}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}