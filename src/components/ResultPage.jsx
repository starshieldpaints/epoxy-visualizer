import React, { useCallback } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { calculateEpoxyKit } from "../utils/epoxyCalc";
import starshieldLogo from "../assets/starshield-logo.jpg";

const imageCache = {};

async function loadImageAsBase64(src) {
  if (imageCache[src]) return imageCache[src];
  const response = await fetch(src);
  const blob = await response.blob();
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
  imageCache[src] = dataUrl;
  return dataUrl;
}

export default function ResultPage({ data, onBack }) {
  const area = Number(data.area);
  const thickness = Number(data.thickness);
  const epoxyType = data.epoxyType || data.epoxyDesignerType || data.epoxyMainType;

  const result = calculateEpoxyKit({
    area,
    epoxyType,
    floorThickness: thickness,
    needsRepair: data.needsRepair,
    repairThickness: data.repairThickness,
    protectiveCoat: data.clearCoat
  });

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
    {
      label: "Flakes",
      value: data.flakes === "Yes" ? data.flakesType || "Preferred" : "No"
    },
    { label: "Protective Coat", value: data.clearCoat },
    {
      label: "Tools Added",
      value: data.tools && data.tools.length ? data.tools.join(", ") : "None"
    },
    { label: "Name", value: data.name },
    { label: "Email", value: data.email },
    { label: "Phone", value: data.phone },
    { label: "ZIP / Pin", value: data.zip }
  ].filter(item => item.value && item.value !== "");

  const handleDownloadReport = useCallback(async () => {
    try {
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 16;
      const lineHeight = 6;
      const sectionSpacing = 8;
      let cursorY = 30;

      const ensureSpace = extra => {
        if (cursorY + extra > pageHeight - margin) {
          doc.addPage();
          cursorY = margin;
        }
      };

      const writePair = (label, value) => {
        ensureSpace(lineHeight);
        doc.setFont("helvetica", "bold");
        doc.text(`${label}:`, margin, cursorY);
        doc.setFont("helvetica", "normal");
        doc.text(String(value ?? "-"), margin + 40, cursorY);
        cursorY += lineHeight;
      };

      const addSectionTitle = title => {
        ensureSpace(sectionSpacing);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.text(title, margin, cursorY);
        cursorY += lineHeight;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
      };

      doc.setFillColor(185, 28, 28);
      doc.rect(0, 0, pageWidth, 24, "F");

      try {
        const logoData = await loadImageAsBase64(starshieldLogo);
        doc.addImage(logoData, "JPEG", margin, 5, 28, 12);
      } catch (logoError) {
        console.warn("Could not load logo for PDF", logoError);
      }

      doc.setTextColor("#ffffff");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("Starshield Epoxy Kit Report", pageWidth / 2, 14, { align: "center" });

      doc.setTextColor("#111111");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);

      ensureSpace(lineHeight);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, cursorY);
      cursorY += lineHeight;

      addSectionTitle("Project Overview");
      writePair("Application", data.placeFinal || "-");
      writePair("Floor Type", data.floorTypeFinal || "-");
      writePair("Area", `${area || 0} m^2`);
      writePair("Thickness", `${thickness || 0} mm`);
      writePair("Epoxy Finish", data.epoxyType || "-");
      writePair("Protective Coat", data.clearCoat || "No");

      addSectionTitle("Customer Details");
      writePair("Name", data.name || "-");
      writePair("Email", data.email || "-");
      writePair("Phone", data.phone || "-");
      writePair("ZIP / Pin", data.zip || "-");

      addSectionTitle("Material Breakdown");
      writePair("Total kit weight", `${result.totalKitWeight} kg`);
      writePair("Coverage area", `${result.coverage} m^2`);

      const kitRows = Object.entries(result.kit || {}).map(([section, values]) => [
        section,
        Number(values.Weight).toFixed(2)
      ]);

      if (kitRows.length) {
        autoTable(doc, {
          startY: cursorY,
          margin: { left: margin, right: margin },
          head: [["Section", "Total (kg)"]],
          body: kitRows,
          styles: { font: "helvetica", fontSize: 10, lineColor: [200, 200, 200], lineWidth: 0.1 },
          headStyles: { fillColor: [185, 28, 28], textColor: 255, halign: "center" },
          columnStyles: {
            0: { halign: "left" },
            1: { halign: "right" }
          }
        });
        cursorY = (doc.lastAutoTable?.finalY || cursorY) + sectionSpacing;
      } else {
        cursorY += lineHeight;
      }

      const packageRows = Object.entries(result.packages || {}).map(([name, pack]) => [
        name,
        Number(pack.packSizeKg).toFixed(2),
        Number(pack.perM2).toFixed(3),
        Number(pack.coveragePerPack).toFixed(2),
        String(pack.requiredPacks),
        Number(pack.requiredKg).toFixed(2),
        Number(pack.totalPackWeight).toFixed(2)
      ]);

      if (packageRows.length) {
        addSectionTitle("Package Consumption & Coverage");
        autoTable(doc, {
          startY: cursorY,
          margin: { left: margin, right: margin },
          head: [["Section", "Pack Size (kg)", "Consumption (kg/m^2)", "Coverage/Pack (m^2)", "Required Packs", "Req. Weight (kg)", "Total Pack (kg)"]],
          body: packageRows,
          styles: { font: "helvetica", fontSize: 10, lineColor: [200, 200, 200], lineWidth: 0.1 },
          headStyles: { fillColor: [185, 28, 28], textColor: 255, halign: "center" },
          columnStyles: {
            0: { halign: "left" },
            1: { halign: "right" },
            2: { halign: "right" },
            3: { halign: "right" },
            4: { halign: "right" },
            5: { halign: "right" },
            6: { halign: "right" }
          }
        });
        cursorY = (doc.lastAutoTable?.finalY || cursorY) + sectionSpacing;
      }

      addSectionTitle("Repair Consumption");
      if (result.repair) {
        writePair("Repair thickness", `${result.repair.thickness} mm`);
        writePair("Density", `${result.repair.density} kg/L`);
        writePair("Consumption", `${result.repair.consumption} kg/m^2`);
        writePair("Adjusted (incl. wastage)", `${result.repair.adjusted} kg/m^2`);
        writePair("Total adjusted weight", `${result.repair.adjustedTotal} kg`);
      } else {
        writePair("Status", "No repair layer selected");
      }

      addSectionTitle("Notes");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const noteText =
        "This report summarises material estimates, coverage, package sizes, and supplied contact information. Kindly allow for on-site adjustments for wastage, substrate condition, and environmental factors.";
      const wrappedNotes = doc.splitTextToSize(noteText, pageWidth - margin * 2);
      wrappedNotes.forEach(line => {
        ensureSpace(lineHeight);
        doc.text(line, margin, cursorY);
        cursorY += lineHeight;
      });

      doc.save(`Starshield_Epoxy_Report_${Date.now()}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF report", error);
      window.alert("We couldn't prepare the PDF report. Please try again or download after reloading the page.");
    }
  }, [area, data, result, thickness]);

  return (
    <div className="result-layout">
      <div className="result-header">
        <h2>Epoxy Kit Calculation</h2>
        <p className="muted-text">Calculation summary based on your selections.</p>
        <div className="result-actions">
          <button className="btn-secondary" type="button" onClick={handleDownloadReport}>
            Download PDF report
          </button>
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
                <th>Total (kg)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(result.kit).map(([section, values]) => (
                <tr key={section}>
                  <td>{section}</td>
                  <td>{values.Weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p id="kitNotes" className="muted-text">Values include resin and hardener split as per recommended ratios.</p>
      </section>

      <section className="table-card" aria-label="Package coverage breakdown">
        <h3>Packages, Consumption & Coverage</h3>
        <div className="table-scroll">
          <table className="result-table">
            <thead>
              <tr>
                <th>Section</th>
                <th>Pack Size (kg)</th>
                <th>Consumption (kg/m^2)</th>
                <th>Coverage/Pack (m^2)</th>
                <th>Required Packs</th>
                <th>Required Weight (kg)</th>
                <th>Total Pack Weight (kg)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(result.packages || {}).map(([name, pack]) => (
                <tr key={name}>
                  <td>{name}</td>
                  <td>{pack.packSizeKg}</td>
                  <td>{pack.perM2}</td>
                  <td>{pack.coveragePerPack}</td>
                  <td>{pack.requiredPacks}</td>
                  <td>{pack.requiredKg}</td>
                  <td>{pack.totalPackWeight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted-text">Coverage values use standard pack sizes taken from your reference sheet.</p>
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
                  <th>Consumption (kg/m^2)</th>
                  <th>Wastage (%)</th>
                  <th>Adjusted (kg/m^2)</th>
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
          <p className="muted-text">Totals calculated for the entered area of {result.coverage} m^2.</p>
        </section>
      )}

      <div className="result-footer">
        <div className="totals">
          <span>Total Kit Used</span>
          <strong>{result.totalKitWeight} kg</strong>
        </div>
        <div className="totals">
          <span>Coverage Area</span>
          <strong>{result.coverage} m^2</strong>
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

      <button className="btn-main" onClick={onBack}>Back</button>
    </div>
  );
}
