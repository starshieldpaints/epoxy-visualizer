import React, { useMemo } from "react";
import { calculateEpoxyKit } from "../utils/epoxyCalc";

const statusCopy = {
  idle: {
    tone: "neutral",
    title: "Ready to share",
    description: "Save the summary or send it to your crew."
  },
  saving: {
    tone: "info",
    title: "Syncing with Starshield",
    description: "We're logging your project so a specialist can reach out."
  },
  saved: {
    tone: "success",
    title: "Starshield has your project",
    description: "Expect a follow-up with kit recommendations tailored to your site."
  },
  error: {
    tone: "danger",
    title: "Could not reach Starshield",
    description: "Use the summary below while you verify the Firebase credentials."
  }
};

export default function ResultPage({ data, onBack, onReset, calculation, leadStatus }) {
  const status = statusCopy[leadStatus?.state || "idle"];

  const result = useMemo(() => {
    if (calculation) return calculation;

    const area = Number(data.area);
    const thickness = Number(data.thickness);
    const epoxyType = data.epoxyType || data.epoxyDesignerType || data.epoxyMainType;

    return calculateEpoxyKit({
      area,
      epoxyType,
      floorThickness: thickness,
      needsRepair: data.needsRepair,
      repairThickness: data.repairThickness
    });
  }, [calculation, data]);

  const summary = [
    { label: "Application", value: data.placeFinal },
    { label: "Floor Type", value: data.floorTypeFinal },
    { label: "Surface Uneven", value: data.surfaceUneven },
    { label: "Repairing Needed", value: data.needsRepair },
    {
      label: "Repair Thickness",
      value: data.needsRepair === "Yes" && data.repairOption
        ? `${data.repairOption.thickness} mm`
        : data.needsRepair === "Yes" ? "Not selected" : "Not required"
    },
    { label: "Application Type", value: data.firstTime },
    { label: "Epoxy Finish", value: data.epoxyType },
    { label: "Base Colour", value: data.baseColor },
    { label: "Top Colour", value: data.topColor || "Not required" },
    { label: "Pearl Colour", value: data.pearlColor || "-" },
    {
      label: "Flakes",
      value: data.flakes === "Yes" ? `${data.flakesType || "Preferred"}` : "No"
    },
    { label: "Protective Coat", value: data.clearCoat },
    {
      label: "Tools Added",
      value: data.tools && data.tools.length ? data.tools.join(", ") : "None"
    }
  ].filter(item => item.value && item.value !== "");

  return (
    <div className="result-layout">
      <div className={`status-card ${status.tone}`}>
        <div className="status-meta">
          <span className="status-kicker">Starshield update</span>
          <h2>{status.title}</h2>
          <p>{status.description}</p>
          {leadStatus?.reference && (
            <span className="status-reference">Reference ID: {leadStatus.reference}</span>
          )}
          {leadStatus?.state === "error" && leadStatus?.message && (
            <span className="status-reference">{leadStatus.message}</span>
          )}
        </div>
        <div className="status-actions">
          <button type="button" className="btn-main" onClick={onReset}>Plan another area</button>
          <button type="button" className="btn-link" onClick={onBack}>Edit details</button>
        </div>
      </div>

      <section className="summary-card" aria-label="Project summary">
        <h3>Project Snapshot</h3>
        <dl className="summary-grid">
          {summary.map(item => (
            <div key={item.label} className="summary-item">
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="table-card" aria-label="Epoxy kit breakdown">
        <h3>Material Breakdown</h3>
        <div className="table-scroll">
          <table className="result-table" aria-describedby="kitNotes">
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
        </div>
        <p id="kitNotes" className="muted-text">Values include resin and hardener split as per recommended ratios.</p>
      </section>

      {result.repair && (
        <section className="table-card" aria-label="Repair material consumption">
          <h3>Repair Consumption</h3>
          <div className="table-scroll">
            <table className="result-table">
              <thead>
                <tr>
                  <th>Thickness (mm)</th>
                  <th>Density (kg/L)</th>
                  <th>Consumption (kg/m²)</th>
                  <th>Wastage (%)</th>
                  <th>Adjusted (kg/m²)</th>
                  <th>Total Adjusted (kg)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{result.repair.thickness}</td>
                  <td>{result.repair.density}</td>
                  <td>{result.repair.consumption}</td>
                  <td>{result.repair.wastage}</td>
                  <td>{result.repair.adjusted}</td>
                  <td>{result.repair.adjustedTotal}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="muted-text">Totals calculated for the entered area of {result.coverage} m².</p>
        </section>
      )}

      <div className="result-footer">
        <div className="totals">
          <span>Total Kit Used</span>
          <strong>{result.totalKitWeight} kg</strong>
        </div>
        <div className="totals">
          <span>Coverage Area</span>
          <strong>{result.coverage} m²</strong>
        </div>
        <div className="totals">
          <span>Thickness</span>
          <strong>{result.thickness} mm</strong>
        </div>
        <div className="totals">
          <span>Epoxy Type</span>
          <strong>{result.epoxyType}</strong>
        </div>
      </div>
    </div>
  );
}
