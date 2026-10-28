import { useEffect, useRef, useState } from "react";
import "./MissionVision.css";

const CONTENT = [
  {
    label: "MISSION",
    title: "Make custom manufacturing feel as simple as ordering online.",
    description:
      "Clear choices, honest quotes and a real person checking every custom job — so anyone can turn an idea, a file or a photo into something real.",
    theme: "mission",
  },
  {
    label: "VISION",
    title: "A trusted studio for personal and practical 3D printing.",
    description:
      "Where families find meaningful gifts, makers find a reliable print partner, and teams find a faster way to prototype.",
    theme: "vision",
  },
];

export default function MissionVision() {
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
        rootMargin: "0px 0px -25px 0px",
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`mission-vision ${
        isVisible ? "mission-vision--visible" : ""
      }`}
      aria-label="Our mission and vision"
    >
      <div className="mission-vision__container">
        {CONTENT.map((item, index) => (
          <article
            key={item.theme}
            className={`mission-vision__card mission-vision__card--${item.theme}`}
            style={{ "--card-index": index }}
          >
            <p className="mission-vision__label">{item.label}</p>

            <h2 className="mission-vision__title">{item.title}</h2>

            <p className="mission-vision__description">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}