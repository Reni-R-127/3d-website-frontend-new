import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Upload, Box, CheckCircle2 } from "lucide-react";
import "./HomeCustomPrinting.css";

const steps = [
  {
    number: "1",
    title: "Send your file",
    description: "STL, 3MF or OBJ with your preferences",
  },
  {
    number: "2",
    title: "We review it",
    description: "Printability, size, material and finish",
  },
  {
    number: "3",
    title: "You get a quote",
    description: "Accept only if it suits you",
  },
];

function CubeIllustration() {
  return (
    <div className="hcustom-cube-scene" aria-label="Illustration of a 3D printed cube">
      <span className="hcustom-cube-shadow" />

      <div className="hcustom-cube">
        <span className="hcustom-cube__face hcustom-cube__face--top" />
        <span className="hcustom-cube__face hcustom-cube__face--left" />
        <span className="hcustom-cube__face hcustom-cube__face--right" />

        <span className="hcustom-cube__edge hcustom-cube__edge--left" />
        <span className="hcustom-cube__edge hcustom-cube__edge--center" />
        <span className="hcustom-cube__edge hcustom-cube__edge--right" />
      </div>
    </div>
  );
}

function FilePreview() {
  return (
    <div className="hcustom-preview">
      <div className="hcustom-preview__top">
        <span>bracket-v2.stl</span>
        <span className="hcustom-preview__label">3D preview</span>
      </div>

      <div className="hcustom-preview__canvas">
        <CubeIllustration />
      </div>

      <div className="hcustom-preview__metadata">
        <span>≈ 84 × 40 × 22 mm</span>
        <span>PETG suggested</span>
        <span className="hcustom-preview__status">
          <span className="hcustom-preview__status-dot" />
          Waiting for review
        </span>
      </div>
    </div>
  );
}

export default function HomeCustomPrinting() {
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
        threshold: 0.2,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`home-custom-printing ${
        isVisible ? "hcustom--visible" : ""
      }`}
      aria-labelledby="hcustom-title"
    >
      <div className="hcustom-container">
        <div className="hcustom-layout">
          <div className="hcustom-visual hcustom-reveal hcustom-reveal--left">
            <FilePreview />
          </div>

          <div className="hcustom-content hcustom-reveal hcustom-reveal--right">
            <span className="hcustom-eyebrow">
              CUSTOM 3D PRINTING
            </span>

            <h2 id="hcustom-title">
              Have a 3D file?
              <br />
              We&apos;ll make it real.
            </h2>

            <p className="hcustom-description">
              Send your model with size, material and finish preferences.
              A person reviews printability and replies with a manual
              quote — you decide before anything is printed.
            </p>

            <div className="hcustom-formats" aria-label="Supported file formats">
              <span>STL</span>
              <span>3MF</span>
              <span>OBJ</span>
            </div>

            <div className="hcustom-steps">
              {steps.map((step, index) => (
                <div
                  className="hcustom-step"
                  key={step.number}
                  style={{ "--step-index": index }}
                >
                  <span className="hcustom-step__number">
                    {step.number}
                  </span>

                  <div className="hcustom-step__copy">
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>

                  <CheckCircle2
                    className="hcustom-step__check"
                    size={17}
                    aria-hidden="true"
                  />
                </div>
              ))}
            </div>

            <div className="hcustom-actions">
              <Link
                to="/custom-printing"
                className="hcustom-button hcustom-button--primary"
              >
                <Upload size={16} aria-hidden="true" />
                Upload my file
                <ArrowRight size={15} aria-hidden="true" />
              </Link>

              <Link
                to="/design-services"
                className="hcustom-button hcustom-button--secondary"
              >
                <Box size={16} aria-hidden="true" />
                No file? Design with us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
