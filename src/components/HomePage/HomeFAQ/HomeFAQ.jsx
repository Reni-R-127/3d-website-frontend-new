import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Minus, ArrowRight } from "lucide-react";
import { apiRequest } from "../../../utils/api.js";
import "./HomeFAQ.css";

export default function HomeFAQ() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    apiRequest("/faqs/public")
      .then((payload) => {
        if (cancelled) return;
        const rows = (payload.data || payload.items || [])
          .filter((row) => row.question && row.answer)
          .map((row) => ({ question: row.question, answer: row.answer, id: row._id || row.id }));
        setFaqs(rows);
      })
      .catch((requestError) => { if (!cancelled) setError(requestError.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const toggleFAQ = (index) => {
    setActiveIndex((current) => (current === index ? -1 : index));
  };

  return (
    <section
      ref={sectionRef}
      className={`home-faq ${isVisible ? "home-faq--visible" : ""}`}
      aria-labelledby="home-faq-title"
    >
      <div className="home-faq__container">
        <div className="home-faq__intro faq-reveal">
          <span className="home-faq__eyebrow">FAQ</span>

          <h2 id="home-faq-title">
            Questions,
            <br />
            answered
          </h2>

          <p className="home-faq__description">
            Can't find yours? We usually reply on WhatsApp or email.
          </p>

          <div className="home-faq__actions">
            <Link to="/faq" className="home-faq__button home-faq__button--light">
              All FAQs
            </Link>

            <Link
              to="/contact"
              className="home-faq__button home-faq__button--dark"
            >
              Ask us
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="home-faq__list" aria-label="Frequently asked questions">
          {loading && <p className="home-faq__empty" role="status">Loading published FAQs…</p>}
          {!loading && error && <p className="home-faq__empty" role="alert">{error}</p>}
          {!loading && !error && faqs.length === 0 && <p className="home-faq__empty">No FAQs have been published yet.</p>}
          {!loading && !error && faqs.map((faq, index) => {
            const isOpen = activeIndex === index;
            const answerId = `home-faq-answer-${index}`;
            const questionId = `home-faq-question-${index}`;

            return (
              <article
                className={`home-faq__item faq-reveal ${
                  isOpen ? "home-faq__item--open" : ""
                }`}
                style={{ "--faq-index": index }}
                key={faq.question}
              >
                <h3 className="home-faq__question-heading">
                  <button
                    id={questionId}
                    type="button"
                    className="home-faq__question"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => toggleFAQ(index)}
                  >
                    <span>{faq.question}</span>

                    <span
                      className={`home-faq__toggle ${
                        isOpen ? "home-faq__toggle--active" : ""
                      }`}
                      aria-hidden="true"
                    >
                      {isOpen ? (
                        <Minus size={17} strokeWidth={2.5} />
                      ) : (
                        <Plus size={17} strokeWidth={2.5} />
                      )}
                    </span>
                  </button>
                </h3>

                <div
                  id={answerId}
                  className="home-faq__answer"
                  role="region"
                  aria-labelledby={questionId}
                  hidden={!isOpen}
                >
                  <p>{faq.answer}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
