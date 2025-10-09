import React, { useState } from "react";

export default function UserDetailsForm({ onNext }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", zip: "" });
  const canProceed = form.name && form.email && form.phone && form.zip;

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 24, background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.1)" }}>
      <h2>User Details</h2>
      <input
        placeholder="Name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        style={{ width: "100%", marginBottom: 12, padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
      />
      <input
        placeholder="Email"
        type="email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
        style={{ width: "100%", marginBottom: 12, padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
      />
      <input
        placeholder="Phone"
        type="tel"
        value={form.phone}
        onChange={e => setForm({ ...form, phone: e.target.value })}
        style={{ width: "100%", marginBottom: 12, padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
      />
      <input
        placeholder="ZIP Code"
        value={form.zip}
        onChange={e => setForm({ ...form, zip: e.target.value })}
        style={{ width: "100%", marginBottom: 12, padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
      />
      <button
        disabled={!canProceed}
        onClick={() => onNext(form)}
        style={{
          width: "100%",
          padding: 12,
          background: canProceed ? "#7f5af0" : "#ccc",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          cursor: canProceed ? "pointer" : "not-allowed"
        }}
      >
        Continue
      </button>
    </div>
  );
}
