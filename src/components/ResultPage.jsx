import React from "react";
import { calculateEpoxyKit } from "../utils/epoxyCalc";

export default function ResultPage({ data, onBack }) {
  const area = Number(data.area);
  const thickness = Number(data.thickness);
  const epoxyType = data.epoxyDesignerType || data.epoxyMainType;

  const result = calculateEpoxyKit({
    area,
    epoxyType,
    floorThickness: thickness
  });

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", gap: "2rem",
      maxWidth: 520,
      margin: "0 auto",
      padding: "1.5rem 1rem",
      backgroundColor: "#fff",
      borderRadius: "18px",
      boxShadow: "0 0 25px rgba(255,0,0,0.15)"
    }}>
      <h2 style={{
        fontSize: "1.6rem",
        fontWeight: "900",
        color: "#b91c1c",
        marginBottom: "0.6rem",
        letterSpacing: "1.1px",
        textAlign: "center"
      }}>
        Epoxy Kit Calculation
      </h2>
      <table className="result-table" aria-label="Epoxy calculation results">
        <thead>
          <tr>
            <th>Section</th>
            <th>Resin (kg)</th>
            <th>Hardener (kg)</th>
            <th>Silica (kg)</th>
            <th>Pigment (kg)</th>
            <th>Total (kg)</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(result.kit).map(([section, vals]) => (
            <tr key={section}>
              <td>{section}</td>
              <td>{vals.Resin}</td>
              <td>{vals.Hardener}</td>
              <td>{vals.Silica}</td>
              <td>{vals.Pigment}</td>
              <td>{vals.Weight}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: "1.3rem", fontWeight: "700", fontSize: "1.15rem", color: "#a10000", textAlign: "center" }}>
        Total Kit Used: <span style={{ color: "#d42f2f" }}>{result.totalKitWeight} kg</span><br />
        Coverage Area: {result.coverage} m<sup>2</sup><br />
        Thickness: {result.thickness} mm<br />
        Epoxy Type: {result.epoxyType}
      </div>
      <button className="btn" onClick={onBack}>Back</button>
    </div>
  );
}
