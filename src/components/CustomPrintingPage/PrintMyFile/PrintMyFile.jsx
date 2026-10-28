import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Upload,
  X,
  CheckCircle2,
  FileBox,
  ImagePlus,
  LoaderCircle,
} from "lucide-react";
import { apiUrl as buildApiUrl } from "../../../utils/api.js";
import "./PrintMyFile.css";

const MODEL_EXTENSIONS = [".stl", ".3mf", ".obj"];
const REFERENCE_EXTENSIONS = [
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

const MAX_MODEL_FILES = 5;
const MAX_MODEL_SIZE = 25 * 1024 * 1024;
const MAX_REFERENCE_SIZE = 25 * 1024 * 1024;

const MATERIALS = [
  "No preference — advise me",
  "PLA",
  "PETG",
  "ABS",
  "Resin",
  "TPU / Flexible",
  "Not sure — please advise",
];

const FINISHES = [
  {
    id: "standard",
    title: "Standard",
    description: "Fine visible layers",
  },
  {
    id: "fine",
    title: "Fine detail",
    description: "Smoother surface",
  },
  {
    id: "draft",
    title: "Draft",
    description: "Fastest, prototypes",
  },
  {
    id: "painted",
    title: "Painted",
    description: "Hand-finished (quote)",
  },
];

function getExtension(filename = "") {
  const dotIndex = filename.lastIndexOf(".");
  return dotIndex >= 0 ? filename.slice(dotIndex).toLowerCase() : "";
}

function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function StepHeading({ number, children }) {
  return (
    <h2 className="pmf-step-heading">
      <span className="pmf-step-number">{number}</span>
      <span>{children}</span>
    </h2>
  );
}

function UploadArea({
  id,
  label,
  hint,
  accept,
  multiple,
  icon: Icon = Upload,
  files,
  onFiles,
  onRemove,
  error,
  maxFiles,
}) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      setIsDragging(false);

      const droppedFiles = Array.from(event.dataTransfer.files || []);

      if (droppedFiles.length) {
        onFiles(droppedFiles);
      }
    },
    [onFiles]
  );

  return (
    <div className="pmf-upload-group">
      <label className="pmf-field-label" htmlFor={id}>
        {label}
      </label>

      <div
        className={`pmf-upload-zone ${
          isDragging ? "pmf-upload-zone--dragging" : ""
        } ${error ? "pmf-upload-zone--error" : ""}`}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsDragging(false);
          }
        }}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          id={id}
          className="pmf-visually-hidden"
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(event) => {
            const selectedFiles = Array.from(event.target.files || []);

            if (selectedFiles.length) {
              onFiles(selectedFiles);
            }

            // Let the user select the same file again after removing it.
            event.target.value = "";
          }}
        />

        <button
          type="button"
          className="pmf-upload-icon"
          onClick={() => inputRef.current?.click()}
          aria-label={`Browse ${label.toLowerCase()}`}
        >
          <Icon size={21} strokeWidth={2} />
        </button>

        <p className="pmf-upload-instruction">
          Drag files here or{" "}
          <button
            type="button"
            className="pmf-browse-button"
            onClick={() => inputRef.current?.click()}
          >
            browse
          </button>
        </p>

        <p className="pmf-upload-hint">{hint}</p>

        {maxFiles && (
          <p className="pmf-upload-count">
            {files.length} of {maxFiles} files selected
          </p>
        )}
      </div>

      {error && (
        <p className="pmf-error-message" role="alert">
          {error}
        </p>
      )}

      {files.length > 0 && (
        <ul className="pmf-file-list" aria-label={`${label} selected files`}>
          {files.map((file, index) => (
            <li
              className="pmf-file-item"
              key={`${file.name}-${file.size}-${index}`}
            >
              <span className="pmf-file-icon">
                <FileBox size={19} />
              </span>

              <span className="pmf-file-information">
                <span className="pmf-file-name">{file.name}</span>
                <span className="pmf-file-size">
                  {formatFileSize(file.size)}
                </span>
              </span>

              <button
                type="button"
                className="pmf-remove-file"
                onClick={() => onRemove(index)}
                aria-label={`Remove ${file.name}`}
              >
                <X size={17} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PreviewCube({ hasFiles }) {
  return (
    <div className="pmf-preview-art" aria-label="Illustration of a 3D cube">
      <div className="pmf-preview-grid" />

      <svg
        className={`pmf-cube ${hasFiles ? "pmf-cube--active" : ""}`}
        viewBox="0 0 300 290"
        role="img"
        aria-label={
          hasFiles
            ? "3D file selected. Actual model preview is not available."
            : "Sample 3D cube preview"
        }
      >
        <ellipse
          cx="150"
          cy="250"
          rx="105"
          ry="12"
          fill="#0b1b3a"
          opacity=".09"
        />

        <g className="pmf-cube-rotation">
          <polygon points="150,32 245,88 150,143 55,88" fill="#71d2dc" />
          <polygon points="55,88 150,143 150,244 55,188" fill="#12b4c6" />
          <polygon points="150,143 245,88 245,188 150,244" fill="#078a9a" />

          <path
            d="M150 143 V244 M55 88 L150 143 L245 88"
            fill="none"
            stroke="#07556b"
            strokeWidth="2.5"
            strokeDasharray="6 7"
            opacity=".8"
          />
        </g>
      </svg>

      <span className="pmf-preview-badge">
        {hasFiles ? "File selected" : "Sample preview"}
      </span>
    </div>
  );
}

function PreviewSidebar({ hasFiles }) {
  return (
    <aside className="pmf-sidebar">
      <section className="pmf-preview-card">
        <div className="pmf-preview-header">
          <h2>3D preview</h2>
          <span>{hasFiles ? "Sample illustration" : "Add a file to preview"}</span>
        </div>

        <PreviewCube hasFiles={hasFiles} />

        <p className="pmf-preview-caption">
          Rotate and zoom controls appear here in the live site. Final size and
          printability are confirmed by our team.
        </p>
      </section>

      <section className="pmf-quoting-card">
        <h2>How quoting works</h2>

        <ol>
          <li>
            <span>1</span>
            <p>
              <strong>Send</strong> — file and preferences
            </p>
          </li>
          <li>
            <span>2</span>
            <p>
              <strong>Review</strong> — we check walls, size, supports
            </p>
          </li>
          <li>
            <span>3</span>
            <p>
              <strong>Quote</strong> — price and timeline in your account
            </p>
          </li>
          <li>
            <span>4</span>
            <p>
              <strong>Approve &amp; pay</strong> — then we print
            </p>
          </li>
        </ol>
      </section>

      <div className="pmf-contact-note">
        <span>Prefer to talk?</span>
        <Link to="/contact">Message us</Link>
      </div>
    </aside>
  );
}

export default function PrintMyFile() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const [modelFiles, setModelFiles] = useState([]);
  const [referenceFiles, setReferenceFiles] = useState([]);
  const [modelError, setModelError] = useState("");
  const [referenceError, setReferenceError] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [form, setForm] = useState({
    material: MATERIALS[0],
    colour: "",
    quantity: "1",
    size: "",
    finish: "standard",
    instructions: "",
    name: "",
    email: "",
    phone: "",
    agreement: false,
  });

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return undefined;

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -20px 0px",
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const updateField = (event) => {
    const { name, value, checked, type } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setFormError("");
    setSuccessMessage("");
  };

  const addModelFiles = (incomingFiles) => {
    setModelError("");
    setFormError("");
    setSuccessMessage("");

    const accepted = [];
    const rejected = [];

    for (const file of incomingFiles) {
      if (!MODEL_EXTENSIONS.includes(getExtension(file.name))) {
        rejected.push(`${file.name}: unsupported file type.`);
        continue;
      }

      if (file.size > MAX_MODEL_SIZE) {
        rejected.push(`${file.name}: exceeds the 25 MB limit.`);
        continue;
      }

      accepted.push(file);
    }

    setModelFiles((previous) => {
      const combined = [...previous];

      for (const file of accepted) {
        const alreadyExists = combined.some(
          (item) => item.name === file.name && item.size === file.size
        );

        if (!alreadyExists && combined.length < MAX_MODEL_FILES) {
          combined.push(file);
        } else if (!alreadyExists) {
          rejected.push(
            `${file.name}: a maximum of ${MAX_MODEL_FILES} model files is allowed.`
          );
        }
      }

      return combined;
    });

    if (rejected.length) {
      setModelError(rejected.join(" "));
    }
  };

  const addReferenceFiles = (incomingFiles) => {
    setReferenceError("");
    setFormError("");
    setSuccessMessage("");

    const accepted = [];
    const rejected = [];

    for (const file of incomingFiles) {
      if (!REFERENCE_EXTENSIONS.includes(getExtension(file.name))) {
        rejected.push(`${file.name}: unsupported reference file type.`);
        continue;
      }

      if (file.size > MAX_REFERENCE_SIZE) {
        rejected.push(`${file.name}: exceeds the 25 MB limit.`);
        continue;
      }

      accepted.push(file);
    }

    setReferenceFiles((previous) => {
      const combined = [...previous];

      for (const file of accepted) {
        const alreadyExists = combined.some(
          (item) => item.name === file.name && item.size === file.size
        );

        if (!alreadyExists) {
          combined.push(file);
        }
      }

      return combined;
    });

    if (rejected.length) {
      setReferenceError(rejected.join(" "));
    }
  };

  const removeFile = (setter, index) => {
    setter((previous) => previous.filter((_, i) => i !== index));
    setSuccessMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    setSuccessMessage("");

    if (modelFiles.length === 0) {
      setModelError("Please upload at least one STL, 3MF or OBJ file.");
      setFormError("Add your 3D model file before sending the request.");
      return;
    }

    if (!form.agreement) {
      setFormError("Please confirm that you understand the quotation process.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();

      modelFiles.forEach((file) => payload.append("modelFiles", file));
      referenceFiles.forEach((file) =>
        payload.append("referenceFiles", file)
      );

      Object.entries(form).forEach(([key, value]) => {
        payload.append(key, String(value));
      });

      /*
       * Connect your backend here.
       *
       * Example:
       * const response = await fetch(
       *   `${import.meta.env.VITE_API_URL}/api/custom-printing`,
       *   { method: "POST", body: payload }
       * );
       *
       * Do not set Content-Type manually for FormData;
       * the browser adds the multipart boundary.
       */

      const response = await fetch(
        buildApiUrl("/custom-printing"),
        {
          method: "POST",
          body: payload,
        }
      );

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.message || "We couldn't send your request. Please check your details and try again.");
      }

      setSuccessMessage(result.message || "Your quotation request has been sent successfully.");

      setModelFiles([]);
      setReferenceFiles([]);

      setForm((previous) => ({
        ...previous,
        colour: "",
        quantity: "1",
        size: "",
        instructions: "",
        name: "",
        email: "",
        phone: "",
        agreement: false,
      }));
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      className={`pmf-section ${isVisible ? "pmf-is-visible" : ""}`}
      aria-labelledby="pmf-title"
    >
      <div className="pmf-layout">
        <form className="pmf-form-card" onSubmit={handleSubmit} noValidate>
          <section className="pmf-form-section pmf-upload-section">
            <StepHeading number="1">
              <span id="pmf-title">Your 3D file</span>
            </StepHeading>

            <UploadArea
              id="pmf-model-upload"
              label="3D model files"
              hint="STL, 3MF or OBJ · up to 25 MB each · max 5 files"
              accept=".stl,.3mf,.obj"
              multiple
              files={modelFiles}
              onFiles={addModelFiles}
              onRemove={(index) => removeFile(setModelFiles, index)}
              error={modelError}
              maxFiles={MAX_MODEL_FILES}
            />
          </section>

          <section className="pmf-form-section">
            <StepHeading number="2">Print preferences</StepHeading>

            <div className="pmf-field-grid">
              <div className="pmf-field">
                <label htmlFor="pmf-material">Material</label>
                <select
                  id="pmf-material"
                  name="material"
                  value={form.material}
                  onChange={updateField}
                >
                  {MATERIALS.map((material) => (
                    <option key={material} value={material}>
                      {material}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pmf-field">
                <label htmlFor="pmf-colour">Colour</label>
                <span className="pmf-optional">Optional</span>
                <input
                  id="pmf-colour"
                  name="colour"
                  value={form.colour}
                  onChange={updateField}
                  placeholder="e.g. matte black"
                />
              </div>

              <div className="pmf-field">
                <label htmlFor="pmf-quantity">Quantity</label>
                <input
                  id="pmf-quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  max="10000"
                  step="1"
                  required
                  value={form.quantity}
                  onChange={updateField}
                />
              </div>

              <div className="pmf-field">
                <label htmlFor="pmf-size">
                  Approx. size (L × W × H mm)
                </label>
                <span className="pmf-optional">Optional</span>
                <input
                  id="pmf-size"
                  name="size"
                  value={form.size}
                  onChange={updateField}
                  placeholder="84 × 40 × 22"
                />
              </div>
            </div>

            <fieldset className="pmf-finish-fieldset">
              <legend>Quality / finish</legend>

              <div className="pmf-finish-options">
                {FINISHES.map((finish) => (
                  <label
                    key={finish.id}
                    className={`pmf-finish-option ${
                      form.finish === finish.id ? "is-selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="finish"
                      value={finish.id}
                      checked={form.finish === finish.id}
                      onChange={updateField}
                    />
                    <span className="pmf-finish-title">{finish.title}</span>
                    <span className="pmf-finish-description">
                      {finish.description}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="pmf-field pmf-instructions-field">
              <label htmlFor="pmf-instructions">Instructions</label>
              <span className="pmf-optional">Optional</span>
              <textarea
                id="pmf-instructions"
                name="instructions"
                value={form.instructions}
                onChange={updateField}
                placeholder="Where will it be used? Any tolerances, holes or surfaces we should care about?"
                rows={4}
              />
            </div>

            <UploadArea
              id="pmf-reference-upload"
              label="Reference images"
              hint="Images, PDF, SVG, 3D files or a names list · up to 25 MB each"
              accept={REFERENCE_EXTENSIONS.join(",")}
              multiple
              icon={ImagePlus}
              files={referenceFiles}
              onFiles={addReferenceFiles}
              onRemove={(index) =>
                removeFile(setReferenceFiles, index)
              }
              error={referenceError}
            />
          </section>

          <section className="pmf-form-section pmf-details-section">
            <StepHeading number="3">Your details</StepHeading>

            <div className="pmf-customer-grid">
              <div className="pmf-field">
                <label htmlFor="pmf-name">Name</label>
                <input
                  id="pmf-name"
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={updateField}
                  placeholder="Full name"
                  required
                />
              </div>

              <div className="pmf-field">
                <label htmlFor="pmf-email">Email</label>
                <input
                  id="pmf-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={updateField}
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div className="pmf-field">
                <label htmlFor="pmf-phone">Phone / WhatsApp</label>
                <input
                  id="pmf-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={updateField}
                  placeholder="+91"
                  required
                />
              </div>
            </div>

            <label className="pmf-agreement">
              <input
                type="checkbox"
                name="agreement"
                checked={form.agreement}
                onChange={updateField}
                required
              />
              <span>
                I understand this is a request for a quote. The price is shared
                after review, and nothing is printed until I approve it.
              </span>
            </label>

            {formError && (
              <p className="pmf-form-error" role="alert">
                {formError}
              </p>
            )}

            {successMessage && (
              <p className="pmf-form-success" role="status">
                <CheckCircle2 size={19} />
                {successMessage}
              </p>
            )}

            <div className="pmf-submit-row">
              <p>No payment needed now.</p>

              <button
                className="pmf-submit-button"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle
                      className="pmf-spinner"
                      size={18}
                    />
                    Sending...
                  </>
                ) : (
                  "Send request"
                )}
              </button>
            </div>
          </section>
        </form>

        <PreviewSidebar hasFiles={modelFiles.length > 0} />
      </div>
    </section>
  );
}
