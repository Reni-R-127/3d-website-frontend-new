import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Upload,
  X,
  CheckCircle2,
  Box,
  MessageCircle,
  ArrowRight,
  LoaderCircle,
} from "lucide-react";
import { apiUrl as buildApiUrl } from "../../../utils/api.js";
import "./3Ddesign.css";

const MAX_FILE_SIZE = 25 * 1024 * 1024;

const ALLOWED_EXTENSIONS = [
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".pdf",
  ".svg",
  ".stl",
  ".3mf",
  ".obj",
];

const OUTPUT_OPTIONS = [
  "File + printed prototype",
  "Print-ready file only",
  "Concept / feasibility",
];

const BUDGET_OPTIONS = [
  "Prefer not to say",
  "Under ₹1,000",
  "₹1,000 – ₹5,000",
  "₹5,000 – ₹10,000",
  "₹10,000 – ₹25,000",
  "Above ₹25,000",
];

const INITIAL_FORM = {
  projectTitle: "",
  description: "",
  expectedOutput: OUTPUT_OPTIONS[0],
  deadline: "",
  budget: BUDGET_OPTIONS[0],
  name: "",
  email: "",
  phone: "",
  quotationConsent: false,
};

function useRevealOnView() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = sectionRef.current;

    if (!element) return undefined;

    if (
      typeof IntersectionObserver === "undefined"
    ) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return { sectionRef, isVisible };
}

function UploadBox({
  id,
  files,
  onFilesChange,
  accept,
  multiple = true,
  description,
  error,
}) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateFiles = (incomingFiles) => {
    const selectedFiles = Array.from(incomingFiles || []);

    if (!selectedFiles.length) return;

    const validFiles = [];
    const errors = [];

    selectedFiles.forEach((file) => {
      const extension = `.${file.name
        .split(".")
        .pop()
        .toLowerCase()}`;

      if (!ALLOWED_EXTENSIONS.includes(extension)) {
        errors.push(`${file.name}: unsupported file type.`);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: maximum file size is 25 MB.`);
        return;
      }

      validFiles.push(file);
    });

    const combinedFiles = multiple
      ? [...files, ...validFiles]
      : validFiles.slice(0, 1);

    const uniqueFiles = combinedFiles.filter(
      (file, index, array) =>
        array.findIndex(
          (item) =>
            item.name === file.name &&
            item.size === file.size &&
            item.lastModified === file.lastModified
        ) === index
    );

    onFilesChange(uniqueFiles);

    if (errors.length) {
      window.alert(errors.join("\n"));
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const removeFile = (indexToRemove) => {
    onFilesChange(
      files.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <div className="design-upload">
      <input
        ref={inputRef}
        id={id}
        className="design-upload__input"
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(event) => {
          validateFiles(event.target.files);
        }}
      />

      <div
        className={`design-upload__dropzone ${
          isDragging ? "is-dragging" : ""
        }`}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          validateFiles(event.dataTransfer.files);
        }}
      >
        <button
          type="button"
          className="design-upload__trigger"
          onClick={() => inputRef.current?.click()}
          aria-label="Browse reference files"
        >
          <Upload size={22} strokeWidth={2} />
        </button>

        <p className="design-upload__prompt">
          Drag files here or{" "}
          <button
            type="button"
            className="design-upload__browse"
            onClick={() => inputRef.current?.click()}
          >
            browse
          </button>
        </p>

        <p className="design-upload__description">
          {description}
        </p>
      </div>

      {error && (
        <p className="design-form__error" role="alert">
          {error}
        </p>
      )}

      {files.length > 0 && (
        <ul className="design-upload__file-list">
          {files.map((file, index) => (
            <li
              className="design-upload__file"
              key={`${file.name}-${file.size}-${file.lastModified}`}
            >
              <span className="design-upload__file-name">
                {file.name}
              </span>

              <span className="design-upload__file-size">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </span>

              <button
                type="button"
                className="design-upload__remove"
                onClick={() => removeFile(index)}
                aria-label={`Remove ${file.name}`}
              >
                <X size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SectionHeading({ number, children }) {
  return (
    <div className="design-form__section-heading">
      <span className="design-form__step">{number}</span>
      <h2>{children}</h2>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  optional = false,
  error,
  children,
}) {
  return (
    <div className="design-form__field">
      <label htmlFor={htmlFor} className="design-form__label">
        {label}
        {optional && (
          <span className="design-form__optional">
            {" "}
            Optional
          </span>
        )}
      </label>

      {children}

      {error && (
        <p className="design-form__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function PreviewPanel() {
  return (
    <div className="design-preview__model">
      <svg
        className="design-preview__cube"
        viewBox="0 0 280 280"
        role="img"
        aria-label="Illustration of a 3D cube"
      >
        <ellipse
          cx="140"
          cy="240"
          rx="94"
          ry="11"
          fill="#0b1b3a"
          opacity=".08"
        />

        <path
          d="M140 32 235 86 140 140 45 86Z"
          fill="#70d0dc"
        />

        <path
          d="M45 86 140 140 140 236 45 181Z"
          fill="#12b5c6"
        />

        <path
          d="M140 140 235 86 235 181 140 236Z"
          fill="#0d899b"
        />

        <path
          d="M140 140 45 86 M140 140 235 86 M140 140 140 236"
          fill="none"
          stroke="#0b4265"
          strokeWidth="2.5"
          strokeDasharray="6 6"
          opacity=".75"
        />

        <path
          d="M92 59V145 M188 59V145"
          fill="none"
          stroke="#0b4265"
          strokeWidth="2.5"
          strokeDasharray="6 6"
          opacity=".65"
        />
      </svg>
    </div>
  );
}

export default function ThreeDdesign() {
  const { sectionRef, isVisible } = useRevealOnView();

  const [form, setForm] = useState(INITIAL_FORM);
  const [referenceFiles, setReferenceFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setSubmitMessage("");
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.projectTitle.trim()) {
      nextErrors.projectTitle = "Please enter a project title.";
    }

    if (!form.description.trim()) {
      nextErrors.description =
        "Please describe the design you need.";
    }

    if (!form.name.trim()) {
      nextErrors.name = "Please enter your name.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (
      form.phone.trim() &&
      !/^[+()\d\s-]{7,20}$/.test(form.phone.trim())
    ) {
      nextErrors.phone = "Please enter a valid phone number.";
    }

    if (!form.quotationConsent) {
      nextErrors.quotationConsent =
        "Please confirm that you understand the quotation process.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitMessage("");

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        payload.append(key, String(value));
      });

      payload.append("requestType", "3D design and prototyping");

      referenceFiles.forEach((file) => {
        payload.append("referenceFiles", file);
      });

      const response = await fetch(
        buildApiUrl("/design-services"),
        {
          method: "POST",
          body: payload,
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message ||
            "We couldn't submit your request. Please try again."
        );
      }

      setSubmitMessage(
        result.message ||
          "Your design request was submitted successfully."
      );

      setForm(INITIAL_FORM);
      setReferenceFiles([]);
      setErrors({});
    } catch (error) {
      setSubmitMessage(
        error.message ||
          "Something went wrong. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      className={`design-section ${
        isVisible ? "is-visible" : ""
      }`}
      aria-labelledby="design-section-title"
    >
      <div className="design-section__inner">
        <div className="design-section__grid">
          <form
            className="design-form design-reveal design-reveal--left"
            onSubmit={handleSubmit}
            noValidate
          >
            {/* SECTION 1 */}
            <section className="design-form__group">
              <SectionHeading number="1">
                Your idea
              </SectionHeading>

              <div className="design-form__fields">
                <Field
                  label="Project title"
                  htmlFor="design-project-title"
                  error={errors.projectTitle}
                >
                  <input
                    id="design-project-title"
                    name="projectTitle"
                    type="text"
                    maxLength={150}
                    placeholder="e.g. Wall mount for my router"
                    value={form.projectTitle}
                    onChange={updateField}
                    aria-invalid={Boolean(errors.projectTitle)}
                  />
                </Field>

                <Field
                  label="Describe what you need"
                  htmlFor="design-description"
                  error={errors.description}
                >
                  <textarea
                    id="design-description"
                    name="description"
                    rows="4"
                    maxLength={5000}
                    placeholder="What should it do? Where will it go? Any measurements?"
                    value={form.description}
                    onChange={updateField}
                    aria-invalid={Boolean(errors.description)}
                  />
                </Field>

                <div className="design-form__field">
                  <label className="design-form__label">
                    Sketches, photos or references
                    <span className="design-form__optional">
                      {" "}
                      Optional
                    </span>
                  </label>

                  <UploadBox
                    id="design-reference-files"
                    files={referenceFiles}
                    onFilesChange={setReferenceFiles}
                    accept=".png,.jpg,.jpeg,.webp,.pdf,.svg,.stl,.3mf,.obj"
                    description="Images, PDF, SVG, 3D files or a names list · up to 25 MB each"
                  />
                </div>
              </div>
            </section>

            {/* SECTION 2 */}
            <section className="design-form__group">
              <SectionHeading number="2">
                Scope
              </SectionHeading>

              <div className="design-form__fields">
                <fieldset className="design-form__fieldset">
                  <legend className="design-form__label">
                    Expected output
                  </legend>

                  <div className="design-choice-grid design-choice-grid--three">
                    {OUTPUT_OPTIONS.map((option) => (
                      <label
                        key={option}
                        className={`design-choice ${
                          form.expectedOutput === option
                            ? "is-selected"
                            : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="expectedOutput"
                          value={option}
                          checked={form.expectedOutput === option}
                          onChange={updateField}
                        />

                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="design-form__row">
                  <Field
                    label="Deadline"
                    htmlFor="design-deadline"
                    optional
                  >
                    <input
                      id="design-deadline"
                      name="deadline"
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={form.deadline}
                      onChange={updateField}
                    />
                  </Field>

                  <Field
                    label="Budget"
                    htmlFor="design-budget"
                    optional
                  >
                    <select
                      id="design-budget"
                      name="budget"
                      value={form.budget}
                      onChange={updateField}
                    >
                      {BUDGET_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              </div>
            </section>

            {/* SECTION 3 */}
            <section className="design-form__group">
              <SectionHeading number="3">
                Your details
              </SectionHeading>

              <div className="design-form__row design-form__row--three">
                <Field
                  label="Name"
                  htmlFor="design-name"
                  error={errors.name}
                >
                  <input
                    id="design-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    maxLength={100}
                    placeholder="Full name"
                    value={form.name}
                    onChange={updateField}
                    aria-invalid={Boolean(errors.name)}
                  />
                </Field>

                <Field
                  label="Email"
                  htmlFor="design-email"
                  error={errors.email}
                >
                  <input
                    id="design-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    maxLength={254}
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={updateField}
                    aria-invalid={Boolean(errors.email)}
                  />
                </Field>

                <Field
                  label="Phone / WhatsApp"
                  htmlFor="design-phone"
                  error={errors.phone}
                >
                  <input
                    id="design-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+91"
                    value={form.phone}
                    onChange={updateField}
                    aria-invalid={Boolean(errors.phone)}
                  />
                </Field>
              </div>

              <div className="design-form__consent">
                <input
                  id="design-consent"
                  name="quotationConsent"
                  type="checkbox"
                  checked={form.quotationConsent}
                  onChange={updateField}
                  aria-invalid={Boolean(errors.quotationConsent)}
                />

                <div>
                  <label htmlFor="design-consent">
                    I understand this is a request for a quote. The
                    price is shared after review, and nothing is
                    printed until I approve it.
                  </label>

                  {errors.quotationConsent && (
                    <p className="design-form__error" role="alert">
                      {errors.quotationConsent}
                    </p>
                  )}
                </div>
              </div>

              <div className="design-form__footer">
                <p>No payment needed now.</p>

                <button
                  className="design-form__submit"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle
                        className="design-spin"
                        size={18}
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send request
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </div>

              {submitMessage && (
                <p
                  className="design-form__message"
                  role="status"
                  aria-live="polite"
                >
                  {submitMessage}
                </p>
              )}
            </section>
          </form>

          {/* RIGHT SIDEBAR */}
          <aside className="design-sidebar">
            <div className="design-preview design-reveal design-reveal--right">
              <div className="design-preview__header">
                <h2>3D preview</h2>
                <span>Add a file to preview</span>
              </div>

              <PreviewPanel />

              <p className="design-preview__caption">
                Rotate and zoom controls appear here in the live
                site. Final size and printability are confirmed by
                our team.
              </p>
            </div>

            <div className="design-steps design-reveal design-reveal--right">
              <h2>How quoting works</h2>

              <ol>
                <li>
                  <span>1</span>
                  <p>
                    <strong>Send</strong> — your idea and references
                  </p>
                </li>

                <li>
                  <span>2</span>
                  <p>
                    <strong>Review</strong> — we check feasibility
                    and requirements
                  </p>
                </li>

                <li>
                  <span>3</span>
                  <p>
                    <strong>Quote</strong> — price and timeline
                  </p>
                </li>

                <li>
                  <span>4</span>
                  <p>
                    <strong>Approve &amp; pay</strong> — then we
                    begin the work
                  </p>
                </li>
              </ol>
            </div>

            <Link
              to="/contact"
              className="design-contact design-reveal design-reveal--right"
            >
              <MessageCircle size={18} />

              <span>Prefer to talk?</span>

              <strong>Message us</strong>

              <ArrowRight size={17} />
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
