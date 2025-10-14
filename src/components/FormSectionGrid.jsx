import React from "react";

function renderSection(section, index) {
  if (!section) return null;

  const { key, className = "", content } = section;
  const sectionKey = key ?? index;
  const sectionClassName = `form-section${className ? ` ${className}` : ""}`;
  const body = typeof content === "function" ? content(section, index) : content;

  return (
    <section key={sectionKey} className={sectionClassName}>
      {body}
    </section>
  );
}

export default function FormSectionGrid({ children, sections = [], columns = 2, className = "" }) {
  const gridClass = columns === 2 ? "two-up" : columns === 3 ? "three-up" : "";
  const composedChildren = sections.length ? sections.map(renderSection) : children;

  return (
    <div className={`form-section-grid${gridClass ? ` ${gridClass}` : ""}${className ? ` ${className}` : ""}`}>
      {composedChildren}
    </div>
  );
}
