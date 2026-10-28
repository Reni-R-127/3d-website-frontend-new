import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import PrintMyFile from "../PrintMyFile/PrintMyFile";
import ThreeDDesign from "../3Ddesign/3Ddesign";

import "./CustomPrintHero.css";

function getServiceFromSearchParams(searchParams) {
  return searchParams.get("service") === "design" ? "design" : "print";
}

export default function CustomPrintHero() {
  const sectionRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // URL is the source of truth when landing from the mega-menu.
  const [activeForm, setActiveForm] = useState(() =>
    getServiceFromSearchParams(searchParams)
  );
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setActiveForm(getServiceFromSearchParams(searchParams));
  }, [searchParams]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const handleFormChange = (form) => {
    setActiveForm(form);

    const nextParams = new URLSearchParams(searchParams);
    if (form === "design") {
      nextParams.set("service", "design");
    } else {
      nextParams.delete("service");
    }

    setSearchParams(nextParams, { replace: true });
  };

  return (
    <>
      <section
        ref={sectionRef}
        className={`custom-print-hero ${isVisible ? "is-visible" : ""}`}
        aria-labelledby="custom-print-hero-title"
      >
        <div className="custom-print-hero__inner">
          <nav className="custom-print-hero__breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Custom printing</span>
          </nav>

          <div className="custom-print-hero__content">
            <h1 id="custom-print-hero-title" className="custom-print-hero__title">
              Send your 3D file. Get a real
              <br className="custom-print-hero__desktop-break" />
              quote from a real person.
            </h1>

            <p className="custom-print-hero__description">
              {activeForm === "print" ? (
                <>
                  Upload STL, 3MF or OBJ files, tell us how you want it printed, and we'll reply
                  <br className="custom-print-hero__desktop-break" />
                  with a manual quote and timeline.
                </>
              ) : (
                <>
                  Share a sketch, photo or description. We model it, print a prototype if you want
                  <br className="custom-print-hero__desktop-break" />
                  one, and refine until it fits.
                </>
              )}
            </p>

            <div className="custom-print-hero__switch" role="group" aria-label="Choose a 3D service">
              <span
                className={`custom-print-hero__switch-indicator ${activeForm === "design" ? "is-design" : ""}`}
                aria-hidden="true"
              />

              <button
                type="button"
                className={`custom-print-hero__switch-button ${activeForm === "print" ? "is-active" : ""}`}
                onClick={() => handleFormChange("print")}
                aria-pressed={activeForm === "print"}
              >
                Print my 3D file
              </button>

              <button
                type="button"
                className={`custom-print-hero__switch-button ${activeForm === "design" ? "is-active" : ""}`}
                onClick={() => handleFormChange("design")}
                aria-pressed={activeForm === "design"}
              >
                3D design &amp; prototyping
              </button>
            </div>
          </div>
        </div>
      </section>

      <section
        className="custom-print-form-section"
        aria-label={activeForm === "print" ? "Print my 3D file form" : "3D design and prototyping form"}
      >
        <div key={activeForm} className="custom-print-form-section__content">
          {activeForm === "print" ? <PrintMyFile /> : <ThreeDDesign />}
        </div>
      </section>
    </>
  );
}
