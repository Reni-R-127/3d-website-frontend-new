import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import "./HomePersonalizedGifts.css";

const SAMPLE_NAMES = [];

function KeychainIllustration({ name }) {
  return (
    <div className="hpg-keychain-scene" aria-label={`Personalized keychain preview for ${name}`}>
      <span className="hpg-scene-shadow" />

      <div className="hpg-keyring">
        <span className="hpg-keyring__ring" />

        <div className="hpg-keyring__tag">
          <span className="hpg-keyring__hole" />
          <span className="hpg-keyring__name">{name || "YOUR NAME"}</span>
        </div>
      </div>
    </div>
  );
}

function NamePlateIllustration({ name }) {
  return (
    <div className="hpg-nameplate-scene" aria-label={`Name plate preview for ${name}`}>
      <span className="hpg-nameplate__shadow" />

      <div className="hpg-nameplate">
        <div className="hpg-nameplate__inner">
          <span>{name || "YOUR NAME"}</span>
        </div>
      </div>
    </div>
  );
}

export default function HomePersonalizedGifts() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState("");

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
        threshold: 0.15,
        rootMargin: "0px 0px -35px 0px",
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const handleNameChange = (event) => {
    setName(event.target.value.slice(0, 18));
  };

  const normalizedName = name.trim().toUpperCase() || "YOUR NAME";

  return (
    <section
      ref={sectionRef}
      className={`home-personalized-gifts ${
        isVisible ? "hpg--visible" : ""
      }`}
      aria-labelledby="hpg-title"
    >
      <div className="hpg-container">
        <div className="hpg-content">
          <div className="hpg-copy hpg-reveal">
            <span className="hpg-eyebrow">
              PERSONALIZED GIFTS
            </span>

            <h2 id="hpg-title">
              Put their name
              <br />
              on it. Literally.
            </h2>

            <p className="hpg-description">
              Keychains, name plates, lamps and keepsakes printed with names,
              dates and short messages. Type a name and watch the preview.
            </p>

            <div className="hpg-name-form">
              <label htmlFor="hpg-name-input">
                Try a name
              </label>

              <input
                id="hpg-name-input"
                type="text"
                value={name}
                onChange={handleNameChange}
                maxLength={18}
                placeholder="Enter a name"
                autoComplete="off"
                spellCheck="false"
              />

              <div
                className="hpg-name-suggestions"
                aria-label="Name preview suggestions"
              >
                {SAMPLE_NAMES.map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    className={`hpg-name-chip ${
                      normalizedName === sample ? "is-selected" : ""
                    }`}
                    onClick={() => setName(sample)}
                    aria-pressed={normalizedName === sample}
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>

            <div className="hpg-actions">
              <Link
                to={`/personalized-gifts?name=${encodeURIComponent(
                  normalizedName === "YOUR NAME" ? "" : normalizedName
                )}`}
                className="hpg-button hpg-button--primary"
              >
                Personalize a gift
                <ArrowRight size={17} aria-hidden="true" />
              </Link>

              <Link
                to="/photo-to-3d"
                className="hpg-button hpg-button--secondary"
              >
                Photo-to-3D figurines
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="hpg-visuals">
            <div className="hpg-main-visual hpg-reveal hpg-reveal--visual">
              <KeychainIllustration name={normalizedName} />
            </div>

            <div className="hpg-preview-column hpg-reveal hpg-reveal--preview">
              <div className="hpg-preview-card">
                <NamePlateIllustration name={normalizedName} />

                <div className="hpg-preview-caption">
                  <span className="hpg-caption-check">
                    <Check size={14} aria-hidden="true" />
                  </span>

                  <p>
                    Preview is illustrative — final colours and spacing are
                    confirmed before printing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}