import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { submitInquiry } from '../utils/submission.js';
import './ContactPage.css';

const topics = ['General question', 'About an order', 'Custom quote', 'Bulk / event', 'Partnership'];
const quickLinks = [
  ['Custom 3D printing', '/custom-printing'],
  ['Photo-to-3D figurine', '/photo-to-3d'],
  ['Bulk & event orders', '/bulk-orders'],
  ['Read the FAQ', '/faq'],
];

export default function ContactPage() {
  useDocumentTitle('Contact');
  const [topic, setTopic] = useState(topics[0]);
  const [state, setState] = useState({ loading: false, error: '', success: false });

  // Replays the reveal whenever an element re-enters the viewport.
  useEffect(() => {
    const elements = document.querySelectorAll('.contact-reveal');
    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-visible', entry.isIntersecting);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setState({ loading: true, error: '', success: false });
    const result = await submitInquiry({ ...data, kind: 'contact', topic });
    if (result.ok) {
      form.reset();
      setTopic(topics[0]);
      setState({ loading: false, error: '', success: true });
    } else {
      setState({ loading: false, error: result.message, success: false });
    }
  }

  return (
    <main className="contact-page">
      <section className="contact-intro contact-reveal">
        <span className="contact-eyebrow">WE’RE HERE TO HELP</span>
        <h1>Talk to the studio</h1>
        <p>Questions about an order, a quote or an idea? Send a message, or reach us directly<br className="contact-desktop-break" /> on WhatsApp.</p>
      </section>

      <div className="contact-grid">
        <form className="contact-form-card contact-reveal" onSubmit={handleSubmit}>
          <fieldset className="contact-topic-fieldset">
            <legend>What’s it about?</legend>
            <div className="contact-topic-list">
              {topics.map((item) => (
                <button
                  className={`contact-topic${topic === item ? ' is-active' : ''}`}
                  key={item}
                  type="button"
                  aria-pressed={topic === item}
                  onClick={() => setTopic(item)}
                >{item}</button>
              ))}
            </div>
          </fieldset>

          <div className="contact-fields-two">
            <label>Name<input name="name" autoComplete="name" placeholder="Full name" required /></label>
            <label>Phone / WhatsApp <span className="contact-optional">Optional</span><input name="phone" type="tel" autoComplete="tel" placeholder="+91" /></label>
          </div>
          <label>Email<input name="email" type="email" autoComplete="email" placeholder="name@example.com" required /></label>
          <label>Message<textarea name="message" rows="5" placeholder="How can we help?" required /></label>

          {state.error && <p className="contact-error" role="alert">{state.error}</p>}
          {state.success && <p className="contact-success" role="status">Your message was accepted. We’ll be in touch soon.</p>}
          <div className="contact-form-bottom">
            <span>We’ll get back to you as soon as we can.</span>
            <button className="contact-submit" type="submit" disabled={state.loading}>{state.loading ? 'Sending…' : 'Send message'}</button>
          </div>
        </form>

        <aside className="contact-sidebar">
          <a className="contact-whatsapp contact-reveal" href="https://wa.me/" target="_blank" rel="noreferrer" aria-label="Open WhatsApp to contact the studio">
            <span className="contact-wa-icon">WA</span>
            <span><strong>Chat on WhatsApp</strong><small>Open WhatsApp to ask a quick question</small></span>
            <span className="contact-arrow" aria-hidden="true">↗</span>
          </a>

          <div className="contact-details-card contact-reveal">
            <p><span>Email</span><strong>Contact details coming soon</strong></p>
            <p><span>Phone</span><strong>Contact details coming soon</strong></p>
            <p><span>Studio</span><strong>ProJenius 3D</strong></p>
            <p><span>Hours</span><strong>Contact us to confirm</strong></p>
          </div>

          <div className="contact-quote-card contact-reveal">
            <h2>Looking for a quote?</h2>
            <p>Use the right form and we can reply faster:</p>
            <nav aria-label="Quote request links">
              {quickLinks.map(([label, to]) => <Link key={to} to={to}>{label} <span aria-hidden="true">→</span></Link>)}
            </nav>
          </div>
        </aside>
      </div>
    </main>
  );
}
