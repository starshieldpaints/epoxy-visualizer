import React, { useState } from "react";
import EpoxyConfigForm from "./EpoxyConfigForm";
import UserDetailsForm from "./UserDetailsForm";
import ResultPage from "./ResultPage";
import SplashScreen from "./SplashScreen";

export default function EpoxyStepper() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const handleNext = dataFrag => {
    setData(prev => ({ ...prev, ...dataFrag }));
    setStep(s => s + 1);
  };

  const handleBack = () => setStep(s => Math.max(0, s - 1));

  return (
    <>
      {loading && <SplashScreen onFinish={() => setLoading(false)} />}
      {!loading && (
        <div className="form-root" role="main">
          <div style={{ textAlign: "center", marginBottom: "1.9rem", fontWeight: 800, fontSize: "1.3rem" }}>
            Epoxy Flooring Visualizer
          </div>
          {step === 0 && <EpoxyConfigForm onNext={handleNext} />}
          {step === 1 && <UserDetailsForm onNext={handleNext} onBack={handleBack} />}
          {step === 2 && <ResultPage data={data} onBack={handleBack} />}
        </div>
      )}
    </>
  );
}
