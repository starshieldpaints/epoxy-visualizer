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

// const finishAsset = (filename) =>
//   `${process.env.PUBLIC_URL || ""}/finishes/${filename}`;


const finishAsset = (filename) => `./finishes/${filename}`;

const finishPreviews = {
  Plain: {
    title: "Plain Finish",
    description: "Smooth, solid colour system for clean, high-sheen floors.",
    background: "linear-gradient(135deg, #fee2e2 0%, #fca5a5 35%, #991b1b 100%)",
    image: null,
  },
  Multicolor: {
    title: "Designer Finish",
    description: "Lively multicolour base with accent flakes for expressive spaces.",
    background: "linear-gradient(135deg, #fdf2f8 0%, #f472b6 40%, #9d174d 100%)",
    image: finishAsset("multicolor-epoxy.jpg"),
  },
  Texture: {
    title: "Texture Finish",
    description: "Non-slip textured build that adds depth and safety underfoot.",
    background: "linear-gradient(135deg, #fee2e2 0%, #f97373 35%, #7f1d1d 100%)",
    image: finishAsset("texture-epoxy.jpg"),
  },
  Metallic: {
    title: "Metallic Finish",
    description: "Metallic swirls with mirror-like highlights for premium floors.",
    background: "linear-gradient(135deg, #fef2f2 0%, #fb7185 40%, #7f1d1d 100%)",
    image: finishAsset("metallic-epoxy.png"),
  },
  "3D": {
    title: "3D Finish",
    description: "Immersive artwork sealed beneath a crystal-clear top coat.",
    background: "linear-gradient(135deg, #fee2f2 0%, #fca5a5 45%, #312e81 100%)",
    image: finishAsset("3d-epoxy.jpg"),
  },
  Pearl: {
    title: "Pearl Finish",
    description: "Lustrous pearl pigments that shimmer with changing light.",
    background: "linear-gradient(135deg, #fdf4ff 0%, #fbcfe8 40%, #be123c 100%)",
    image: finishAsset("pearl-epoxy.jpg"),
  },
  Clear: {
    title: "Clear Finish",
    description: "Transparent protective topcoat that showcases the existing surface.",
    background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(226,232,240,0.85) 100%)",
    image: finishAsset("clear-epoxy.jpg"),
  }
};

const placePreviews = {
  Home: {
    title: "Home Interior",
    description: "Comfortable residential spaces finished with easy-clean gloss layers.",
    letter: "H",
    background: "linear-gradient(135deg, #fee2e2 0%, #fca5a5 45%, #dc2626 100%)",
    image: finishAsset("home.png")
  },
  Office: {
    title: "Office Space",
    description: "Stylish professional floors that impress clients and team alike.",
    letter: "O",
    background: "linear-gradient(135deg, #ffe4e6 0%, #fb7185 45%, #9f1239 100%)",
    image: finishAsset("office.png")
  },
  Factory: {
    title: "Factory Floor",
    description: "Heavy-duty protection for high-traffic manufacturing environments.",
    letter: "F",
    background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 35%, #7f1d1d 100%)",
    image: finishAsset("factory.png")
  },
  Showroom: {
    title: "Showroom",
    description: "High-gloss surfaces that highlight your premium products.",
    letter: "S",
    background: "linear-gradient(135deg, #fff1f2 0%, #f9a8d4 40%, #be123c 100%)",
    image: finishAsset("showroom.png")
  },
  Hospital: {
    title: "Healthcare",
    description: "Hygienic, seamless floors ideal for sterile care areas.",
    letter: "H",
    background: "linear-gradient(135deg, #fee2e2 0%, #f8b4b4 40%, #991b1b 100%)",
    image: finishAsset("hospital.png")
  },
  School: {
    title: "School",
    description: "Durable systems engineered for classrooms and corridors.",
    letter: "Sc",
    background: "linear-gradient(135deg, #fee2e2 0%, #fb7185 40%, #b91c1c 100%)",
    image: finishAsset("school.png")
  },
  Warehouse: {
    title: "Warehouse",
    description: "Anti-dust coatings to manage forklifts and storage loads.",
    letter: "W",
    background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 35%, #991b1b 100%)",
    image: finishAsset("warehouse.png")
  },
  Garage: {
    title: "Garage",
    description: "Oil-resistant layers ideal for garages and parking decks.",
    letter: "G",
    background: "linear-gradient(135deg, #fef2f2 0%, #f87171 45%, #450a0a 100%)",
    image: finishAsset("garage.png")
  },
  Parking: {
    title: "Parking",
    description: "Skid-resistant textures to keep vehicles safe and steady.",
    letter: "P",
    background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 45%, #991b1b 100%)",
    image: finishAsset("parking.png")
  }
};

const floorPreviews = {
  Cemented: {
    title: "Cemented Base",
    description: "Smooth cement subfloors prepped for maximum adhesion.",
    letter: "C",
    background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #64748b 100%)",
    image: finishAsset("cemented.png")
  },
  Tiled: {
    title: "Tiled Surface",
    description: "Tile substrates levelled for a continuous epoxy appearance.",
    letter: "T",
    background: "linear-gradient(135deg, #fef2f2 0%, #fecdd3 45%, #9f1239 100%)",
    image: finishAsset("tiled.png")
  },
  Marble: {
    title: "Marble",
    description: "Luxurious marble preserved under a crystal-clear shield.",
    letter: "M",
    background: "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 45%, #475569 100%)",
    image: finishAsset("marble.png")
  },
  Granite: {
    title: "Granite",
    description: "Dense granite base sealed for a refined mirror sheen.",
    letter: "G",
    background: "linear-gradient(135deg, #e2e8f0 0%, #cbd5f5 40%, #334155 100%)",
    image: finishAsset("granite.png")
  },
  Wooden: {
    title: "Wooden",
    description: "Timber floors protected by flexible epoxy cushioning.",
    letter: "W",
    background: "linear-gradient(135deg, #fee2e2 0%, #fbcfe8 35%, #7f1d1d 100%)",
    image: finishAsset("wooden.png")
  },
  "Kota Stone": {
    title: "Kota Stone",
    description: "Natural Kota stone sealed to resist stains and wear.",
    letter: "K",
    background: "linear-gradient(135deg, #f1f5f9 0%, #d9f99d 45%, #365314 100%)",
    image: finishAsset("kota.png")
  },
  Precast: {
    title: "Precast",
    description: "Precast slabs primed for a level, uniform epoxy coat.",
    letter: "P",
    background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 45%, #64748b 100%)",
    image: finishAsset("precast.png")
  }
};

function Chip({ children, active, onClick, className = "" }) {
  return (
    <button
      type="button"
      className={`chip${active ? " selected" : ""}${className ? ` ${className}` : ""}`}
      onClick={onClick}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

function PreviewCard({ title, description, background, letter, image }) {
  const badgeText = (letter || title?.[0] || "?").toString().slice(0, 2).toUpperCase();
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(image) && !imageFailed;
  const style = !showImage && background ? { backgroundImage: background } : undefined;

  return (
    <div className={`preview-card${showImage ? " preview-card--with-image" : ""}`} style={style}>
      {showImage ? (
        <>
          <div className="preview-card__image-wrapper">
            <img
              src={image}
              alt={`${title} example`}
              loading="lazy"
              onError={() => setImageFailed(true)}
            />
            <span className="preview-card__badge preview-card__badge--pill">{badgeText}</span>
          </div>
          <div className="preview-card__body preview-card__body--light">
            <h4>{title}</h4>
            <p>{description}</p>
          </div>
        </>
      ) : (
        <>
          <div className="preview-card__badge">{badgeText}</div>
          <div className="preview-card__body">
            <h4>{title}</h4>
            <p>{description}</p>
          </div>
        </>
      )}
    </div>
  );
}

function ConfigPreview({ place, placeOther, floor, floorOther, finish }) {
  const cards = [];

  if (place) {
    const basePlace = placePreviews[place];
    const customPlace = place === "Others" && placeOther
      ? {
          title: placeOther,
          description: "Tailor-made epoxy system for your custom space.",
          letter: (placeOther[0] || "?").toUpperCase(),
          background: "linear-gradient(135deg, #fee2e2 0%, #fca5a5 45%, #7f1d1d 100%)"
        }
      : null;
    const resolvedPlace = customPlace || basePlace;
    if (resolvedPlace) {
      cards.push({ id: "place", ...resolvedPlace });
    }
  }

  if (floor) {
    const baseFloor = floorPreviews[floor];
    const customFloor = floor === "Other" && floorOther
      ? {
          title: floorOther,
          description: "Prepared substrate engineered for Starshield systems.",
          letter: (floorOther[0] || "?").toUpperCase(),
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 45%, #991b1b 100%)"
        }
      : null;
    const resolvedFloor = customFloor || baseFloor;
    if (resolvedFloor) {
      cards.push({ id: "floor", ...resolvedFloor });
    }
  }

  if (finish && finishPreviews[finish]) {
    cards.push({ id: "finish", ...finishPreviews[finish] });
  }

  return (
    <aside className="config-preview" aria-live="polite">
      <div className="preview-header">
        <h3>Project Inspiration</h3>
        <p className="muted-text">Visuals update automatically as you refine the area, floor and epoxy style.</p>
      </div>
      {cards.length ? (
        <div className="preview-stack">
      {cards.map(({ id, ...cardProps }) => (
        <PreviewCard key={id} {...cardProps} />
      ))}
        </div>
      ) : (
        <div className="preview-placeholder">
          <p>Select an application area, floor type, and epoxy finish to preview matching inspiration.</p>
        </div>
      )}
    </aside>
  );
}

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
    epoxyFinish: epoxyFinishes[0],
    baseColor: baseColors[0],
    topColor: defaultTopColors[0],
    flakes: "No",
    flakesType: "",
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
    () => repairOptions.find(opt => String(opt.thickness) === String(form.repairThickness)) || null,
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
    if (form.needsRepair !== "Yes" && form.repairThickness) {
      setForm(prev => ({ ...prev, repairThickness: "" }));
    }
  }, [form.needsRepair, form.repairThickness]);

  useEffect(() => {
    setForm(prev => {
      if (!availableTopColors.length) {
        return prev.topColor ? { ...prev, topColor: "" } : prev;
      }
      if (!availableTopColors.includes(prev.topColor)) {
        return { ...prev, topColor: availableTopColors[0] || "" };
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
      repairOption: repairSelection
    });
  };

  return (
    <form className="form-card config-form" onSubmit={submitForm}>
      <div className="config-main">
        <div className="config-fields">
          <div className="form-section">
            <label className="form-label">Where to apply?</label>
            <div className="chips-group" role="group" aria-label="Application place">
              {places.map(place => (
                <Chip key={place} active={form.place === place} onClick={() => handleChip("place", place)}>
                  {place}
                </Chip>
              ))}
            </div>
            {form.place === "Others" && (
              <input
                className="form-input"
                placeholder="Describe the place"
                value={form.placeOther}
                onChange={e => handleInput("placeOther", e.target.value)}
              />
            )}
          </div>

          <div className="form-section">
            <label className="form-label">Type of Floor</label>
            <div className="chips-group" role="group" aria-label="Floor type">
              {floorTypes.map(type => (
                <Chip key={type} active={form.floorType === type} onClick={() => handleChip("floorType", type)}>
                  {type}
                </Chip>
              ))}
            </div>
            {form.floorType === "Other" && (
              <input
                className="form-input"
                placeholder="Enter floor type"
                value={form.floorTypeOther}
                onChange={e => handleInput("floorTypeOther", e.target.value)}
              />
            )}
          </div>

          <div className="form-section-grid two-up">
            <section className="form-section">
              <label className="form-label">
                Area <span className="label-hint">(sq m)</span>
              </label>
              <input
                className="form-input"
                type="number"
                min={1}
                inputMode="decimal"
                placeholder="Total coated area"
                value={form.area}
                onChange={e => handleInput("area", e.target.value)}
                required
              />
            </section>
            <section className="form-section">
              <label className="form-label">Thickness (mm)</label>
              <input
                className="form-input"
                type="number"
                min={0.1}
                step={0.1}
                inputMode="decimal"
                placeholder="Enter thickness"
                value={form.thickness}
                onChange={e => handleInput("thickness", e.target.value)}
                required
              />
              <div className="chips-group compact" role="group" aria-label="Quick thickness selection">
                {quickThicknessOptions.map(value => (
                  <Chip
                    key={value}
                    active={Number(form.thickness) === Number(value)}
                    onClick={() => handleChip("thickness", value)}
                  >
                    {value} mm
                  </Chip>
                ))}
              </div>
            </section>
          </div>

          <div className="form-section">
            <label className="form-label">Is the surface uneven?</label>
            <div className="chips-group" role="group" aria-label="Surface uneven">
              {yesNoOptions.map(option => (
                <Chip key={option} active={form.surfaceUneven === option} onClick={() => handleChip("surfaceUneven", option)}>
                  {option}
                </Chip>
              ))}
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">Do you need any repairing?</label>
            <div className="chips-group" role="group" aria-label="Repair requirement">
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
                  <div className="repair-details" role="note">
                    <div>Density: <strong>{repairSelection.density}</strong> kg/L</div>
                    <div>
                      Adjusted consumption: <strong>{repairSelection.adjusted}</strong> kg/m^2 (incl. {repairSelection.wastage}% wastage)
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="form-section">
            <label className="form-label">Is this the first time or reapplication?</label>
            <div className="chips-group" role="group" aria-label="Application type">
              {firstTimeOptions.map(option => (
                <Chip key={option} active={form.firstTime === option} onClick={() => handleChip("firstTime", option)}>
                  {option}
                </Chip>
              ))}
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">Type of Epoxy Finish</label>
            <div className="chips-group" role="group" aria-label="Epoxy finish">
              {epoxyFinishes.map(option => (
                <Chip key={option} active={form.epoxyFinish === option} onClick={() => handleChip("epoxyFinish", option)}>
                  {option}
                </Chip>
              ))}
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">Base Colour</label>
            <div className="chips-group" role="group" aria-label="Base colour">
              {baseColors.map(color => (
                <Chip key={color} active={form.baseColor === color} onClick={() => handleChip("baseColor", color)}>
                  <span className="color-swatch" style={{ background: color.toLowerCase(), borderColor: "#aaa" }}></span>
                  {color}
                </Chip>
              ))}
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">Top Colour</label>
            {availableTopColors.length > 0 ? (
              <div className="chips-group" role="group" aria-label="Top colour">
                {availableTopColors.map(color => (
                  <Chip key={color} active={form.topColor === color} onClick={() => handleChip("topColor", color)}>
                    <span className="color-swatch" style={{ background: color.toLowerCase(), borderColor: "#aaa" }}></span>
                    {color}
                  </Chip>
                ))}
              </div>
            ) : (
              <p className="muted-text">Top coat not required for the selected finish.</p>
            )}
          </div>

          <div className="form-section">
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
          </div>

          <div className="form-section-grid two-up">
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
                {toolOptions.map(tool => (
                  <Chip key={tool} active={form.tools.includes(tool)} onClick={() => toggleTool(tool)}>
                    {tool}
                  </Chip>
                ))}
              </div>
            </section>
          </div>
        </div>

        <ConfigPreview
          place={form.place}
          placeOther={form.placeOther}
          floor={form.floorType}
          floorOther={form.floorTypeOther}
          finish={form.epoxyFinish}
        />
      </div>

      <div className="config-actions">
        <button className="btn-main" disabled={!canProceed}>
          Continue to contact details
        </button>
      </div>
    </form>
  );
}
