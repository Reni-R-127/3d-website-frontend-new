import { useEffect, useMemo, useRef, useState } from "react";
import {
  Upload,
  CalendarDays,
  ArrowRight,
  CheckCircle2,
  X,
  Package,
  Gift,
  Box,
  Trophy,
} from "lucide-react";
import "./BulkOrderForm.css";

const STEPS = [
  { number: "01", title: "Brief", description: "Quantity, date, idea" },
  { number: "02", title: "Quote", description: "Per-piece pricing" },
  { number: "03", title: "Sample", description: "Photo or physical" },
  { number: "04", title: "Production", description: "Full run, checked" },
  { number: "05", title: "Delivery", description: "Before your date" },
];

const PRODUCT_TYPES = [
  {
    id: "keychains",
    label: "Logo keychains",
    icon: "keychain",
    description: "Logo keychains",
  },
  {
    id: "trophies",
    label: "Mementos & trophies",
    icon: "trophy",
    description: "Mementos & trophies",
  },
  {
    id: "desk",
    label: "Desk accessories",
    icon: "desk",
    description: "Desk accessories",
  },
  {
    id: "gifts",
    label: "Return gifts",
    icon: "gift",
    description: "Return gifts",
  },
  {
    id: "custom",
    label: "Custom product",
    icon: "box",
    description: "Custom product",
  },
];

const PRODUCT_ICONS = {
  trophy: Trophy,
  desk: Package,
  gift: Gift,
  box: Box,
};

const MAX_FILE_SIZE = 25 * 1024 * 1024;

const ACCEPTED_EXTENSIONS = [
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".pdf",
  ".svg",
  ".stl",
  ".3mf",
  ".obj",
  ".step",
  ".stp",
  ".zip",
  ".csv",
  ".xlsx",
];

const INITIAL_FORM = {
  productType: "keychains",
  purpose: "Corporate / employee gifts",
  quantity: "150",
  eventDate: "",
  requirements: "",
  budget: "Prefer not to say",
  organisation: "",
  name: "",
  email: "",
  phone: "",
};

function ProductIllustration({ type }) {
  if (type === "keychain") {
    return (
      <span className="bo-product-art bo-product-art--keychain">
        <span className="bo-keychain-ring" />
        <span className="bo-keychain-tag">NAME</span>
      </span>
    );
  }

  const Icon = PRODUCT_ICONS[type] || Box;

  return (
    <span className={`bo-product-art bo-product-art--${type}`}>
      <Icon size={27} strokeWidth={1.8} aria-hidden="true" />
    </span>
  );
}

function SectionTitle({ number, children }) {
  return (
    <h2 className="bo-section-title">
      <span className="bo-section-number">{number}</span>
      <span>{children}</span>
    </h2>
  );
}

export default function BulkOrderForm({ onSubmit }) {
  const sectionRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileError, setFileError] = useState("");
  const [submitStatus, setSubmitStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);

  // Replay the reveal animation whenever the section enters the viewport.
  useEffect(() => {
    const section = sectionRef.current;

    if (!section || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const selectedProduct = useMemo(
    () =>
      PRODUCT_TYPES.find((product) => product.id === form.productType) ||
      PRODUCT_TYPES[0],
    [form.productType]
  );

  const quantity = Math.max(0, Number(form.quantity) || 0);

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setSubmitStatus("");
  };

  const selectProduct = (productType) => {
    setForm((current) => ({
      ...current,
      productType,
    }));

    setSubmitStatus("");
  };

  const handleFiles = (event) => {
    const files = Array.from(event.target.files || []);
    const validFiles = [];
    const errors = [];

    files.forEach((file) => {
      const extension = `.${file.name.split(".").pop().toLowerCase()}`;

      if (!ACCEPTED_EXTENSIONS.includes(extension)) {
        errors.push(`${file.name}: unsupported file type.`);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: maximum file size is 25 MB.`);
        return;
      }

      validFiles.push(file);
    });

    setSelectedFiles((current) => {
      const combined = [...current];

      validFiles.forEach((file) => {
        const alreadyAdded = combined.some(
          (existing) =>
            existing.name === file.name &&
            existing.size === file.size &&
            existing.lastModified === file.lastModified
        );

        if (!alreadyAdded) {
          combined.push(file);
        }
      });

      return combined;
    });

    setFileError(errors.join(" "));
    setSubmitStatus("");

    // Allow selecting the same file again after removing it.
    event.target.value = "";
  };

  const removeFile = (fileToRemove) => {
    setSelectedFiles((current) =>
      current.filter(
        (file) =>
          !(
            file.name === fileToRemove.name &&
            file.size === fileToRemove.size &&
            file.lastModified === fileToRemove.lastModified
          )
      )
    );

    setFileError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitStatus("");

    if (quantity < 10) {
      setSubmitStatus("Please enter a quantity of at least 10.");
      return;
    }

    if (form.eventDate) {
      const selectedDate = new Date(`${form.eventDate}T00:00:00`);

      if (selectedDate < new Date(new Date().setHours(0, 0, 0, 0))) {
        setSubmitStatus("Please select today or a future event date.");
        return;
      }
    }

    if (fileError) {
      setSubmitStatus("Please resolve the file upload errors first.");
      return;
    }

    if (typeof onSubmit !== "function") {
      setSubmitStatus(
        "The form is ready. Connect the onSubmit prop to your backend to send quote requests."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        ...form,
        quantity,
        productLabel: selectedProduct.label,
        files: selectedFiles,
      });

      setSubmitStatus(
        "Your bulk quote request was submitted successfully."
      );
    } catch (error) {
      setSubmitStatus(
        error?.message ||
          "We couldn't submit your request. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      className={`bo-form-section ${isVisible ? "is-visible" : ""}`}
      aria-labelledby="bo-form-heading"
    >
      <div className="bo-container">
        {/* Process steps */}
        <div className="bo-process-grid" aria-label="Bulk order process">
          {STEPS.map((step, index) => (
            <article
              className="bo-process-card bo-reveal"
              key={step.number}
              style={{ "--bo-delay": `${index * 80}ms` }}
            >
              <span className="bo-process-step">
                Step {index + 1}
              </span>

              <h3>{step.title}</h3>

              <p>{step.description}</p>
            </article>
          ))}
        </div>

        <div className="bo-layout">
          {/* Main form */}
          <form className="bo-form-card" onSubmit={handleSubmit}>
            <div className="bo-form-section-block">
              <SectionTitle number="1">
                What do you need?
              </SectionTitle>

              <div className="bo-field bo-product-field">
                <span className="bo-field-label">Product type</span>

                <div className="bo-product-grid">
                  {PRODUCT_TYPES.map((product) => (
                    <button
                      type="button"
                      key={product.id}
                      className={`bo-product-option ${
                        form.productType === product.id
                          ? "is-selected"
                          : ""
                      }`}
                      onClick={() => selectProduct(product.id)}
                      aria-pressed={form.productType === product.id}
                    >
                      <ProductIllustration type={product.icon} />

                      <span className="bo-product-label">
                        {product.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bo-fields-grid bo-fields-grid--three">
                <label className="bo-field">
                  <span className="bo-field-label">
                    Event / purpose
                  </span>

                  <select
                    name="purpose"
                    value={form.purpose}
                    onChange={updateField}
                  >
                    <option>Corporate / employee gifts</option>
                    <option>Wedding favours</option>
                    <option>Birthday / return gifts</option>
                    <option>Trade show / event merchandise</option>
                    <option>School / college event</option>
                    <option>Brand promotion</option>
                    <option>Other</option>
                  </select>
                </label>

                <label className="bo-field">
                  <span className="bo-field-label">
                    Quantity
                  </span>

                  <span className="bo-field-hint">Minimum 10</span>

                  <input
                    type="number"
                    name="quantity"
                    min="10"
                    step="1"
                    value={form.quantity}
                    onChange={updateField}
                    required
                  />
                </label>

                <label className="bo-field">
                  <span className="bo-field-label">
                    Event date
                  </span>

                  <span className="bo-date-input">
                    <input
                      type="date"
                      name="eventDate"
                      value={form.eventDate}
                      min={new Date().toLocaleDateString("en-CA")}
                      onChange={updateField}
                    />
                    <CalendarDays
                      size={17}
                      aria-hidden="true"
                    />
                  </span>
                </label>
              </div>

              <label className="bo-field bo-requirements-field">
                <span className="bo-field-label">
                  Customisation requirements
                </span>

                <textarea
                  name="requirements"
                  value={form.requirements}
                  onChange={updateField}
                  rows="4"
                  maxLength={2000}
                  placeholder="Logo on front, each guest's name on back, colours to match our theme..."
                />
              </label>

              <div className="bo-field bo-upload-field">
                <span className="bo-field-label">
                  Reference files (logo, artwork, names list){" "}
                  <span className="bo-optional">Optional</span>
                </span>

                <button
                  type="button"
                  className="bo-upload-zone"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();

                    const transfer = event.dataTransfer;
                    const files = Array.from(transfer.files || []);

                    handleFiles({
                      target: {
                        files,
                        value: "",
                      },
                    });
                  }}
                >
                  <span className="bo-upload-icon">
                    <Upload size={21} />
                  </span>

                  <span className="bo-upload-instruction">
                    Drag files here or{" "}
                    <span className="bo-browse-link">browse</span>
                  </span>

                  <span className="bo-upload-hint">
                    Images, PDF, SVG, 3D files or a names list · up to 25 MB per file
                  </span>
                </button>

                <input
                  ref={fileInputRef}
                  className="bo-file-input"
                  type="file"
                  accept={ACCEPTED_EXTENSIONS.join(",")}
                  multiple
                  onChange={handleFiles}
                  aria-label="Upload reference files"
                />

                {fileError && (
                  <p className="bo-file-error" role="alert">
                    {fileError}
                  </p>
                )}

                {selectedFiles.length > 0 && (
                  <ul className="bo-file-list">
                    {selectedFiles.map((file) => (
                      <li
                        className="bo-file-item"
                        key={`${file.name}-${file.size}-${file.lastModified}`}
                      >
                        <span className="bo-file-name">
                          {file.name}
                        </span>

                        <span className="bo-file-size">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </span>

                        <button
                          type="button"
                          className="bo-remove-file"
                          onClick={() => removeFile(file)}
                          aria-label={`Remove ${file.name}`}
                        >
                          <X size={15} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <label className="bo-field bo-budget-field">
                <span className="bo-field-label">Budget</span>
                <span className="bo-field-hint">Optional</span>

                <select
                  name="budget"
                  value={form.budget}
                  onChange={updateField}
                >
                  <option>Prefer not to say</option>
                  <option>Under ₹5,000</option>
                  <option>₹5,000 – ₹15,000</option>
                  <option>₹15,000 – ₹50,000</option>
                  <option>₹50,000 – ₹1,00,000</option>
                  <option>Above ₹1,00,000</option>
                </select>
              </label>
            </div>

            {/* Contact details */}
            <div className="bo-form-section-block bo-contact-block">
              <SectionTitle number="2">
                Who should we contact?
              </SectionTitle>

              <label className="bo-field bo-organisation-field">
                <span className="bo-field-label">Organisation</span>
                <span className="bo-field-hint">Optional</span>

                <input
                  type="text"
                  name="organisation"
                  value={form.organisation}
                  onChange={updateField}
                  maxLength={150}
                  placeholder="Company, college or family name"
                />
              </label>

              <div className="bo-fields-grid bo-fields-grid--three">
                <label className="bo-field">
                  <span className="bo-field-label">Name</span>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={updateField}
                    maxLength={120}
                    autoComplete="name"
                    placeholder="Full name"
                    required
                  />
                </label>

                <label className="bo-field">
                  <span className="bo-field-label">Email</span>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={updateField}
                    autoComplete="email"
                    placeholder="name@example.com"
                    required
                  />
                </label>

                <label className="bo-field">
                  <span className="bo-field-label">
                    Phone / WhatsApp
                  </span>

                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={updateField}
                    autoComplete="tel"
                    maxLength={20}
                    placeholder="+91"
                    required
                  />
                </label>
              </div>

              <div className="bo-submit-row">
                <p className="bo-submit-note">
                  We'll reply with pricing and a sample plan.
                </p>

                <button
                  type="submit"
                  className="bo-submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Request bulk quote"}
                  {!isSubmitting && (
                    <ArrowRight size={17} aria-hidden="true" />
                  )}
                </button>
              </div>

              {submitStatus && (
                <p
                  className={`bo-submit-status ${
                    submitStatus.includes("successfully")
                      ? "is-success"
                      : "is-error"
                  }`}
                  role="status"
                >
                  {submitStatus}
                </p>
              )}
            </div>
          </form>

          {/* Right sidebar */}
          <aside className="bo-sidebar">
            <section className="bo-summary-card bo-reveal">
              <p className="bo-sidebar-eyebrow">YOUR REQUEST</p>

              <h2>
                {quantity || "—"} × {selectedProduct.description.toLowerCase()}
              </h2>

              <p>
                Larger quantities usually lower the per-piece price.
                Exact pricing comes with your quote.
              </p>

              {form.eventDate && (
                <div className="bo-summary-date">
                  <CalendarDays size={16} />
                  <span>
                    Event:{" "}
                    {new Date(
                      `${form.eventDate}T00:00:00`
                    ).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
            </section>

            <section className="bo-includes-card bo-reveal">
              <h3>Good to include</h3>

              <ul>
                <li>Logo as SVG or high-res PNG</li>
                <li>Names list if each piece is personalised</li>
                <li>Brand or theme colours</li>
                <li>Delivery location and date</li>
              </ul>
            </section>

            <section className="bo-help-card bo-reveal">
              <span className="bo-help-icon">
                <CheckCircle2 size={21} />
              </span>

              <h3>Not sure where to start?</h3>

              <p>
                Tell us your idea, quantity and deadline. We can
                help you choose the right product.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </section>
  );
}