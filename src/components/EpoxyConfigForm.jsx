import React, { useEffect, useMemo, useState } from "react";
import FormSectionGrid from "./FormSectionGrid";

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

  const handleChip = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  const handleInput = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  const toggleTool = tool =>
    setForm(prev => ({
      ...prev,
      tools: prev.tools.includes(tool)
        ? prev.tools.filter(item => item !== tool)
        : [...prev.tools, tool]
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
    form.area &&
    form.thickness &&
    epoxyType &&
    form.baseColor &&
    (availableTopColors.length === 0 || form.topColor) &&
    (form.flakes === "No" || form.flakesType);

  const submitForm = event => {
    event.preventDefault();
    if (!canProceed) return;

    onNext({
      ...form,
      epoxyType,
      placeFinal: form.place === "Others" ? form.placeOther : form.place,
      floorTypeFinal: form.floorType === "Other" ? form.floorTypeOther : form.floorType,
      repairOption: repairSelection || null
    });
  };

  return (
    <form className="form-card config-card" onSubmit={submitForm}>
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

      <FormSectionGrid>
        <section className="form-section">
          <label className="form-label">Where to apply?</label>
          <div className="chips-group" role="group" aria-label="Application area">
            {places.map(option => (
              <Chip key={option} active={form.place === option} onClick={() => handleChip("place", option)}>
                {option}
              </Chip>
            ))}
          </div>
          {form.place === "Others" && (
            <input
              className="form-input"
              value={form.placeOther}
              onChange={event => handleInput("placeOther", event.target.value)}
              placeholder="Specify other location"
            />
          )}
        </section>
        <section className="form-section">
          <label className="form-label">Is the surface uneven?</label>
          <div className="chips-group" role="group" aria-label="Surface uneven">
            {yesNoOptions.map(option => (
              <Chip
                key={option}
                active={form.surfaceUneven === option}
                onClick={() => handleChip("surfaceUneven", option)}
              >
                {option}
              </Chip>
            ))}
          </div>
        </section>
      </FormSectionGrid>

      <FormSectionGrid>
        <section className="form-section">
          <label className="form-label">Type of Floor</label>
          <div className="chips-group" role="group" aria-label="Floor type">
            {floorTypes.map(option => (
              <Chip key={option} active={form.floorType === option} onClick={() => handleChip("floorType", option)}>
                {option}
              </Chip>
            ))}
          </div>
          {form.floorType === "Other" && (
            <input
              className="form-input"
              value={form.floorTypeOther}
              onChange={event => handleInput("floorTypeOther", event.target.value)}
              placeholder="Specify other floor type"
            />
          )}
        </section>
        <section className="form-section">
          <label className="form-label">Is this the first time or reapplication?</label>
          <div className="chips-group" role="group" aria-label="Application history">
            {firstTimeOptions.map(option => (
              <Chip key={option} active={form.firstTime === option} onClick={() => handleChip("firstTime", option)}>
                {option}
              </Chip>
            ))}
          </div>
        </section>
      </FormSectionGrid>

      <section className="form-section">
        <label className="form-label">Do you need any repairing?</label>
        <div className="chips-group" role="group" aria-label="Repair required">
          {yesNoOptions.map(option => (
            <Chip key={option} active={form.needsRepair === option} onClick={() => handleChip("needsRepair", option)}>
              {option}
            </Chip>
          ))}
        </div>
        {form.needsRepair === "Yes" && (
          <div className="repair-panel">
            <div className="repair-header">Select repair layer thickness</div>
            <div className="chips-group compact" role="group" aria-label="Repair thickness">
              {repairOptions.map(option => (
                <Chip
                  key={option.thickness}
                  active={String(form.repairThickness) === String(option.thickness)}
                  onClick={() => handleChip("repairThickness", option.thickness)}
                >
                  {option.thickness} mm
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

      <FormSectionGrid>
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
            onChange={event => handleInput("area", event.target.value)}
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
            onChange={event => handleInput("thickness", event.target.value)}
          />
          <div className="chips-group compact" role="group" aria-label="Quick thickness selection">
            {quickThicknessOptions.map(option => (
              <Chip
                key={option}
                active={Number(form.thickness) === Number(option)}
                onClick={() => handleChip("thickness", option)}
              >
                {option} mm
              </Chip>
            ))}
          </div>
        </section>
      </FormSectionGrid>

      <section className="form-section">
        <label className="form-label">Type of Epoxy Finish</label>
        <div className="chips-group" role="group" aria-label="Epoxy finish">
          {epoxyFinishes.map(option => (
            <Chip key={option} active={form.epoxyFinish === option} onClick={() => handleChip("epoxyFinish", option)}>
              {option}
            </Chip>
          ))}
        </div>
        {form.epoxyFinish === "Pearl" && (
          <input
            className="form-input"
            placeholder="Preferred pearl colour"
            value={form.pearlColor}
            onChange={event => handleInput("pearlColor", event.target.value)}
          />
        )}
      </section>

      <FormSectionGrid>
        <section className="form-section">
          <label className="form-label">Base Colour</label>
          <div className="chips-group" role="group" aria-label="Base colour">
            {baseColors.map(option => (
              <Chip key={option} active={form.baseColor === option} onClick={() => handleChip("baseColor", option)}>
                <span
                  className={`color-swatch${form.baseColor === option ? " selected" : ""}`}
                  style={{ background: option.toLowerCase(), borderColor: "#aaa" }}
                ></span>
                {option}
              </Chip>
            ))}
          </div>
        </section>
        <section className="form-section">
          <label className="form-label">Top Colour</label>
          {availableTopColors.length > 0 ? (
            <div className="chips-group" role="group" aria-label="Top colour">
              {availableTopColors.map(option => (
                <Chip key={option} active={form.topColor === option} onClick={() => handleChip("topColor", option)}>
                  <span
                    className={`color-swatch${form.topColor === option ? " selected" : ""}`}
                    style={{ background: option.toLowerCase(), borderColor: "#aaa" }}
                  ></span>
                  {option}
                </Chip>
              ))}
            </div>
          ) : (
            <p className="muted-text">Top coat not required for the selected finish.</p>
          )}
        </section>
      </FormSectionGrid>

      <section className="form-section">
        <label className="form-label">Want Metallic flakes / Crystal?</label>
        <div className="chips-group" role="group" aria-label="Flake preference">
          {yesNoOptions.map(option => (
            <Chip key={option} active={form.flakes === option} onClick={() => handleChip("flakes", option)}>
              {option}
            </Chip>
          ))}
        </div>
        {form.flakes === "Yes" && (
          <div className="chips-group" role="group" aria-label="Flake selection">
            {flakeOptions.map(option => (
              <Chip key={option} active={form.flakesType === option} onClick={() => handleChip("flakesType", option)}>
                {option}
              </Chip>
            ))}
          </div>
        )}
      </section>

      <FormSectionGrid>
        <section className="form-section">
          <label className="form-label">Want a Protective Coating?</label>
          <div className="chips-group" role="group" aria-label="Protective coating">
            {yesNoOptions.map(option => (
              <Chip key={option} active={form.clearCoat === option} onClick={() => handleChip("clearCoat", option)}>
                {option}
              </Chip>
            ))}
          </div>
        </section>
        <section className="form-section">
          <label className="form-label">Tools Add (multi-select)</label>
          <div className="chips-group" role="group" aria-label="Tools">
            {toolOptions.map(option => (
              <Chip key={option} active={form.tools.includes(option)} onClick={() => toggleTool(option)}>
                {option}
              </Chip>
            ))}
          </div>
        </section>
      </FormSectionGrid>

      <button className="btn-main" disabled={!canProceed}>
        Continue to contact details
      </button>
    </form>
  );
}
