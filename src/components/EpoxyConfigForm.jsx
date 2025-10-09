import React, { useState } from "react";
const places = ["House", "Factory", "Showroom", "Hospital", "School", "Warehouse", "Garage", "Office", "Others"];
const floorTypes = ['Cemented', 'Tiled', 'Marble', 'Granite', 'Wooden', 'Precast', 'Other'];
const designerOptions = ["3D", "Metallic", "Texture", "Marble Clear", "Resin Art"];
const baseColors = ['White', 'Grey', 'Black', 'Blue', 'Green', 'Red', 'Brown'];
const topColors = ['Grey', 'Pearl', 'Yellow', 'Light Blue', 'Gold', 'Silver'];
const flakeOptions = ['Silver', 'Copper', 'Gold', 'Rust', 'Bronze'];
const toolOptions = ['Epoxy Roller', 'Fire Lighter', 'Spike Shoes', 'Scraper', 'Spatula'];

export default function EpoxyConfigForm({ onNext }) {
  const [form, setForm] = useState({
    place: '', placeOther: '', floorType: '', floorTypeOther: '',
    area: '', thickness: '',
    epoxyMainType: '', epoxyDesignerType: '',
    baseColor: '', topColor: '', flakes: 'No', flakesType: '',
    clearCoat: 'No', tools: []
  });

  const handleChip = (key, value) => setForm(f => ({ ...f, [key]: value }));
  const handleInput = (key, value) => setForm(f => ({ ...f, [key]: value }));
  const toggleTool = t => setForm(f => ({
    ...f,
    tools: f.tools.includes(t) ? f.tools.filter(x => x !== t) : [...f.tools, t]
  }));

  const epoxyType = form.epoxyMainType === "Plain"
    ? "Plain"
    : (form.epoxyDesignerType || "");

  const canProceed =
    form.place &&
    (form.place !== "Others" || !!form.placeOther) &&
    form.floorType &&
    (form.floorType !== "Other" || !!form.floorTypeOther) &&
    form.area && form.thickness &&
    epoxyType &&
    form.baseColor && form.topColor &&
    (form.flakes === "No" || form.flakesType);

  return (
    <form onSubmit={e => {
      e.preventDefault();
      if (canProceed) onNext({
        ...form,
        epoxyType,
        placeFinal: form.place === "Others" ? form.placeOther : form.place,
        floorTypeFinal: form.floorType === "Other" ? form.floorTypeOther : form.floorType
      });
    }}>
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
      {/* Area */}
      <div className="form-section">
        <label className="form-label">Area <span style={{ fontStyle: "italic" }}>(sq m)</span></label>
        <input
          className="form-input"
          type="number" min={1} required
          placeholder="Enter area in sq m"
          value={form.area}
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
          onChange={e => handleInput('thickness', e.target.value)}
        />
      </div>
      {/* Epoxy type with conditional designer suboptions */}
      <div className="form-section">
        <label className="form-label">Type of Epoxy</label>
        <div className="chips-group">
          <span
            className={`chip${form.epoxyMainType === "Plain" ? " selected" : ""}`}
            onClick={() => setForm(f => ({ ...f, epoxyMainType: "Plain", epoxyDesignerType: "" }))}
            tabIndex={0}>Plain</span>
          <span
            className={`chip${form.epoxyMainType === "Designer" ? " selected" : ""}`}
            onClick={() => setForm(f => ({ ...f, epoxyMainType: "Designer", epoxyDesignerType: "" }))}
            tabIndex={0}>Designer</span>
        </div>
        {form.epoxyMainType === "Designer" &&
          <div className="chips-group" style={{ marginTop: "0.65em" }}>
            {designerOptions.map(opt =>
              <span
                className={`chip${form.epoxyDesignerType === opt ? " selected" : ""}`}
                key={opt}
                onClick={() => handleChip('epoxyDesignerType', opt)}
                tabIndex={0}>{opt}</span>
            )}
          </div>
        }
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
        <div className="chips-group">
          {topColors.map(c =>
            <span className={`chip${form.topColor === c ? " selected" : ""}`} key={c}
              onClick={() => handleChip('topColor', c)} tabIndex={0}>
              <span className={`color-swatch${form.topColor === c ? " selected" : ""}`}
                style={{ background: c.toLowerCase(), borderColor: '#aaa' }}></span>{c}
            </span>
          )}
        </div>
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
