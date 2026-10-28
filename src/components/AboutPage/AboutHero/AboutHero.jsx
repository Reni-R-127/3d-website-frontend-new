import { useEffect, useRef, useState } from "react";
import "./AboutHero.css";

const illustrations = [
  { type: "vase", label: "3D printed vase", className: "about-hero__card--peach" },
  { type: "cube", label: "3D printed cube", className: "about-hero__card--cyan" },
  { type: "person", label: "Custom figurine", className: "about-hero__card--yellow" },
  { type: "dinosaur", label: "3D printed dinosaur", className: "about-hero__card--green" },
];

function Illustration({ type }) {
  switch (type) {
    case "vase":
      return (
        <svg viewBox="0 0 220 220" aria-hidden="true">
          <ellipse cx="110" cy="194" rx="76" ry="10" fill="#0b1b3a" opacity=".08" />
          <path d="M83 28 Q86 48 70 79 Q49 120 66 157 Q78 184 110 184 Q142 184 154 157 Q171 120 150 79 Q134 48 137 28Z" fill="#ff674b" />
          <ellipse cx="110" cy="28" rx="27" ry="7" fill="#0b1b3a" />
          <path d="M70 95 Q110 111 150 95 M65 119 Q110 136 155 119 M72 143 Q110 159 148 143" fill="none" stroke="#ffb29e" strokeWidth="3" />
          <path d="M83 30 Q86 49 70 79 Q49 120 66 157" fill="none" stroke="#f35439" strokeWidth="3" />
        </svg>
      );
    case "cube":
      return (
        <svg viewBox="0 0 220 220" aria-hidden="true">
          <ellipse cx="110" cy="194" rx="76" ry="10" fill="#0b1b3a" opacity=".08" />
          <path d="M110 40 177 78 110 118 43 78Z" fill="#72d3df" />
          <path d="M43 78 110 118 110 181 43 143Z" fill="#14b4c6" />
          <path d="M177 78 110 118 110 181 177 143Z" fill="#078c9e" />
          <path d="M110 40 110 118 M43 78 110 118 177 78 M110 118 110 181" fill="none" stroke="#0b1b3a" strokeWidth="2" strokeDasharray="5 5" opacity=".45" />
        </svg>
      );
    case "person":
      return (
        <svg viewBox="0 0 220 220" aria-hidden="true">
          <ellipse cx="110" cy="194" rx="76" ry="10" fill="#0b1b3a" opacity=".08" />
          <ellipse cx="110" cy="180" rx="55" ry="10" fill="#0b1b3a" />
          <circle cx="110" cy="67" r="32" fill="#f8b936" />
          <path d="M110 35 A32 32 0 0 1 110 99Z" fill="#d99416" />
          <path d="M110 99 Q74 109 73 178 L147 178 Q146 109 110 99Z" fill="#f8b936" />
          <path d="M110 99 Q146 109 147 178 L110 178Z" fill="#d99416" />
          <path d="M89 49 Q94 40 105 40" fill="none" stroke="#ffe3a0" strokeWidth="6" />
        </svg>
      );
    case "dinosaur":
      return (
        <svg viewBox="0 0 220 220" aria-hidden="true">
          <ellipse cx="110" cy="194" rx="76" ry="10" fill="#0b1b3a" opacity=".08" />
          <path d="M49 149 Q69 110 107 109 Q143 107 162 77 Q172 57 190 66 Q208 75 197 93 Q190 104 177 104 Q169 139 139 151 Q98 166 49 149Z" fill="#8bd039" />
          <path d="M83 147 83 178 Q83 188 92 188 Q101 188 101 178 L101 153 M139 148 139 179 Q139 188 148 188 Q157 188 157 179 L157 135" fill="#619f25" />
          <circle cx="185" cy="82" r="5" fill="#0b1b3a" />
          <path d="M91 119 91 148 M111 113 111 151 M131 105 131 145 M151 94 151 132" stroke="#c8ef91" strokeWidth="4" fill="none" />
        </svg>
      );
    default:
      return null;
  }
}

export default function AboutHero() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2, rootMargin: "0px 0px -5% 0px" }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`about-hero ${isVisible ? "is-visible" : ""}`}
      aria-labelledby="about-hero-title"
    >
      <div className="about-hero__inner">
        <div className="about-hero__content">
          <p className="about-hero__eyebrow">ABOUT PROJENIUS 3D</p>

          <h1 id="about-hero-title" className="about-hero__title">
            We make the things
            <br className="about-hero__desktop-break" />
            {" "}people imagine —
            <br className="about-hero__desktop-break" />
            {" "}one layer at a time.
          </h1>

          <p className="about-hero__description">
            ProJenius 3D Printing is the making studio of the ProJenius team.
            We combine careful engineering with a love for personal,
            meaningful objects.
          </p>
        </div>

        <div className="about-hero__gallery" aria-label="Examples of 3D printed creations">
          {illustrations.map((item, index) => (
            <div
              key={item.type}
              className={`about-hero__card ${item.className}`}
              style={{ "--card-index": index }}
              role="img"
              aria-label={item.label}
            >
              <Illustration type={item.type} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}