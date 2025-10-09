import React from "react";

const flakes = [
  { value: "none", label: "None" },
  { value: "silver", label: "Silver" },
  { value: "gold", label: "Gold" },
  { value: "copper", label: "Copper" },
];

function FloorControls({ state, updateState }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        updateState({ showModal: true });
      }}
      className="floor-form"
    >
      <h2>Epoxy Floor Customizer</h2>

      <label>
        Base Color:
        <input
          type="color"
          value={state.baseColor}
          onChange={(e) => updateState({ baseColor: e.target.value })}
        />
      </label>
      <label>
        Flake Type:
        <select
          value={state.flakeType}
          onChange={(e) => updateState({ flakeType: e.target.value })}
        >
          {flakes.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        Name:
        <input
          type="text"
          value={state.name}
          required
          onChange={(e) => updateState({ name: e.target.value })}
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          value={state.email}
          required
          onChange={(e) => updateState({ email: e.target.value })}
        />
      </label>

      <button type="submit" className="submit-btn">
        Show Result
      </button>
    </form>
  );
}

export default FloorControls;
