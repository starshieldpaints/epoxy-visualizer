import React, { useMemo, useState } from "react";

const PHONE_REGEX = /^\d{10}$/;

export default function UserDetailsForm({ onNext, onBack, status }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", zip: "" });

  const phoneIsValid = useMemo(() => PHONE_REGEX.test(form.phone), [form.phone]);
  const canProceed = form.name && form.email && form.zip && phoneIsValid;
  const isSaving = status?.state === "saving";
  const hasError = status?.state === "error";

  const handlePhoneChange = (event) => {
    const digitsOnly = event.target.value.replace(/\D/g, "").slice(0, 15);
    setForm((prev) => ({ ...prev, phone: digitsOnly }));
  };

  const getFormattedPhone = () => {
    const digits = form.phone.replace(/\D/g, "");
    if (!digits) return "";
    if (digits.startsWith("91") && digits.length >= 12) {
      return `+${digits}`;
    }
    return `+91${digits}`;
  };

  const normalizedPayload = () => ({
    ...form,
    name: form.name.trim(),
    email: form.email.trim(),
    phone: getFormattedPhone(),
    zip: form.zip.trim(),
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canProceed || isSaving) return;
    onNext(normalizedPayload());
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
        placeholder="10-digit phone number"
        type="tel"
        inputMode="tel"
        value={form.phone}
        onChange={handlePhoneChange}
        maxLength={15}
        aria-invalid={!phoneIsValid}
        required
      />
      {!phoneIsValid && form.phone.length > 0 && (
        <p className="error-text" role="alert">Enter a valid 10-digit phone number.</p>
      )}
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
        <button type="submit" className="btn-main" disabled={!canProceed || isSaving}>
          {isSaving ? "Saving..." : "Submit"}
        </button>
      </div>
      {hasError && status?.message && <p className="error-text" role="alert">{status.message}</p>}
    </form>
  );
}
