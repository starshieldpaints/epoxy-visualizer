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
          <header className="form-header">
            <h1>Epoxy Flooring Visualizer</h1>
            <p className="muted-text">Estimate materials, plan repairs, and share your epoxy project on the go.</p>
            <div className="step-indicator" aria-label={`Step ${step + 1} of 3`}>
              <span className={`dot${step === 0 ? " active" : ""}`}></span>
              <span className={`dot${step === 1 ? " active" : ""}`}></span>
              <span className={`dot${step === 2 ? " active" : ""}`}></span>
            </div>
          </header>
          {step === 0 && <EpoxyConfigForm onNext={handleNext} />}
          {step === 1 && <UserDetailsForm onNext={handleNext} onBack={handleBack} />}
          {step === 2 && <ResultPage data={data} onBack={handleBack} />}
        </div>
      )}
    </>
  );
}
