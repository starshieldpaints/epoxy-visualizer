import React, { useState } from "react";

export default function UserDetailsForm({ onNext, onBack }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", zip: "" });
  const canProceed = form.name && form.email && form.phone && form.zip;
  const isSaving = status?.state === "saving";
  const hasError = status?.state === "error";

  const handleSubmit = e => {
    e.preventDefault();
    if (!canProceed || isSaving) return;
    onNext(form);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (canProceed) onNext(form);
  };

  return (
    <form className="form-card user-card" onSubmit={handleSubmit}>
      <h2>Contact Details</h2>
      <p className="muted-text">Share your contact so we can mail the kit summary and follow up with assistance.</p>
      <label className="form-label" htmlFor="name">Name</label>
      <input
        id="name"
        className="form-input"
        placeholder="Full name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        required
      />
      <label className="form-label" htmlFor="email">Email</label>
      <input
        id="email"
        className="form-input"
        placeholder="Email address"
        type="email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
        required
      />
      <label className="form-label" htmlFor="phone">Phone</label>
      <input
        id="phone"
        className="form-input"
        placeholder="Phone number"
        type="tel"
        inputMode="tel"
        value={form.phone}
        onChange={e => setForm({ ...form, phone: e.target.value })}
        required
      />
      <label className="form-label" htmlFor="zip">ZIP / Pin code</label>
      <input
        id="zip"
        className="form-input"
        placeholder="ZIP or PIN code"
        inputMode="numeric"
        value={form.zip}
        onChange={e => setForm({ ...form, zip: e.target.value })}
        required
      />
      <div className="button-row">
        <button type="button" className="btn-link" onClick={onBack}>Back</button>
        <button type="submit" className="btn-main" disabled={!canProceed}>Continue</button>
      </div>
    </form>
  );
}
