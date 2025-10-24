import React, { useState } from "react";
import Layout from "../components/Layout";
import RoomScene from "../components/RoomScene";
import FloorControls from "../components/FloorControls";
import ResultModal from "../components/ResultModal";

const defaultState = {
  baseColor: "#e0e0e0",
  flakeType: "none",
  name: "",
  email: "",
  showModal: false,
  screenshot: null,
};

function HomePage() {
  const [state, setState] = useState(defaultState);

  const updateState = (updates) => setState((prev) => ({ ...prev, ...updates }));

  return (
    <>
      <Layout>
        <FloorControls state={state} updateState={updateState} />
        <RoomScene
          baseColor={state.baseColor}
          flakeType={state.flakeType}
          onCapture={(img) => updateState({ screenshot: img, showModal: true })}
        />
      </Layout>
      {state.showModal && (
        <ResultModal
          state={state}
          onClose={() => updateState({ showModal: false })}
        />
      )}
    </>
  );
}

export default HomePage;
