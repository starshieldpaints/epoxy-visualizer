import React, { useState } from "react";

export default function UserDetailsForm({ onNext, onBack, status }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", zip: "" });
  const canProceed = form.name && form.email && form.phone && form.zip;
  const isSaving = status?.state === "saving";
  const hasError = status?.state === "error";

  const handleSubmit = e => {
    e.preventDefault();
    if (!canProceed || isSaving) return;
    onNext(form);
  };

  return (
    <form className="form-card user-card" onSubmit={handleSubmit}>
      <div className="card-intro">
        <h2>Where can Starshield reach you?</h2>
        <p className="muted-text">
          We send a copy of the kit summary and route a Starshield epoxy specialist to follow up with pricing.
        </p>
        <div className="contact-callout">
          <span className="callout-badge">Fast Response</span>
          <span>Typical reply within 1 business day.</span>
        </div>
      </div>

      <div className="form-section-grid two-up">
        <div className="form-section">
          <label className="form-label" htmlFor="name">Name</label>
          <input
            id="name"
            className="form-input"
            placeholder="Full name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            autoComplete="name"
            required
          />
        </div>
        <div className="form-section">
          <label className="form-label" htmlFor="phone">Phone</label>
          <input
            id="phone"
            className="form-input"
            placeholder="Phone number"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="form-section-grid two-up">
        <div className="form-section">
          <label className="form-label" htmlFor="email">Email</label>
          <input
            id="email"
            className="form-input"
            placeholder="Email address"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <div className="form-section">
          <label className="form-label" htmlFor="zip">ZIP / Pin code</label>
          <input
            id="zip"
            className="form-input"
            placeholder="ZIP or PIN code"
            inputMode="numeric"
            autoComplete="postal-code"
            value={form.zip}
            onChange={e => setForm({ ...form, zip: e.target.value })}
            required
          />
        </div>
      </div>

      {hasError && status?.message && (
        <div className="form-alert error" role="alert">{status.message}</div>
      )}

      <div className="button-row">
        <button type="button" className="btn-link" onClick={onBack}>Back</button>
        <button type="submit" className="btn-main" disabled={!canProceed || isSaving}>
          {isSaving ? "Sending to Starshield..." : "View results"}
        </button>
      </div>
    </form>
  );
}
