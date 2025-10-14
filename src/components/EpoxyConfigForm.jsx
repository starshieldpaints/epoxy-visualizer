import React, { useEffect, useMemo, useState } from "react";

const places = [
  "Home",
  "Office",
  "Factory",
  "Showroom",
  "Hospital",
  "School",
  "Warehouse",
  "Garage",
  "Parking",
  "Others"
];

const floorTypes = [
  "Cemented",
  "Tiled",
  "Marble",
  "Granite",
  "Wooden",
  "Kota Stone",
  "Precast",
  "Other"
];

const epoxyFinishes = [
  "Plain",
  "Multicolor",
  "Texture",
  "Metallic",
  "3D",
  "Pearl",
  "Clear"
];

const baseColors = [
  "White",
  "Grey",
  "Black",
  "Blue",
  "Green",
  "Red",
  "Yellow",
  "Brown"
];

const defaultTopColors = [
  "Grey",
  "Pearl",
  "Yellow",
  "Light Blue",
  "Gold",
  "Silver"
];

const multicolorTopColors = ["Silver", "Golden", "Bronze", "Copper"];
const metallicColors = ["Silver", "Golden", "Bronze", "Copper"];

const flakeOptions = ["Silver", "Copper", "Gold", "Rust", "Bronze"];
const toolOptions = ["Epoxy Roller", "Fire Lighter", "Spike Shoes", "Scraper", "Spatula"];

const repairOptions = [
  { thickness: 0.5, density: 1.25, consumption: 0.625, wastage: 10, adjusted: 0.6875 },
  { thickness: 1, density: 1.25, consumption: 1.25, wastage: 10, adjusted: 1.375 },
  { thickness: 2, density: 1.25, consumption: 2.5, wastage: 10, adjusted: 2.75 },
  { thickness: 3, density: 1.25, consumption: 3.75, wastage: 10, adjusted: 4.125 },
  { thickness: 5, density: 1.25, consumption: 6.25, wastage: 10, adjusted: 6.875 }
];

const yesNoOptions = ["Yes", "No"];
const firstTimeOptions = ["First Time", "Reapplication"];
const quickThicknessOptions = [1, 2, 3, 4];

export default function EpoxyConfigForm({ onNext }) {
  const [form, setForm] = useState({
    place: "",
    placeOther: "",
    floorType: "",
    floorTypeOther: "",
    surfaceUneven: "",
    needsRepair: "",
    firstTime: "",
    area: "",
    thickness: "",
    repairThickness: "",
    epoxyFinish: "",
    baseColor: "",
    topColor: "",
    flakes: "No",
    flakesType: "",
    pearlColor: "",
    clearCoat: "No",
    tools: []
  });

  const handleChip = (key, value) => setForm(f => ({ ...f, [key]: value }));
  const handleInput = (key, value) => setForm(f => ({ ...f, [key]: value }));
  const toggleTool = t => setForm(f => ({
    ...f,
    tools: f.tools.includes(t) ? f.tools.filter(x => x !== t) : [...f.tools, t]
  }));

  const repairSelection = useMemo(
    () => repairOptions.find(opt => String(opt.thickness) === String(form.repairThickness)),
    [form.repairThickness]
  );

  const epoxyType = form.epoxyFinish || "";

  const availableTopColors = useMemo(() => {
    if (form.epoxyFinish === "Multicolor") return multicolorTopColors;
    if (form.epoxyFinish === "Metallic") return metallicColors;
    if (form.epoxyFinish === "Clear") return [];
    return defaultTopColors;
  }, [form.epoxyFinish]);

  useEffect(() => {
    if (form.epoxyFinish !== "Pearl" && form.pearlColor) {
      setForm(prev => ({ ...prev, pearlColor: "" }));
    }
  }, [form.epoxyFinish, form.pearlColor]);

  useEffect(() => {
    if (form.needsRepair !== "Yes" && form.repairThickness) {
      setForm(prev => ({ ...prev, repairThickness: "" }));
    }
  }, [form.needsRepair, form.repairThickness]);

  useEffect(() => {
    setForm(prev => {
      if (!availableTopColors.length) {
        return prev.topColor ? { ...prev, topColor: "" } : prev;
      }
      if (prev.topColor && !availableTopColors.includes(prev.topColor)) {
        return { ...prev, topColor: "" };
      }
      return prev;
    });
  }, [availableTopColors]);

  const canProceed =
    form.place &&
    (form.place !== "Others" || !!form.placeOther) &&
    form.floorType &&
    (form.floorType !== "Other" || !!form.floorTypeOther) &&
    form.surfaceUneven &&
    form.needsRepair &&
    form.firstTime &&
    (form.needsRepair !== "Yes" || !!form.repairThickness) &&
    form.area && form.thickness &&
    epoxyType &&
    form.baseColor &&
    (availableTopColors.length === 0 || form.topColor) &&
    (form.flakes === "No" || form.flakesType);

  return (
    <form
      className="form-card"
      onSubmit={e => {
      e.preventDefault();
      if (canProceed) onNext({
        ...form,
        epoxyType,
        placeFinal: form.place === "Others" ? form.placeOther : form.place,
        floorTypeFinal: form.floorType === "Other" ? form.floorTypeOther : form.floorType,
        repairOption: repairSelection || null
      });
    }}
    >
      {/* Where to apply */}
      <div className="form-section">
        <label className="form-label">Where to apply?</label>
        <div className="chips-group">
          {places.map(opt => (
            <span
              className={`chip${form.place === opt ? " selected" : ""}`}
              key={opt}
              onClick={() => handleChip('place', opt)}
              tabIndex={0}
            >{opt}</span>
          ))}
        </div>
        {form.place === "Others" &&
          <input
            className="form-input"
            value={form.placeOther}
            onChange={e => handleInput('placeOther', e.target.value)}
            placeholder="Specify other location"
          />
        }
      </div>
      {/* Surface uneven */}
      <div className="form-section">
        <label className="form-label">Is the surface uneven?</label>
        <div className="chips-group">
          {yesNoOptions.map(opt => (
            <span
              className={`chip${form.surfaceUneven === opt ? " selected" : ""}`}
              key={opt}
              onClick={() => handleChip("surfaceUneven", opt)}
              tabIndex={0}
            >{opt}</span>
          ))}
        </div>
      </div>
      {/* Repair requirement */}
      <div className="form-section">
        <label className="form-label">Do you need any repairing?</label>
        <div className="chips-group">
          {yesNoOptions.map(opt => (
            <span
              className={`chip${form.needsRepair === opt ? " selected" : ""}`}
              key={opt}
              onClick={() => handleChip("needsRepair", opt)}
              tabIndex={0}
            >{opt}</span>
          ))}
        </div>
        {form.needsRepair === "Yes" && (
          <div className="repair-panel">
            <div className="repair-header">Select repair layer thickness</div>
            <div className="chips-group">
              {repairOptions.map(opt => (
                <span
                  key={opt.thickness}
                  className={`chip${String(form.repairThickness) === String(opt.thickness) ? " selected" : ""}`}
                  onClick={() => handleChip("repairThickness", opt.thickness)}
                  tabIndex={0}
                >{opt.thickness} mm</span>
              ))}
            </div>
            {repairSelection && (
              <div className="repair-details" role="note">
                <div>Density: <strong>{repairSelection.density}</strong> kg/L</div>
                <div>Adjusted consumption: <strong>{repairSelection.adjusted}</strong> kg/m² (incl. {repairSelection.wastage}% wastage)</div>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Floor type */}
      <div className="form-section">
        <label className="form-label">Type of Floor</label>
        <div className="chips-group">
          {floorTypes.map(f =>
            <span className={`chip${form.floorType === f ? " selected" : ""}`} key={f}
              onClick={() => handleChip('floorType', f)} tabIndex={0}>{f}</span>
          )}
        </div>
        {form.floorType === "Other" &&
          <input
            className="form-input"
            value={form.floorTypeOther}
            onChange={e => handleInput('floorTypeOther', e.target.value)}
            placeholder="Specify other floor type"
          />
        }
      </div>
      {/* First time or reapplication */}
      <div className="form-section">
        <label className="form-label">Is this the first time or reapplication?</label>
        <div className="chips-group">
          {firstTimeOptions.map(opt => (
            <span
              className={`chip${form.firstTime === opt ? " selected" : ""}`}
              key={opt}
              onClick={() => handleChip("firstTime", opt)}
              tabIndex={0}
            >{opt}</span>
          ))}
        </div>
      </div>
      {/* Area */}
      <div className="form-section">
        <label className="form-label">Area <span style={{ fontStyle: "italic" }}>(sq m)</span></label>
        <input
          className="form-input"
          type="number" min={1} required
          placeholder="Enter area in sq m"
          value={form.area}
          inputMode="decimal"
          onChange={e => handleInput('area', e.target.value)}
        />
      </div>
      {/* Thickness */}
      <div className="form-section">
        <label className="form-label">Thickness (mm)</label>
        <input
          className="form-input"
          type="number" min={0.1} step={0.1} required
          placeholder="Enter thickness in mm"
          value={form.thickness}
          inputMode="decimal"
          onChange={e => handleInput('thickness', e.target.value)}
        />
        <div className="chips-group compact" aria-label="Quick thickness selection">
          {quickThicknessOptions.map(opt => (
            <span
              key={opt}
              className={`chip${Number(form.thickness) === Number(opt) ? " selected" : ""}`}
              onClick={() => handleChip("thickness", opt)}
              tabIndex={0}
            >{opt} mm</span>
          ))}
        </div>
      </div>
      {/* Epoxy finish */}
      <div className="form-section">
        <label className="form-label">Type of Epoxy Finish</label>
        <div className="chips-group">
          {epoxyFinishes.map(opt => (
            <span
              className={`chip${form.epoxyFinish === opt ? " selected" : ""}`}
              key={opt}
              onClick={() => handleChip("epoxyFinish", opt)}
              tabIndex={0}
            >{opt}</span>
          ))}
        </div>
        {form.epoxyFinish === "Pearl" && (
          <input
            className="form-input"
            placeholder="Enter preferred pearl colour"
            value={form.pearlColor}
            onChange={e => handleInput("pearlColor", e.target.value)}
          />
        )}
      </div>
      {/* Colors and flakes */}
      <div className="form-section">
        <label className="form-label">Base Colour</label>
        <div className="chips-group">
          {baseColors.map(c =>
            <span className={`chip${form.baseColor === c ? " selected" : ""}`} key={c}
              onClick={() => handleChip('baseColor', c)} tabIndex={0}>
              <span className={`color-swatch${form.baseColor === c ? " selected" : ""}`}
                style={{ background: c.toLowerCase(), borderColor: '#aaa' }}></span>{c}
            </span>
          )}
        </div>
      </div>
      <div className="form-section">
        <label className="form-label">Top Colour</label>
        {availableTopColors.length > 0 ? (
          <div className="chips-group">
            {availableTopColors.map(c => (
              <span className={`chip${form.topColor === c ? " selected" : ""}`} key={c}
                onClick={() => handleChip('topColor', c)} tabIndex={0}>
                <span className={`color-swatch${form.topColor === c ? " selected" : ""}`}
                  style={{ background: c.toLowerCase(), borderColor: '#aaa' }}></span>{c}
              </span>
            ))}
          </div>
        ) : (
          <p className="muted-text">Top coat not required for the selected finish.</p>
        )}
      </div>
      <div className="form-section">
        <label className="form-label">Want Metallic flakes / Crystal?</label>
        <div className="chips-group">
          {["Yes", "No"].map(v =>
            <span key={v} className={`chip${form.flakes === v ? " selected" : ""}`} tabIndex={0}
              onClick={() => handleChip('flakes', v)}>{v}</span>
          )}
        </div>
        {form.flakes === "Yes" && (
          <div className="chips-group" style={{ marginTop: "0.8em" }}>
            {flakeOptions.map(f =>
              <span className={`chip${form.flakesType === f ? " selected" : ""}`} key={f}
                onClick={() => handleChip('flakesType', f)} tabIndex={0}>{f}
              </span>
            )}
          </div>
        )}
      </div>
      <div className="form-section">
        <label className="form-label">Want a Protective Coating?</label>
        <div className="chips-group">
          {["Yes", "No"].map(v =>
            <span key={v} className={`chip${form.clearCoat === v ? " selected" : ""}`} tabIndex={0}
              onClick={() => handleChip('clearCoat', v)}>{v}</span>
          )}
        </div>
      </div>
      <div className="form-section">
        <label className="form-label">Tools Add (multi-select):</label>
        <div className="chips-group">
          {toolOptions.map(t =>
            <span className={`chip${form.tools.includes(t) ? " selected" : ""}`} key={t}
              onClick={() => toggleTool(t)} tabIndex={0}>{t}</span>
          )}
        </div>
      </div>
      <button className="btn-main" disabled={!canProceed}>Next</button>
    </form>
  );
}
