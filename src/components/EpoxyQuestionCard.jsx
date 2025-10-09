// import React, { useEffect, useState } from "react";

// export default function EpoxyQuestionCard({ question, formData, onChange, onNext, onBack }) {
//   const [inputValue, setInputValue] = useState(formData[question.id] || "");

//   useEffect(() => {
//     setInputValue(formData[question.id] || "");
//   }, [formData, question.id]);

//   // Check if question should be shown based on conditions
//   const isVisible = () => {
//     if (!question.conditions) return true;
//     return Object.entries(question.conditions).every(([k, v]) => formData[k] === v);
//   };

//   if (!isVisible()) return null;

//   // Check if current question has valid input
//   const canProceed = (() => {
//     if (question.type === "input") return inputValue !== "";
//     if (question.type === "chips") return !!formData[question.id];
//     if (question.type === "multi-chips") return (Array.isArray(formData[question.id]) && formData[question.id].length > 0);
//     return true;
//   })();

//   const selectOption = (opt) => {
//     if (question.type === "multi-chips") {
//       let arr = formData[question.id] || [];
//       if (arr.includes(opt)) {
//         arr = arr.filter(x => x !== opt);
//       } else {
//         arr.push(opt);
//       }
//       onChange(question.id, arr);
//     } else {
//       onChange(question.id, opt);
//     }
//   };

//   return (
// <div className="card" role="region" aria-labelledby={`label-${question.id}`}
//   style={{
//     boxShadow: "0 8px 32px #b91c1c22, 0 1px 0 #eee",
//     border: "2px solid #eee",
//     background: "#fff",
//     animation: "fadeInUp 0.7s cubic-bezier(.86,0,.07,1)",
//     minHeight: "260px"
//   }}>
//           <label id={`label-${question.id}`} className="label">{question.question}</label>

//       {question.type === "chips" && (
//         <div className="chips-group" role="list" aria-label={question.question}>
//           {question.options.map(opt => (
//             <div
//               role="listitem"
//               tabIndex={0}
//               key={opt}
//               className={`chip ${formData[question.id] === opt ? "selected" : ""}`}
//               onClick={() => selectOption(opt)}
//               onKeyDown={e => e.key === "Enter" && selectOption(opt)}
//               aria-pressed={formData[question.id] === opt}
//             >
//               {question.isColor && <span className="color-swatch" style={{ backgroundColor: opt.toLowerCase() }} />}
//               {opt}
//             </div>
//           ))}
//         </div>
//       )}

//       {question.type === "multi-chips" && (
//         <div className="chips-group" role="list" aria-label={question.question}>
//           {question.options.map(opt => (
//             <div
//               role="listitem"
//               tabIndex={0}
//               key={opt}
//               className={`chip ${(formData[question.id] || []).includes(opt) ? "selected" : ""}`}
//               onClick={() => selectOption(opt)}
//               onKeyDown={e => e.key === "Enter" && selectOption(opt)}
//               aria-pressed={(formData[question.id] || []).includes(opt)}
//             >
//               {opt}
//             </div>
//           ))}
//         </div>
//       )}

//       {question.type === "input" && (
//         <input
//           className="form-input"
//           type={question.inputType || "text"}
//           placeholder={question.inputPlaceholder || ""}
//           value={inputValue}
//           min={question.min}
//           step={question.step}
//           required
//           onChange={e => {
//             setInputValue(e.target.value);
//             onChange(question.id, e.target.value);
//           }}
//           aria-label={question.question}
//         />
//       )}

//       <div className="buttons">
//         {onBack && (
//           <button type="button" className="btn" onClick={onBack}>Back</button>
//         )}
//         <button
//           type="button"
//           className="btn"
//           disabled={!canProceed}
//           aria-disabled={!canProceed}
//           onClick={onNext}
//         >Next</button>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function EpoxyQuestionCard({
  question,
  formData,
  onChange,
  onNext,
  onBack,
}) {
  const [inputValue, setInputValue] = useState(formData[question.id]);
  useEffect(() => {
    setInputValue(formData[question.id]);
  }, [formData, question.id]);

  const isVisible = !question.conditions
    ? true
    : Object.entries(question.conditions).every(
        ([k, v]) => formData[k] === v
      );
  if (!isVisible) return null;

  const canProceed =
    question.type === "input"
      ? inputValue && inputValue !== ""
      : question.type === "chips"
      ? !!formData[question.id]
      : question.type === "multi-chips"
      ? Array.isArray(formData[question.id]) &&
        formData[question.id].length > 0
      : true;

  const selectOption = (opt) => {
    if (question.type === "multi-chips") {
      let arr = formData[question.id] || [];
      if (arr.includes(opt)) arr = arr.filter((x) => x !== opt);
      else arr.push(opt);
      onChange(question.id, arr);
    } else {
      onChange(question.id, opt);
    }
  };

  return (
    <motion.div
      className="card"
      role="region"
      aria-labelledby={`label-${question.id}`}
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -32 }}
      transition={{ duration: 0.55, type: "spring", bounce: 0.32 }}
      tabIndex={0}
    >
      <div className="label" id={`label-${question.id}`}>
        {question.label}
      </div>
      <div>
        {question.type === "input" && (
          <input
            value={inputValue || ""}
            onChange={(e) => {
              setInputValue(e.target.value);
              onChange(question.id, e.target.value);
            }}
            style={{
              width: "100%",
              padding: "0.8em",
              fontSize: "1.1em",
              borderRadius: "8px",
              marginTop: "0.9em",
              border: "1.5px solid #ccc",
            }}
          />
        )}
        {(question.type === "chips" || question.type === "multi-chips") && (
          <div className="chips-group">
            {question.options.map((opt) => (
              <button
                key={opt}
                className={
                  "chip" +
                  ((question.type === "chips" &&
                    formData[question.id] === opt) ||
                  (question.type === "multi-chips" &&
                    (formData[question.id] || []).includes(opt))
                    ? " selected"
                    : "")
                }
                style={{ outline: "none", border: "none" }}
                type="button"
                onClick={() => selectOption(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: "1.2em", marginTop: "2em" }}>
        {onBack && (
          <button className="btn" type="button" onClick={onBack}>
            Back
          </button>
        )}
        {onNext && (
          <button
            className="btn"
            type="button"
            style={{
              background: canProceed ? "#b91c1c" : "#cacaca",
              color: "#fff",
              borderRadius: "24px",
              padding: "0.7em 1.7em",
              fontWeight: 700,
              fontSize: "1.1em",
              letterSpacing: "1px",
              cursor: canProceed ? "pointer" : "not-allowed",
              boxShadow:
                canProceed && "0 4px 18px #b91c1c44, 0 1px 0 #fff",
              border: "none",
              transition: "background 0.2s, box-shadow 0.3s",
            }}
            disabled={!canProceed}
            onClick={onNext}
          >
            Next
          </button>
        )}
      </div>
    </motion.div>
  );
}
