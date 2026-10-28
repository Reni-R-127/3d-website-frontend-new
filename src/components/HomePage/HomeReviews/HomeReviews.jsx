import { useEffect, useRef, useState } from "react";
import { apiRequest } from "../../../utils/api.js";
import "./HomeReviews.css";

function ReviewCard({ review, index }) {
  return (
    <article
      className="home-reviews__card"
      style={{ "--review-index": index }}
    >
      <div className="home-reviews__stars" aria-label={`${Math.min(5, Math.max(0, Number(review.rating) || 0))} out of 5 stars`}>
        {Array.from({ length: Math.min(5, Math.max(0, Number(review.rating) || 0)) }, (_, starIndex) => (
          <span key={starIndex} aria-hidden="true">
            ★
          </span>
        ))}
      </div>

      <p className="home-reviews__text">{review.body || review.text || review.review}</p>

      <div className="home-reviews__author">
        <span className="home-reviews__customer">{review.customerName || review.customer || review.name}</span>
        <span className="home-reviews__separator" aria-hidden="true">
          ·
        </span>
        <span className="home-reviews__product">{review.productName || review.product || review.service || ""}</span>
      </div>
    </article>
  );
}

export default function HomeReviews() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    apiRequest("/reviews")
      .then((payload) => { if (!cancelled) setReviews((payload.data || payload.items || []).filter((row) => row.body || row.text || row.review)); })
      .catch((requestError) => { if (!cancelled) setError(requestError.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return undefined;

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    if (
      motionPreference.matches ||
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
        rootMargin: "0px 0px -25px 0px",
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`home-reviews ${
        isVisible ? "home-reviews--visible" : ""
      }`}
      aria-labelledby="home-reviews-title"
    >
      <div className="home-reviews__container">
        <header className="home-reviews__header">
          <div className="home-reviews__heading">
            <span className="home-reviews__eyebrow">
              CUSTOMER REVIEWS
            </span>

            <h2 id="home-reviews-title">What people say</h2>
          </div>

          <span className="home-reviews__notice">
            Published customer feedback
          </span>
        </header>

        <div className="home-reviews__grid">
          {reviews.map((review, index) => <ReviewCard key={review._id || review.id || `${review.customerName}-${index}`} review={review} index={index} />)}
        </div>
        {loading && <p className="home-reviews__empty" role="status">Loading published reviews…</p>}
        {!loading && error && <p className="home-reviews__empty" role="alert">{error}</p>}
        {!loading && !error && reviews.length === 0 && <p className="home-reviews__empty">No customer reviews have been published yet.</p>}
      </div>
    </section>
  );
}