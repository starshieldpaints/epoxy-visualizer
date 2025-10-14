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

const Chip = ({ active, children, className = "", onClick, ...props }) => (
  <button
    type="button"
    className={`chip${active ? " selected" : ""}${className ? ` ${className}` : ""}`}
    onClick={onClick}
    aria-pressed={active}
    {...props}
  >
    {children}
  </button>
);

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
      className="form-card config-card"
      onSubmit={e => {
        e.preventDefault();
        if (canProceed) {
          onNext({
            ...form,
            epoxyType,
            placeFinal: form.place === "Others" ? form.placeOther : form.place,
            floorTypeFinal: form.floorType === "Other" ? form.floorTypeOther : form.floorType,
            repairOption: repairSelection || null
          });
        }
      }}
    >
      <div className="card-intro">
        <h2>Project setup</h2>
        <p className="muted-text">
          Tell us about the surface you are coating so Starshield can tailor the consumption and tooling advice.
        </p>
        <div className="card-badges">
          <span className="badge">Mobile ready</span>
          <span className="badge soft">Repair calculator built-in</span>
        </div>
      </div>

      <div className="form-section-grid two-up">
        <section className="form-section">
          <label className="form-label">Where to apply?</label>
          <div className="chips-group" role="group" aria-label="Application area">
            {places.map(opt => (
              <Chip key={opt} active={form.place === opt} onClick={() => handleChip("place", opt)}>
                {opt}
              </Chip>
            ))}
          </div>
          {form.place === "Others" && (
            <input
              className="form-input"
              value={form.placeOther}
              onChange={e => handleInput("placeOther", e.target.value)}
              placeholder="Specify other location"
            />
          )}
        </section>

        <section className="form-section">
          <label className="form-label">Is the surface uneven?</label>
          <div className="chips-group" role="group" aria-label="Surface uneven">
            {yesNoOptions.map(opt => (
              <Chip key={opt} active={form.surfaceUneven === opt} onClick={() => handleChip("surfaceUneven", opt)}>
                {opt}
              </Chip>
            ))}
          </div>
        </section>
      </div>

      <div className="form-section-grid two-up">
        <section className="form-section">
          <label className="form-label">Type of Floor</label>
          <div className="chips-group" role="group" aria-label="Floor type">
            {floorTypes.map(f => (
              <Chip key={f} active={form.floorType === f} onClick={() => handleChip("floorType", f)}>
                {f}
              </Chip>
            ))}
          </div>
          {form.floorType === "Other" && (
            <input
              className="form-input"
              value={form.floorTypeOther}
              onChange={e => handleInput("floorTypeOther", e.target.value)}
              placeholder="Specify other floor type"
            />
          )}
        </section>

        <section className="form-section">
          <label className="form-label">Is this the first time or reapplication?</label>
          <div className="chips-group" role="group" aria-label="Application history">
            {firstTimeOptions.map(opt => (
              <Chip key={opt} active={form.firstTime === opt} onClick={() => handleChip("firstTime", opt)}>
                {opt}
              </Chip>
            ))}
          </div>
        </section>
      </div>

      <section className="form-section">
        <label className="form-label">Do you need any repairing?</label>
        <div className="chips-group" role="group" aria-label="Repair required">
          {yesNoOptions.map(opt => (
            <Chip key={opt} active={form.needsRepair === opt} onClick={() => handleChip("needsRepair", opt)}>
              {opt}
            </Chip>
          ))}
        </div>
        {form.needsRepair === "Yes" && (
          <div className="repair-panel">
            <div className="repair-header">Select repair layer thickness</div>
            <div className="chips-group compact" role="group" aria-label="Repair thickness">
              {repairOptions.map(opt => (
                <Chip
                  key={opt.thickness}
                  active={String(form.repairThickness) === String(opt.thickness)}
                  onClick={() => handleChip("repairThickness", opt.thickness)}
                >
                  {opt.thickness} mm
                </Chip>
              ))}
            </div>
            {repairSelection && (
              <dl className="repair-details" role="status" aria-live="polite">
                <dt>Density</dt>
                <dd>
                  <strong>{repairSelection.density}</strong> kg/L
                </dd>
                <dt>Adjusted consumption</dt>
                <dd>
                  <strong>{repairSelection.adjusted}</strong> kg/m² (incl. {repairSelection.wastage}% wastage)
                </dd>
              </dl>
            )}
          </div>
        )}
      </section>

      <div className="form-section-grid two-up">
        <section className="form-section">
          <label className="form-label">
            Area <span className="label-hint">(sq m)</span>
          </label>
          <input
            className="form-input"
            type="number"
            min={1}
            required
            placeholder="Total coated area"
            value={form.area}
            inputMode="decimal"
            onChange={e => handleInput("area", e.target.value)}
          />
          <p className="field-hint">Enter the full project coverage in square meters.</p>
        </section>
        <section className="form-section">
          <label className="form-label">Thickness (mm)</label>
          <input
            className="form-input"
            type="number"
            min={0.1}
            step={0.1}
            required
            placeholder="Average build thickness"
            value={form.thickness}
            inputMode="decimal"
            onChange={e => handleInput("thickness", e.target.value)}
          />
          <div className="chips-group compact" role="group" aria-label="Quick thickness selection">
            {quickThicknessOptions.map(opt => (
              <Chip key={opt} active={Number(form.thickness) === Number(opt)} onClick={() => handleChip("thickness", opt)}>
                {opt} mm
              </Chip>
            ))}
          </div>
        </section>
      </div>

      <section className="form-section">
        <label className="form-label">Type of Epoxy Finish</label>
        <div className="chips-group" role="group" aria-label="Epoxy finish">
          {epoxyFinishes.map(opt => (
            <Chip key={opt} active={form.epoxyFinish === opt} onClick={() => handleChip("epoxyFinish", opt)}>
              {opt}
            </Chip>
          ))}
        </div>
        {form.epoxyFinish === "Pearl" && (
          <input
            className="form-input"
            placeholder="Preferred pearl colour"
            value={form.pearlColor}
            onChange={e => handleInput("pearlColor", e.target.value)}
          />
        )}
      </section>

      <div className="form-section-grid two-up">
        <section className="form-section">
          <label className="form-label">Base Colour</label>
          <div className="chips-group" role="group" aria-label="Base colour">
            {baseColors.map(c => (
              <Chip key={c} active={form.baseColor === c} onClick={() => handleChip("baseColor", c)}>
                <span
                  className={`color-swatch${form.baseColor === c ? " selected" : ""}`}
                  style={{ background: c.toLowerCase(), borderColor: "#aaa" }}
                ></span>
                {c}
              </Chip>
            ))}
          </div>
        </section>

        <section className="form-section">
          <label className="form-label">Top Colour</label>
          {availableTopColors.length > 0 ? (
            <div className="chips-group" role="group" aria-label="Top colour">
              {availableTopColors.map(c => (
                <Chip key={c} active={form.topColor === c} onClick={() => handleChip("topColor", c)}>
                  <span
                    className={`color-swatch${form.topColor === c ? " selected" : ""}`}
                    style={{ background: c.toLowerCase(), borderColor: "#aaa" }}
                  ></span>
                  {c}
                </Chip>
              ))}
            </div>
          ) : (
            <p className="muted-text">Top coat not required for the selected finish.</p>
          )}
        </section>
      </div>

      <section className="form-section">
        <label className="form-label">Want Metallic flakes / Crystal?</label>
        <div className="chips-group" role="group" aria-label="Flake preference">
          {yesNoOptions.map(v => (
            <Chip key={v} active={form.flakes === v} onClick={() => handleChip("flakes", v)}>
              {v}
            </Chip>
          ))}
        </div>
        {form.flakes === "Yes" && (
          <div className="chips-group" role="group" aria-label="Flake selection">
            {flakeOptions.map(f => (
              <Chip key={f} active={form.flakesType === f} onClick={() => handleChip("flakesType", f)}>
                {f}
              </Chip>
            ))}
          </div>
        )}
      </section>

      <div className="form-section-grid two-up">
        <section className="form-section">
          <label className="form-label">Want a Protective Coating?</label>
          <div className="chips-group" role="group" aria-label="Protective coating">
            {yesNoOptions.map(v => (
              <Chip key={v} active={form.clearCoat === v} onClick={() => handleChip("clearCoat", v)}>
                {v}
              </Chip>
            ))}
          </div>
        </section>

        <section className="form-section">
          <label className="form-label">Tools Add (multi-select)</label>
          <div className="chips-group" role="group" aria-label="Tools">
            {toolOptions.map(t => (
              <Chip key={t} active={form.tools.includes(t)} onClick={() => toggleTool(t)}>
                {t}
              </Chip>
            ))}
          </div>
        </section>
      </div>

      <button className="btn-main" disabled={!canProceed}>
        Continue to contact details
      </button>
    </form>
  );
}
