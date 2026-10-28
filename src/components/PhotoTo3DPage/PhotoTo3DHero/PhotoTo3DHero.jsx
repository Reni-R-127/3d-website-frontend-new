import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "./PhotoTo3DHero.css";

function PhotoIllustration() {
  return (
    <div className="photo3d-illustration photo3d-illustration--photo">
      <div className="photo3d-photo-card">
        <div className="photo3d-sun" />
        <svg
          className="photo3d-mountains"
          viewBox="0 0 140 100"
          fill="none"
          aria-hidden="true"
        >
          <path d="M8 88 48 35 77 68 99 45 132 88H8Z" fill="#D99316" />
          <path d="M48 35 77 68 62 54Z" fill="#E8A51D" />
        </svg>
      </div>

      <div className="photo3d-photo-base" />
      <span className="photo3d-photo-shadow" />
    </div>
  );
}

function FigurineIllustration() {
  return (
    <div className="photo3d-illustration photo3d-illustration--figurine">
      <div className="photo3d-figurine">
        <div className="photo3d-figurine-head" />
        <div className="photo3d-figurine-body" />
      </div>
      <span className="photo3d-figurine-base" />
      <span className="photo3d-figurine-shadow" />
    </div>
  );
}

export default function PhotoTo3DHero() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(false);
          setAnimationKey((key) => key + 1);

          requestAnimationFrame(() => {
            setIsVisible(true);
          });
        } else {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -35px 0px",
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`photo3d-hero ${isVisible ? "is-visible" : ""}`}
      aria-labelledby="photo3d-hero-title"
    >
      <div className="photo3d-hero__inner" key={animationKey}>
        <div className="photo3d-hero__content">
          <nav className="photo3d-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Photo-to-3D</span>
          </nav>

          <h1 id="photo3d-hero-title" className="photo3d-hero__title">
            Turn a favourite photo
            <br className="photo3d-desktop-break" /> into a 3D figurine
          </h1>

          <p className="photo3d-hero__description">
            Send a few photos and pick a style. Our designers create a preview,
            you suggest changes, and we only quote once you're happy.
          </p>

          <div className="photo3d-hero__badges">
            <span className="photo3d-badge">Revisions included</span>
            <span className="photo3d-badge">Pay after approval</span>
          </div>

          <Link
            to="/photo-to-3d#request"
            className="photo3d-hero__mobile-cta"
          >
            Create your figurine <ArrowRight size={16} />
          </Link>
        </div>

        <div
          className="photo3d-hero__visual"
          aria-label="Illustration showing a photo transformed into a 3D figurine"
          role="img"
        >
          <PhotoIllustration />

          <div className="photo3d-conversion-arrow" aria-hidden="true">
            <ArrowRight size={19} strokeWidth={2} />
          </div>

          <FigurineIllustration />
        </div>
      </div>
    </section>
  );
}
