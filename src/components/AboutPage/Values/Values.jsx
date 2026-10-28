import { useEffect, useRef, useState } from "react";
import "./Values.css";

const VALUES = [
  {
    title: "Precision",
    description: "Careful calibration, honest settings, clean finishing.",
  },
  {
    title: "Personal",
    description: "Every name, photo and file is treated as someone's story.",
  },
  {
    title: "Transparent",
    description: "Clear quotes and realistic timelines — never pressure.",
  },
  {
    title: "Curious",
    description: "We enjoy tricky prints and learning new materials.",
  },
];

export default function Values() {
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
        rootMargin: "0px 0px -20px 0px",
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`pj-values ${isVisible ? "pj-values--visible" : ""}`}
      aria-labelledby="pj-values-title"
    >
      <div className="pj-values__container">
        <header className="pj-values__header">
          <p className="pj-values__eyebrow">VALUES</p>

          <h2 id="pj-values-title" className="pj-values__title">
            What we care about
          </h2>
        </header>

        <div className="pj-values__grid">
          {VALUES.map((value, index) => (
            <article
              className="pj-values__card"
              key={value.title}
              style={{ "--card-index": index }}
            >
              <h3 className="pj-values__card-title">{value.title}</h3>

              <p className="pj-values__description">
                {value.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}