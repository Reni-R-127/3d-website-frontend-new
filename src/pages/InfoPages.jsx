import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import InquiryForm from "../components/InquiryForm.jsx";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import { apiRequest } from "../utils/api.js";
export function AboutPage() {
  useDocumentTitle("About Us");
  return (
    <section className="section container info-page">
      <span className="eyebrow">WHO WE ARE</span>
      <h1>A studio that treats every print like it's the only one.</h1>
      <p className="lede">
        ProJenius 3D Printing is the making studio of the ProJenius team.
      </p>
      <p>
        We print ready-made products, personalise gifts, bring your own 3D files
        to life and design new parts from scratch — for one person or a whole
        event. Every custom request is reviewed and quoted before production.
      </p>
      <div className="promise-grid">
        <article>
          <i>01</i>
          <b>Checked before printed</b>
          <p>Every custom file and personalisation is reviewed by a person.</p>
        </article>
        <article>
          <i>02</i>
          <b>Made for one — or a thousand</b>
          <p>Single keepsakes and event runs get the same care.</p>
        </article>
        <article>
          <i>03</i>
          <b>Clear quotes, no guesswork</b>
          <p>Custom work is priced manually, before you commit.</p>
        </article>
      </div>
    </section>
  );
}
export function ContactPage() {
  useDocumentTitle("Contact");
  return (
    <section className="section container two contact-layout">
      <div>
        <span className="eyebrow">CONTACT</span>
        <h1>Tell us what you have in mind.</h1>
        <p>
          Questions about an order, a custom print or an event run? Send the
          studio a note.
        </p>
        <p>Email and phone details will be published here soon.</p>
      </div>
      <InquiryForm kind="contact" title="Contact the studio" />
    </section>
  );
}
export function FAQPage() {
  useDocumentTitle("FAQs");
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    apiRequest("/faqs/public")
      .then((payload) => {
        if (cancelled) return;
        setFaqs((payload.data || payload.items || []).filter((row) => row.question && row.answer));
      })
      .catch((requestError) => { if (!cancelled) setError(requestError.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="section container">
      <span className="eyebrow">FAQ</span>
      <h1>Questions, answered</h1>
      <p>Can't find yours? <Link to="/contact">Contact the studio.</Link></p>
      <div className="faq-list">
        {loading && <p role="status">Loading published FAQs…</p>}
        {!loading && error && <p className="form-error" role="alert">{error}</p>}
        {!loading && !error && faqs.length === 0 && <p>No FAQs have been published yet.</p>}
        {!loading && !error && faqs.map((faq, index) => (
          <details key={faq._id || faq.id || faq.question} open={index === 0}>
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function NotFoundPage() {
  useDocumentTitle("Page Not Found");
  return (
    <section className="section container empty-state">
      <span className="eyebrow">404</span>
      <h1>That page isn't here.</h1>
      <p>Check the address or return to the storefront.</p>
      <Link className="button coral" to="/">
        Back home ↗
      </Link>
    </section>
  );
}
