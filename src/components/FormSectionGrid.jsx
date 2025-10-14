import React from "react";

export default function FormSectionGrid({ children, columns = 2, className = "" }) {
  const gridClass = columns === 2 ? "two-up" : columns === 3 ? "three-up" : "";
  return (
    <div className={`form-section-grid${gridClass ? ` ${gridClass}` : ""}${className ? ` ${className}` : ""}`}>
      {children}
    </div>
  );
}
