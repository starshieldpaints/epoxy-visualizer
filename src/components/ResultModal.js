import React from "react";
import { sendResultEmail } from "../utils/email";

function ResultModal({ state, onClose }) {
  const downloadImage = () => {
    if (state.screenshot) {
      const a = document.createElement("a");
      a.href = state.screenshot;
      a.download = "epoxy-floor-result.png";
      a.click();
    }
  };

  const emailResult = async () => {
    const response = await sendResultEmail(state);
    alert(response.status === "Email sent" ?
      "Email sent successfully!" : "Email failed: " + response.error);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Result</h3>
        <img src={state.screenshot} alt="Epoxy Floor Preview" style={{ width: "100%", maxWidth: "420px" }} />
        <p>
          <strong>Name:</strong> {state.name}<br />
          <strong>Email:</strong> {state.email}<br />
          <strong>Base Color:</strong> {state.baseColor}<br />
          <strong>Flake Type:</strong> {state.flakeType}
        </p>
        <button onClick={downloadImage}>Download Image</button>
        <button onClick={emailResult} style={{ marginLeft: 12 }}>Email to Me</button>
        <button onClick={onClose} style={{ marginLeft: 12 }}>Close</button>
      </div>
    </div>
  );
}

export default ResultModal;
