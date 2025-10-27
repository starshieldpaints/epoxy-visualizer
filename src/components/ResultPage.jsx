import React, { useCallback, useEffect, useMemo, useState } from "react";
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

function EmailStatus({ status }) {
  if (status === "sending") {
    return <p className="muted-text">Sending email report...</p>;
  }
  if (status === "sent") {
    return <p style={{ color: "green" }}>Email report sent successfully!</p>;
  }
  if (status === "error") {
    return <p style={{ color: "red" }}>Failed to send email report.</p>;
  }
  return null;
}

const generatePdfDoc = async (data, result, area, thickness) => {
  try {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 16;
    const lineHeight = 6;
    const sectionSpacing = 8;
    let cursorY = 30;

    const ensureSpace = (extra) => {
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

    const addSectionTitle = (title) => {
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
    doc.text("Starshield Epoxy Kit Report", pageWidth / 2, 14, {
      align: "center",
    });

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

    const kitRows = Object.entries(result.kit || {}).map(
      ([section, values]) => [section, Number(values.Weight).toFixed(2)]
    );

    if (kitRows.length) {
      autoTable(doc, {
        startY: cursorY,
        margin: { left: margin, right: margin },
        head: [["Section", "Total (kg)"]],
        body: kitRows,
        styles: {
          font: "helvetica",
          fontSize: 10,
          lineColor: [200, 200, 200],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: [185, 28, 28],
          textColor: 255,
          halign: "center",
        },
        columnStyles: {
          0: { halign: "left" },
          1: { halign: "right" },
        },
      });
      cursorY = (doc.lastAutoTable?.finalY || cursorY) + sectionSpacing;
    } else {
      cursorY += lineHeight;
    }

    const packageRows = Object.entries(result.packages || {}).map(
      ([name, pack]) => [
        name,
        Number(pack.packSizeKg).toFixed(2),
        Number(pack.perM2).toFixed(3),
        Number(pack.coveragePerPack).toFixed(2),
        String(pack.requiredPacks),
        Number(pack.requiredKg).toFixed(2),
        Number(pack.totalPackWeight).toFixed(2),
      ]
    );

    if (packageRows.length) {
      addSectionTitle("Package Consumption & Coverage");
      autoTable(doc, {
        startY: cursorY,
        margin: { left: margin, right: margin },
        head: [
          [
            "Section",
            "Pack Size (kg)",
            "Consumption (kg/m^2)",
            "Coverage/Pack (m^2)",
            "Required Packs",
            "Req. Weight (kg)",
            "Total Pack (kg)",
          ],
        ],
        body: packageRows,
        styles: {
          font: "helvetica",
          fontSize: 10,
          lineColor: [200, 200, 200],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: [185, 28, 28],
          textColor: 255,
          halign: "center",
        },
        columnStyles: {
          0: { halign: "left" },
          1: { halign: "right" },
          2: { halign: "right" },
          3: { halign: "right" },
          4: { halign: "right" },
          5: { halign: "right" },
          6: { halign: "right" },
        },
      });
      cursorY = (doc.lastAutoTable?.finalY || cursorY) + sectionSpacing;
    }

    addSectionTitle("Repair Consumption");
    if (result.repair) {
      writePair("Repair thickness", `${result.repair.thickness} mm`);
      writePair("Density", `${result.repair.density} kg/L`);
      writePair("Consumption", `${result.repair.consumption} kg/m^2`);
      writePair(
        "Adjusted (incl. wastage)",
        `${result.repair.adjusted} kg/m^2`
      );
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
    wrappedNotes.forEach((line) => {
      ensureSpace(lineHeight);
      doc.text(line, margin, cursorY);
      cursorY += lineHeight;
    });

    return doc;
  } catch (error) {
    console.error("Error in generatePdfDoc:", error);
    throw error;
  }
};

export default function ResultPage({ data, onBack }) {
  const [emailStatus, setEmailStatus] = useState("idle");

  const area = useMemo(() => Number(data.area) || 0, [data.area]);
  const thickness = useMemo(() => Number(data.thickness) || 0, [data.thickness]);
  const epoxyType = useMemo(
    () => data.epoxyType || data.epoxyDesignerType || data.epoxyMainType,
    [data.epoxyType, data.epoxyDesignerType, data.epoxyMainType]
  );

  const result = useMemo(
    () =>
      calculateEpoxyKit({
        area,
        epoxyType,
        floorThickness: thickness,
        needsRepair: data.needsRepair,
        repairThickness: data.repairThickness,
        protectiveCoat: data.clearCoat
      }),
    [area, epoxyType, thickness, data.needsRepair, data.repairThickness, data.clearCoat]
  );

  const packagePlan = useMemo(
    () => Object.entries(result?.packages || {}),
    [result]
  );
  const repairDetails = result?.repair || null;

  const summary = useMemo(
    () =>
      [
        { label: "Application", value: data.placeFinal },
        { label: "Floor Type", value: data.floorTypeFinal },
        { label: "Surface Uneven", value: data.surfaceUneven },
        { label: "Repairing Needed", value: data.needsRepair },
        {
          label: "Repair Thickness",
          value:
            data.needsRepair === "Yes" && data.repairOption
              ? `${data.repairOption.thickness} mm`
              : data.needsRepair === "Yes"
                ? "Not selected"
                : "Not required",
        },
        { label: "Application Type", value: data.firstTime },
        { label: "Epoxy Finish", value: data.epoxyType },
        { label: "Base Colour", value: data.baseColor },
        { label: "Top Colour", value: data.topColor || "Not required" },
        {
          label: "Flakes",
          value: data.flakes === "Yes" ? data.flakesType || "Preferred" : "No",
        },
        { label: "Protective Coat", value: data.clearCoat },
        {
          label: "Tools Added",
          value: data.tools && data.tools.length ? data.tools.join(", ") : "None",
        },
        { label: "Name", value: data.name },
        { label: "Email", value: data.email },
        { label: "Phone", value: data.phone },
        { label: "ZIP / Pin", value: data.zip },
      ].filter((item) => item.value && item.value !== ""),
    [data]
  );

  const handleDownloadReport = useCallback(async () => {
    try {
      const doc = await generatePdfDoc(data, result, area, thickness);
      doc.save(`Starshield_Epoxy_Report_${Date.now()}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF report", error);
      window.alert(
        "We couldn't prepare the PDF report. Please try again or download after reloading the page."
      );
    }
  }, [area, data, result, thickness]);

  useEffect(() => {

    if (!data.email) {
      console.warn("No email address provided, skipping email.");
      setEmailStatus("error");
      return;
    }

    const sendReportEmail = async () => {
      setEmailStatus("sending");
      try {

        const doc = await generatePdfDoc(data, result, area, thickness);

        const pdfBase64 = doc.output('datauristring');

        const response = await fetch("http://localhost:4000/send-pdf-report", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: data.email,
            name: data.name || "Customer",
            summary: summary,
            pdfBase64: pdfBase64,
          }),
        });

        if (!response.ok) {
          const resText = await response.text();
          throw new Error(`API request failed: ${resText}`);
        }

        setEmailStatus("sent");
      } catch (error) {
        console.error("Failed to send email:", error);
        setEmailStatus("error");
      }
    };

    sendReportEmail();

  }, [area, data, result, summary, thickness]);

  return (
    <div className="result-layout">
      <div className="result-header">
        <h2>Epoxy Kit Calculation</h2>
        <p className="muted-text">Calculation summary based on your selections.</p>
        <EmailStatus status={emailStatus} />
        <div className="result-actions">
          <button
            className="btn-secondary"
            type="button"
            onClick={handleDownloadReport}
          >
            Download PDF report
          </button>
        </div>
      </div>

      <section className="summary-card" aria-label="Project summary">
        <h3>Project Snapshot</h3>
        <dl className="summary-grid">
          {summary.map((item) => (
            <div key={item.label} className="summary-item">
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {packagePlan.length > 0 && (
        <section className="summary-card" aria-label="Package plan">
          <h3>Pack Plan</h3>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.95rem"
              }}
            >
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #e5e7eb" }}>Package</th>
                  <th style={{ textAlign: "right", padding: "0.5rem", borderBottom: "1px solid #e5e7eb" }}>Pack Size (kg)</th>
                  <th style={{ textAlign: "right", padding: "0.5rem", borderBottom: "1px solid #e5e7eb" }}>Coverage / Pack (m^2)</th>
                  <th style={{ textAlign: "right", padding: "0.5rem", borderBottom: "1px solid #e5e7eb" }}>Required Packs</th>
                  <th style={{ textAlign: "right", padding: "0.5rem", borderBottom: "1px solid #e5e7eb" }}>Total Pack Weight (kg)</th>
                </tr>
              </thead>
              <tbody>
                {packagePlan.map(([section, values]) => (
                  <tr key={section}>
                    <th scope="row" style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #f1f5f9" }}>
                      {section}
                    </th>
                    <td style={{ textAlign: "right", padding: "0.5rem", borderBottom: "1px solid #f1f5f9" }}>{Number(values.packSizeKg).toFixed(2)}</td>
                    <td style={{ textAlign: "right", padding: "0.5rem", borderBottom: "1px solid #f1f5f9" }}>{Number(values.coveragePerPack).toFixed(2)}</td>
                    <td style={{ textAlign: "right", padding: "0.5rem", borderBottom: "1px solid #f1f5f9" }}>{values.requiredPacks}</td>
                    <td style={{ textAlign: "right", padding: "0.5rem", borderBottom: "1px solid #f1f5f9" }}>{Number(values.totalPackWeight).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {repairDetails && (
        <section className="summary-card" aria-label="Repair layer details">
          <h3>Repair Layer</h3>
          <dl className="summary-grid">
            <div className="summary-item">
              <dt>Thickness</dt>
              <dd>{repairDetails.thickness} mm</dd>
            </div>
            <div className="summary-item">
              <dt>Density</dt>
              <dd>{repairDetails.density} kg/L</dd>
            </div>
            <div className="summary-item">
              <dt>Consumption</dt>
              <dd>{repairDetails.consumption} kg/m^2</dd>
            </div>
            <div className="summary-item">
              <dt>Adjusted Total</dt>
              <dd>{repairDetails.adjustedTotal} kg</dd>
            </div>
          </dl>
        </section>
      )}

      <button className="btn-main" onClick={onBack}>
        Back
      </button>
    </div>
  );
}


