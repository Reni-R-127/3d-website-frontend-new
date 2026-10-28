import { useState } from 'react';
import { submitInquiry } from '../utils/submission.js';

export default function InquiryForm({ kind = 'contact', title = 'Send an inquiry', attachments }) {
  const [state, setState] = useState({ loading: false, error: '', success: false });

  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const selectedFiles = attachments
      ? formData.getAll('attachments').filter((file) => file instanceof File && file.size > 0)
      : [];
    const data = Object.fromEntries(formData.entries());
    delete data.attachments;

    if (attachments === '3d' && selectedFiles.some((file) => !/\.(stl|3mf|obj)$/i.test(file.name))) {
      setState({ loading: false, error: 'Please choose an STL, 3MF or OBJ file.', success: false });
      return;
    }

    setState({ loading: true, error: '', success: false });
    const result = await submitInquiry({ ...data, kind, attachments: selectedFiles });
    if (result.ok) {
      form.reset();
      setState({ loading: false, error: '', success: true });
    } else {
      setState({ loading: false, error: result.message, success: false });
    }
  }

  const accept = attachments === '3d' ? '.stl,.3mf,.obj' : attachments === 'photos' ? 'image/*' : undefined;

  return (
    <form className="inquiry-form" onSubmit={submit}>
      <h2>{title}</h2>
      <div className="form-grid">
        <label>Name<input required name="name" autoComplete="name" /></label>
        <label>Email<input required type="email" name="email" autoComplete="email" /></label>
      </div>
      <label>What would you like us to make?
        <textarea required name="details" rows="5" placeholder="Share a few details, quantities, timing or material preferences." />
      </label>
      {attachments && (
        <label>{attachments === 'photos' ? 'Reference photos' : '3D model file'}
          <input type="file" name="attachments" accept={accept} multiple />
          <small className="fine-print">{attachments === 'photos' ? 'Attach a few clear reference photos.' : 'Accepted formats: STL, 3MF and OBJ.'}</small>
        </label>
      )}
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      {state.success && <p className="form-success" role="status">The server accepted your inquiry.</p>}
      <button className="button coral" disabled={state.loading}>{state.loading ? 'Submitting…' : 'Send inquiry ↗'}</button>
    </form>
  );
}
