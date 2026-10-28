import { useEffect, useRef, useState } from "react";
import "./OurJourney.css";

const JOURNEY_STEPS = [
  {
    label: "THE SPARK",
    title: "Born inside ProJenius",
    description:
      "The studio grew out of the ProJenius team's work in technology, design and making.",
    color: "teal",
  },
  {
    label: "THE FOCUS",
    title: "From prototypes to keepsakes",
    description:
      "People value things made just for them — so we built a studio around that.",
    color: "coral",
  },
  {
    label: "TODAY",
    title: "Many kinds of makers",
    description:
      "Shoppers, gift-givers, engineers, event organisers and parents.",
    color: "purple",
  },
  {
    label: "NEXT",
    title: "Easier ordering online",
    description:
      "Ready-made products and custom requests, in one simple place.",
    color: "gold",
  },
];

export default function OurJourney() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`our-journey ${isVisible ? "is-visible" : ""}`}
      aria-labelledby="our-journey-title"
    >
      <div className="our-journey__container">
        <header className="our-journey__header">
          <p className="our-journey__eyebrow">OUR JOURNEY</p>

          <h2 id="our-journey-title" className="our-journey__title">
            How we got here
          </h2>
        </header>

        <div className="our-journey__grid">
          {JOURNEY_STEPS.map((step, index) => (
            <article
              className={`our-journey__card our-journey__card--${step.color}`}
              key={step.label}
              style={{ "--card-index": index }}
            >
              <span
                className="our-journey__accent"
                aria-hidden="true"
              />

              <p className="our-journey__label">{step.label}</p>

              <h3 className="our-journey__card-title">{step.title}</h3>

              <p className="our-journey__description">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}