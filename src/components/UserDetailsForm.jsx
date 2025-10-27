import React, { useMemo, useState } from "react";
import { COUNTRY_CODES } from "../constants/countryCodes";

const PHONE_REGEX = /^\d{7,15}$/;

export default function UserDetailsForm({ onNext, onBack, status }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", zip: "" });
  const [countryCode, setCountryCode] = useState(() => {
    const india = COUNTRY_CODES.find(option => option.iso2 === "IN" || option.dialCode === "+91");
    return india?.dialCode ?? COUNTRY_CODES[0]?.dialCode ?? "+1";
  });

  const phoneIsValid = useMemo(() => PHONE_REGEX.test(form.phone), [form.phone]);
  const canProceed = form.name && form.email && form.zip && phoneIsValid;

  const handlePhoneChange = (event) => {
    const digitsOnly = event.target.value.replace(/\D/g, "").slice(0, 15);
    setForm((prev) => ({ ...prev, phone: digitsOnly }));
  };

  const getFormattedPhone = () => {
    const digits = form.phone.replace(/\D/g, "");
    if (!digits) return "";
    return `${countryCode}${digits}`;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canProceed) return;

    onNext({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: getFormattedPhone(),
      zip: form.zip.trim(),
      createdAt: new Date()
    });
  };

  return (
    <form className="form-card user-card" onSubmit={handleSubmit}>
      <h2>Contact Details</h2>
      <p className="muted-text">
        Share your contact so we can mail the kit summary and follow up with assistance.
      </p>

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
      <div className="form-input-combined">
        <select
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
          className="country-code-select-integrated"
        >
          {COUNTRY_CODES.map(option => (
            <option key={`${option.iso2}-${option.dialCode}`} value={option.dialCode}>
              {`${option.name} (${option.dialCode})`}
            </option>
          ))}
        </select>

        <input
          id="phone"
          className="phone-number-input-integrated"
          placeholder="Phone number"
          type="tel"
          inputMode="tel"
          value={form.phone}
          onChange={handlePhoneChange}
          maxLength={15}
          aria-invalid={!phoneIsValid}
          required
        />
      </div>

      {!phoneIsValid && form.phone.length > 0 && (
        <p className="error-text" role="alert">Enter a valid national phone number (7-15 digits).</p>
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
        <button type="button" className="btn-link" onClick={onBack}>
          Back
        </button>
        <button
          type="submit"
          className="btn-main"
          disabled={!canProceed}
        >
          Continue
        </button>
      </div>

      {status?.message && (
        <p
          className={`muted-text${
            status.state === "error" ? " error-text" : status.state === "saved" ? " success-text" : ""
          }`}
          style={{ marginTop: "0.75rem" }}
        >
          {status.message}
        </p>
      )}
    </form>
  );
}
