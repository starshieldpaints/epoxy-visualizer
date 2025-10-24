import React, { useMemo, useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber, deleteUser } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { doc, setDoc } from "firebase/firestore";
import toast, { Toaster } from 'react-hot-toast';

const COUNTRY_CODES = [
  { label: "India (IN)", code: "+91" },
  { label: "United Arab Emirates (AE)", code: "+971" },
  { label: "United Kingdom (GB)", code: "+44" },
  { label: "United States (US)", code: "+1" },
  { label: "Australia (AU)", code: "+61" },
  { label: "Austria (AT)", code: "+43" },
  { label: "Argentina (AR)", code: "+54" },
  { label: "Bangladesh (BD)", code: "+880" },
  { label: "Belgium (BE)", code: "+32" },
  { label: "South Korea (KR)", code: "+82" },
];

const PHONE_REGEX = /^\d{7,15}$/;

function OtpModal({ otp, setOtp, verifyOtp, isProcessing, error, onClose }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    verifyOtp();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content form-card">
        <h3>Enter OTP</h3>
        <p className="muted-text">
          A verification code has been sent to your phone.
        </p>

        <form onSubmit={handleSubmit}>
          <label className="form-label" htmlFor="otp">Verification Code</label>
          <input
            id="otp"
            className="form-input"
            placeholder="6-digit code"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            required
            inputMode="numeric"
            maxLength={6}
          />

          {(error && error.includes('OTP')) && <p className="error-text" role="alert">{error}</p>}

          <div className="button-row">
            <button
              type="button"
              className="btn-link"
              onClick={onClose}
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-main"
              disabled={!otp || isProcessing}
              style={{ width: 'auto' }}
            >
              {isProcessing ? "Verifying..." : "Verify & Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function UserDetailsForm({ onNext, onBack, status }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", zip: "" });
  const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0].code);

  const [otpSent, setOtpSent] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

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

  const normalizedPayload = () => ({
    name: form.name.trim(),
    email: form.email.trim(),
    phone: getFormattedPhone(),
    zip: form.zip.trim(),
    createdAt: new Date(),
  });

  const sendOtp = async () => {
    if (!auth) {
      setError("Firebase Auth not initialized. Check your environment variables.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      );

      const confirmation = await signInWithPhoneNumber(auth, getFormattedPhone(), window.recaptchaVerifier);
      setConfirmationResult(confirmation);
      setOtpSent(true);
      setShowOtpModal(true);

      toast.success("Verification code sent!", { duration: 3000 });

    } catch (err) {
      console.error("Failed to send OTP:", err);
      let errorMessage = "Failed to send OTP. Try again later.";
      if (err.code === 'auth/invalid-phone-number') {
        errorMessage = `Invalid phone number format or length for ${countryCode}.`;
      }
      setError(errorMessage);

      toast.error(errorMessage, { duration: 5000 });

    } finally {
      setIsProcessing(false);
    }
  };

  const verifyOtpAndSave = async () => {
    if (!confirmationResult || !otp) {
      setError("OTP is required");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const result = await confirmationResult.confirm(otp);
      const firebaseUser = result.user;

      if (!firebaseUser?.uid) throw new Error("Firebase user invalid");

      const payload = normalizedPayload();
      await setDoc(doc(db, "users", firebaseUser.uid), payload);

      await deleteUser(firebaseUser);

      toast.success("Request Recieved", { duration: 4000 });

      setShowOtpModal(false);
      onNext(payload);
    } catch (err) {
      console.error("OTP verification or Firestore error:", err);
      const errorMessage = "OTP verification failed. Please try again.";
      setError(errorMessage);

      toast.error(errorMessage, { duration: 5000 });

    } finally {
      setIsProcessing(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!otpSent) {
      sendOtp();
    } else if (showOtpModal) {
      verifyOtpAndSave();
    }
  };


  return (
    <>
      <form className="form-card user-card" onSubmit={handleFormSubmit}>
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
            disabled={otpSent}
          >
            {COUNTRY_CODES.map(c => (
              <option key={c.code} value={c.code}>
                {c.label}
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
            disabled={otpSent}
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
          <button type="button" className="btn-link" onClick={onBack} disabled={isProcessing}>Back</button>
          <button
            type="submit"
            className="btn-main"
            disabled={!canProceed || isProcessing}
          >
            {isProcessing ? "Sending OTP..." : "Submit"}
          </button>
        </div>

        {error && <p className="error-text" role="alert">{error}</p>}
        <div id="recaptcha-container"></div>
      </form>

      {showOtpModal && (
        <OtpModal
          otp={otp}
          setOtp={setOtp}
          verifyOtp={verifyOtpAndSave}
          isProcessing={isProcessing}
          error={error}
          onClose={() => setShowOtpModal(false)}
        />
      )}
      <Toaster position="bottom-center" />
    </>
  );
}