import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import "./HomeWhoWeAre.css";

const features = [
  {
    title: "Checked before printed",
    description:
      "Every custom file and personalisation is reviewed by a person.",
  },
  {
    title: "Made for one — or a thousand",
    description:
      "Single keepsakes and event runs get the same care.",
  },
  {
    title: "Clear quotes, no guesswork",
    description:
      "Custom work is priced manually, before you commit.",
  },
];

function FigurineIllustration() {
  return (
    <div className="who-art who-art--figurine" aria-hidden="true">
      <div className="who-art__figurine">
        <div className="who-art__head">
          <span className="who-art__head-highlight" />
        </div>

        <div className="who-art__body" />

        <div className="who-art__base" />
      </div>

      <div className="who-art__shadow" />
    </div>
  );
}

function CharacterIllustration() {
  return (
    <div className="who-art who-art--character" aria-hidden="true">
      <div className="who-art__character">
        <span className="who-art__eye who-art__eye--left" />
        <span className="who-art__eye who-art__eye--right" />
        <span className="who-art__spot who-art__spot--one" />
        <span className="who-art__spot who-art__spot--two" />
      </div>

      <div className="who-art__character-neck" />
      <div className="who-art__shadow" />
    </div>
  );
}

function PhoneIllustration() {
  return (
    <div className="who-art who-art--phone" aria-hidden="true">
      <div className="who-art__phone">
        <div className="who-art__phone-screen" />
      </div>

      <div className="who-art__phone-stand" />
      <div className="who-art__phone-base" />
      <div className="who-art__shadow" />
    </div>
  );
}

function IllustrationGrid() {
  return (
    <div className="who-visuals" aria-label="Examples of 3D printed designs">
      <div className="who-visuals__item who-visuals__item--one">
        <FigurineIllustration />
      </div>

      <div className="who-visuals__item who-visuals__item--two">
        <CharacterIllustration />
      </div>

      <div className="who-visuals__item who-visuals__item--three">
        <PhoneIllustration />
      </div>
    </div>
  );
}

export default function HomeWhoWeAre() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`home-who ${isVisible ? "is-visible" : ""}`}
      aria-labelledby="home-who-title"
    >
      <div className="home-who__container">
        <div className="home-who__visual reveal-item reveal-item--visual">
          <IllustrationGrid />
        </div>

        <div className="home-who__content">
          <span className="home-who__eyebrow reveal-item reveal-item--1">
            WHO WE ARE
          </span>

          <h2
            id="home-who-title"
            className="home-who__title reveal-item reveal-item--2"
          >
            A studio that treats every
            <br className="home-who__desktop-break" /> print like it's the
            only one.
          </h2>

          <p className="home-who__description reveal-item reveal-item--3">
            ProJenius 3D Printing is the making studio of the ProJenius
            team. We print ready-made products, personalise gifts, bring
            your own 3D files to life and design new parts from scratch —
            for one person or a whole event.
          </p>

          <ul className="home-who__features">
            {features.map((feature, index) => (
              <li
                className={`home-who__feature reveal-item reveal-item--${
                  index + 4
                }`}
                key={feature.title}
              >
                <Check
                  className="home-who__check"
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />

                <div className="home-who__feature-copy">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </li>
            ))}
          </ul>

          <Link
            to="/about"
            className="home-who__button reveal-item reveal-item--7"
          >
            More about us
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}