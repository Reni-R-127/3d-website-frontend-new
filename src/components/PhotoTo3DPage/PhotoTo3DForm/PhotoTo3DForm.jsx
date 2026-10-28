import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowUpFromLine,
  Image as ImageIcon,
  Check,
  X,
  UserRound,
  Sparkles,
} from "lucide-react";
import { apiUrl as buildApiUrl } from "../../../utils/api.js";
import "./PhotoTo3DForm.css";

const MAX_PHOTOS = 4;
const MAX_FILE_SIZE = 15 * 1024 * 1024;

const FIGURINE_STYLES = [
  {
    id: "realistic",
    name: "Realistic",
    description: "Closest to photo",
    className: "realistic",
  },
  {
    id: "stylised",
    name: "Stylised",
    description: "Soft, rounded",
    className: "stylised",
  },
  {
    id: "chibi",
    name: "Chibi",
    description: "Big head, playful",
    className: "chibi",
  },
  {
    id: "bust",
    name: "Bust",
    description: "Head & shoulders",
    className: "bust",
  },
];

const HEIGHTS = ["8 cm", "12 cm", "18 cm", "Custom"];

const INITIAL_FORM = {
  height: "12 cm",
  customHeight: "",
  quantity: "1",
  people: "1 person",
  neededBy: "",
  notes: "",
  name: "",
  email: "",
  phone: "",
  permission: false,
};

function FigurineIllustration({ variant = "stylised" }) {
  return (
    <div
      className={`p3d-figurine-art p3d-figurine-art--${variant}`}
      aria-hidden="true"
    >
      <div className="p3d-figurine-art__lines" />

      <div className="p3d-figurine-art__shadow" />

      <div className="p3d-figurine-art__base" />

      <div className="p3d-figurine-art__body">
        <span className="p3d-figurine-art__head">
          <span className="p3d-figurine-art__shine" />
        </span>
      </div>
    </div>
  );
}

function PhotoUpload({ photos, onChange, error }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [fileError, setFileError] = useState("");

  const processFiles = useCallback(
    (fileList) => {
      const selectedFiles = Array.from(fileList || []);
      if (!selectedFiles.length) return;

      const availableSlots = MAX_PHOTOS - photos.length;

      if (availableSlots <= 0) {
        setFileError(`You can upload a maximum of ${MAX_PHOTOS} photos.`);
        return;
      }

      const validFiles = [];
      let message = "";

      selectedFiles.slice(0, availableSlots).forEach((file) => {
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
          message = "Only JPG, PNG, and WEBP images are supported.";
          return;
        }

        if (file.size > MAX_FILE_SIZE) {
          message = `${file.name} exceeds the 15 MB limit.`;
          return;
        }

        validFiles.push(file);
      });

      if (selectedFiles.length > availableSlots) {
        message = `You can upload a maximum of ${MAX_PHOTOS} photos.`;
      }

      const newPhotos = validFiles.map((file) => ({
        id: `${file.name}-${file.lastModified}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
      }));

      onChange((current) => [...current, ...newPhotos].slice(0, MAX_PHOTOS));
      setFileError(message);
    },
    [onChange, photos.length],
  );

  useEffect(() => {
    return () => {
      photos.forEach((photo) => URL.revokeObjectURL(photo.preview));
    };
  }, [photos]);

  const removePhoto = (photoId) => {
    onChange((current) => {
      const removed = current.find((photo) => photo.id === photoId);

      if (removed) URL.revokeObjectURL(removed.preview);

      return current.filter((photo) => photo.id !== photoId);
    });
  };

  return (
    <div className="p3d-upload-wrapper">
      <div
        className={`p3d-upload ${
          dragging ? "is-dragging" : ""
        } ${error ? "has-error" : ""}`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          processFiles(event.dataTransfer.files);
        }}
      >
        <input
          ref={inputRef}
          className="p3d-upload__input"
          type="file"
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          multiple
          onChange={(event) => {
            processFiles(event.target.files);
            event.target.value = "";
          }}
          aria-label="Upload reference photos"
        />

        {photos.length > 0 ? (
          <div className="p3d-upload__previews">
            {photos.map((photo) => (
              <div className="p3d-upload__preview" key={photo.id}>
                <img src={photo.preview} alt={photo.file.name} />

                <button
                  type="button"
                  onClick={() => removePhoto(photo.id)}
                  aria-label={`Remove ${photo.file.name}`}
                >
                  <X size={15} />
                </button>

                <span title={photo.file.name}>{photo.file.name}</span>
              </div>
            ))}

            {photos.length < MAX_PHOTOS && (
              <button
                className="p3d-upload__add"
                type="button"
                onClick={() => inputRef.current?.click()}
              >
                <ArrowUpFromLine size={20} />
                <span>Add photos</span>
              </button>
            )}
          </div>
        ) : (
          <button
            className="p3d-upload__empty"
            type="button"
            onClick={() => inputRef.current?.click()}
          >
            <span className="p3d-upload__icon">
              <ArrowUpFromLine size={23} />
            </span>

            <strong>
              Drag files here or <span>browse</span>
            </strong>

            <span className="p3d-upload__hint">
              JPG, PNG or WEBP · up to 15 MB · max 4 photos
            </span>
          </button>
        )}
      </div>

      {(fileError || error) && (
        <p className="p3d-field-error" role="alert">
          {fileError || error}
        </p>
      )}
    </div>
  );
}

function FormSectionHeading({ number, children }) {
  return (
    <h3 className="p3d-form__section-heading">
      <span>{number}</span>
      {children}
    </h3>
  );
}

export default function PhotoTo3DForm() {
  const sectionRef = useRef(null);
  const [photos, setPhotos] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState("realistic");
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({
    type: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reveal sections whenever the user scrolls back into view.
  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return undefined;

    const elements = root.querySelectorAll("[data-p3d-reveal]");

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => {
        element.classList.add("p3d-is-visible");
      });

      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("p3d-is-visible");

            // Restart the reveal animation when the section re-enters view.
            requestAnimationFrame(() => {
              entry.target.classList.add("p3d-is-visible");
            });
          } else {
            entry.target.classList.remove("p3d-is-visible");
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px",
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  const updateForm = (event) => {
    const { name, value, checked, type } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));

    setStatus({ type: "", message: "" });
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Please enter your name.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.phone.trim()) {
      nextErrors.phone = "Please enter your phone number.";
    } else if (form.phone.replace(/\D/g, "").length < 7) {
      nextErrors.phone = "Enter a valid phone number.";
    }

    const quantity = Number(form.quantity);

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 1000) {
      nextErrors.quantity = "Enter a quantity between 1 and 1000.";
    }

    if (
      form.height === "Custom" &&
      (!form.customHeight.trim() ||
        !Number.isFinite(Number(form.customHeight)) ||
        Number(form.customHeight) <= 0)
    ) {
      nextErrors.customHeight = "Enter a valid custom height in cm.";
    }

    if (!form.permission) {
      nextErrors.permission =
        "Please confirm that you have permission to use these photos.";
    }

    if (form.neededBy) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const requestedDate = new Date(`${form.neededBy}T00:00:00`);

      if (requestedDate < today) {
        nextErrors.neededBy = "Choose today or a future date.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload = new FormData();

      payload.append(
        "name",
        form.name.trim(),
      );
      payload.append(
        "email",
        form.email.trim(),
      );
      payload.append(
        "phone",
        form.phone.trim(),
      );
      payload.append("style", selectedStyle);
      payload.append(
        "height",
        form.height === "Custom"
          ? `${form.customHeight.trim()} cm`
          : form.height,
      );
      payload.append("quantity", form.quantity);
      payload.append("people", form.people);
      payload.append("neededBy", form.neededBy);
      payload.append("notes", form.notes.trim());
      payload.append("requestType", "photo-to-3d");
      payload.append("photoPermission", String(form.permission));

      photos.forEach((photo) => {
        payload.append("photos", photo.file);
      });

      const response = await fetch(buildApiUrl("/figurine-requests"), {
        method: "POST",
        body: payload,
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.message || "We couldn't send your request. Please try again later.");
      }

      setStatus({
        type: "success",
        message: result.message || "Your figurine request has been sent successfully. Our team will review your photos and contact you.",
      });

      setPhotos([]);
      setForm(INITIAL_FORM);
      setSelectedStyle("realistic");
      setErrors({});
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedStyleInfo =
    FIGURINE_STYLES.find((style) => style.id === selectedStyle) ||
    FIGURINE_STYLES[0];

  const displayedHeight =
    form.height === "Custom"
      ? `${form.customHeight || "—"} cm`
      : form.height;

  return (
    <section
      ref={sectionRef}
      className="p3d-form-section"
      aria-label="Photo to 3D figurine request form"
    >
      <div className="p3d-form__layout">
        <form
          className="p3d-form"
          onSubmit={handleSubmit}
          noValidate
        >
          {/* Step 1: Photos */}
          <section
            className="p3d-form__panel p3d-form__panel--photos"
            data-p3d-reveal
          >
            <FormSectionHeading number="1">
              Reference photos
            </FormSectionHeading>

            <label className="p3d-field-label">
              Photos of the person or pet
            </label>

            <PhotoUpload
              photos={photos}
              onChange={setPhotos}
              error={errors.photos}
            />

            <div className="p3d-photo-tips">
              <div className="p3d-photo-tips__good">
                <strong>
                  <Check size={15} />
                  Works best
                </strong>
                <p>✓ Clear, well-lit face</p>
                <p>✓ Front and side angles</p>
                <p>✓ Whole outfit if you want it</p>
              </div>

              <div className="p3d-photo-tips__avoid">
                <strong>
                  <X size={15} />
                  Avoid
                </strong>
                <p>× Blurry or very dark photos</p>
                <p>× Faces covered by sunglasses or hands</p>
                <p>× Group shots without saying who</p>
              </div>
            </div>
          </section>

          {/* Step 2: Style and size */}
          <section
            className="p3d-form__panel"
            data-p3d-reveal
          >
            <FormSectionHeading number="2">
              Style &amp; size
            </FormSectionHeading>

            <fieldset className="p3d-style-fieldset">
              <legend className="p3d-field-label">
                Figurine style
              </legend>

              <div className="p3d-style-grid">
                {FIGURINE_STYLES.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    className={`p3d-style-card ${
                      selectedStyle === style.id ? "is-selected" : ""
                    }`}
                    onClick={() => {
                      setSelectedStyle(style.id);
                      setStatus({ type: "", message: "" });
                    }}
                    aria-pressed={selectedStyle === style.id}
                  >
                    <FigurineIllustration variant={style.className} />

                    <strong>{style.name}</strong>
                    <span>{style.description}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="p3d-height-fieldset">
              <legend className="p3d-field-label">Height</legend>

              <div className="p3d-height-options">
                {HEIGHTS.map((height) => (
                  <button
                    key={height}
                    type="button"
                    className={`p3d-height-option ${
                      form.height === height ? "is-selected" : ""
                    }`}
                    aria-pressed={form.height === height}
                    onClick={() => {
                      setForm((current) => ({
                        ...current,
                        height,
                      }));
                      setErrors((current) => ({
                        ...current,
                        customHeight: "",
                      }));
                    }}
                  >
                    {height}
                  </button>
                ))}
              </div>
            </fieldset>

            {form.height === "Custom" && (
              <div className="p3d-field p3d-field--custom-height">
                <label htmlFor="p3d-custom-height">
                  Custom height (cm)
                </label>
                <input
                  id="p3d-custom-height"
                  name="customHeight"
                  type="number"
                  min="1"
                  max="100"
                  value={form.customHeight}
                  onChange={updateForm}
                  placeholder="Enter height in cm"
                  aria-invalid={Boolean(errors.customHeight)}
                />
                {errors.customHeight && (
                  <span className="p3d-field-error">
                    {errors.customHeight}
                  </span>
                )}
              </div>
            )}

            <div className="p3d-fields-grid p3d-fields-grid--three">
              <div className="p3d-field">
                <label htmlFor="p3d-quantity">Quantity</label>
                <input
                  id="p3d-quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  max="1000"
                  value={form.quantity}
                  onChange={updateForm}
                  aria-invalid={Boolean(errors.quantity)}
                  required
                />
                {errors.quantity && (
                  <span className="p3d-field-error">
                    {errors.quantity}
                  </span>
                )}
              </div>

              <div className="p3d-field">
                <label htmlFor="p3d-people">In the figurine</label>
                <select
                  id="p3d-people"
                  name="people"
                  value={form.people}
                  onChange={updateForm}
                >
                  <option>1 person</option>
                  <option>2 people</option>
                  <option>3 people</option>
                  <option>4 people</option>
                  <option>5+ people</option>
                  <option>Pet</option>
                  <option>Person and pet</option>
                </select>
              </div>

              <div className="p3d-field">
                <label htmlFor="p3d-needed-by">
                  Needed by <span className="p3d-optional">Optional</span>
                </label>
                <input
                  id="p3d-needed-by"
                  name="neededBy"
                  type="date"
                  value={form.neededBy}
                  onChange={updateForm}
                  aria-invalid={Boolean(errors.neededBy)}
                />
                {errors.neededBy && (
                  <span className="p3d-field-error">
                    {errors.neededBy}
                  </span>
                )}
              </div>
            </div>

            <div className="p3d-field p3d-field--notes">
              <label htmlFor="p3d-notes">
                Notes <span className="p3d-optional">Optional</span>
              </label>
              <textarea
                id="p3d-notes"
                name="notes"
                rows="4"
                value={form.notes}
                onChange={updateForm}
                placeholder="Pose, outfit, colours, occasion, a prop they love..."
              />
            </div>
          </section>

          {/* Step 3: Contact details */}
          <section
            className="p3d-form__panel p3d-form__panel--contact"
            data-p3d-reveal
          >
            <FormSectionHeading number="3">
              Your details
            </FormSectionHeading>

            <div className="p3d-fields-grid p3d-fields-grid--three">
              <div className="p3d-field">
                <label htmlFor="p3d-name">Name</label>
                <input
                  id="p3d-name"
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={updateForm}
                  placeholder="Full name"
                  aria-invalid={Boolean(errors.name)}
                  required
                />
                {errors.name && (
                  <span className="p3d-field-error">
                    {errors.name}
                  </span>
                )}
              </div>

              <div className="p3d-field">
                <label htmlFor="p3d-email">Email</label>
                <input
                  id="p3d-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={updateForm}
                  placeholder="name@example.com"
                  aria-invalid={Boolean(errors.email)}
                  required
                />
                {errors.email && (
                  <span className="p3d-field-error">
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="p3d-field">
                <label htmlFor="p3d-phone">Phone / WhatsApp</label>
                <input
                  id="p3d-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={updateForm}
                  placeholder="+91"
                  aria-invalid={Boolean(errors.phone)}
                  required
                />
                {errors.phone && (
                  <span className="p3d-field-error">
                    {errors.phone}
                  </span>
                )}
              </div>
            </div>

            <label className="p3d-permission">
              <input
                type="checkbox"
                name="permission"
                checked={form.permission}
                onChange={updateForm}
                aria-invalid={Boolean(errors.permission)}
              />
              <span>
                I have permission to use these photos, and I understand this
                is a request for review — not an order.
              </span>
            </label>

            {errors.permission && (
              <p className="p3d-field-error">
                {errors.permission}
              </p>
            )}

            {status.message && (
              <div
                className={`p3d-form__status p3d-form__status--${status.type}`}
                role={status.type === "error" ? "alert" : "status"}
              >
                {status.message}
              </div>
            )}

            <div className="p3d-form__actions">
              <span>
                We'll review your photos and contact you with the next steps.
              </span>

              <button
                type="submit"
                className="p3d-submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="p3d-spinner" />
                    Sending request...
                  </>
                ) : (
                  <>
                    Send figurine request
                    <Sparkles size={17} />
                  </>
                )}
              </button>
            </div>
          </section>
        </form>

        {/* Sticky summary */}
        <aside className="p3d-form__sidebar">
          <section
            className="p3d-preview-card"
            data-p3d-reveal
          >
            <h3>Your design preview</h3>

            <div className="p3d-preview-card__canvas">
              {photos.length > 0 ? (
                <img
                  className="p3d-preview-card__photo"
                  src={photos[0].preview}
                  alt="First uploaded reference photo"
                />
              ) : (
                <div className="p3d-preview-card__empty">
                  <ImageIcon size={30} strokeWidth={1.5} />
                  <strong>Appears here after review</strong>
                  <p>
                    We'll notify you when your first preview is ready in My
                    Account.
                  </p>
                </div>
              )}
            </div>
          </section>

          <section
            className="p3d-selected-card"
            data-p3d-reveal
          >
            <h3>Selected</h3>

            <dl>
              <div>
                <dt>Style</dt>
                <dd>{selectedStyleInfo.name}</dd>
              </div>
              <div>
                <dt>Height</dt>
                <dd>{displayedHeight}</dd>
              </div>
              <div>
                <dt>Photos</dt>
                <dd>{photos.length}</dd>
              </div>
              <div>
                <dt>Quantity</dt>
                <dd>{form.quantity || "—"}</dd>
              </div>
              <div>
                <dt>People / subject</dt>
                <dd>{form.people}</dd>
              </div>
              <div>
                <dt>Price</dt>
                <dd>Quoted after preview</dd>
              </div>
            </dl>
          </section>

          <section
            className="p3d-review-card"
            data-p3d-reveal
          >
            <span className="p3d-review-card__icon">
              <UserRound size={20} />
            </span>
            <div>
              <strong>Made for you</strong>
              <p>
                We'll review your photos, prepare a design preview, and
                confirm the quote before you place an order.
              </p>
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}
