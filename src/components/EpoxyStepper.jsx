import React, { useMemo, useState } from "react";
import EpoxyConfigForm from "./EpoxyConfigForm";
import UserDetailsForm from "./UserDetailsForm";
import ResultPage from "./ResultPage";
import SplashScreen from "./SplashScreen";
import { saveLead } from "../services/firebase";
import { calculateEpoxyKit } from "../utils/epoxyCalc";
import starshieldLogo from "../assets/starshield-logo.jpg";

export default function EpoxyStepper() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [leadStatus, setLeadStatus] = useState({ state: "idle", message: null, reference: null });

  const calculation = useMemo(() => {
    if (!data.area || !data.thickness || !data.epoxyType) return null;

    return calculateEpoxyKit({
      area: Number(data.area),
      epoxyType: data.epoxyType || data.epoxyDesignerType || data.epoxyMainType,
      floorThickness: Number(data.thickness),
      needsRepair: data.needsRepair,
      repairThickness: data.repairThickness,
      protectiveCoat: data.clearCoat
    });
  }, [data]);

  const handleConfigNext = config => {
    setData(prev => ({ ...prev, ...config }));
    setLeadStatus({ state: "idle", message: null, reference: null });
    setStep(1);
  };

  const handleUserNext = async contact => {
    const payload = { ...data, ...contact };
    setData(payload);
    setLeadStatus({ state: "saving", message: null, reference: null });

    try {
      const kit =
        calculation ||
        calculateEpoxyKit({
          area: Number(payload.area),
          epoxyType: payload.epoxyType || payload.epoxyDesignerType || payload.epoxyMainType,
          floorThickness: Number(payload.thickness),
          needsRepair: payload.needsRepair,
          repairThickness: payload.repairThickness,
          protectiveCoat: payload.clearCoat
        });

      const docRef = await saveLead({ ...payload, calculation: kit });
      setLeadStatus({ state: "saved", message: "Details shared with Starshield.", reference: docRef?.id || null });
    } catch (error) {
      setLeadStatus({
        state: "error",
        message: error?.message || "We couldn't send your details to Starshield. Please verify your Firebase setup.",
        reference: null
      });
    }

    setStep(2);
  };

  const handleBack = () => {
    if (step <= 1) {
      setLeadStatus({ state: "idle", message: null, reference: null });
    }
    setStep(s => Math.max(0, s - 1));
  };

  return (
    <>
      {loading && <SplashScreen onFinish={() => setLoading(false)} />}
      {!loading && (
        <div className="form-root" role="main">
          <header className="form-header">
            <div className="brand" aria-label="Starshield Smart Paints & Coatings">
              <img src={starshieldLogo} alt="Starshield Smart Paints & Coatings" className="brand-logo" />
            </div>
            <h1>Epoxy Flooring Visualizer</h1>
            <p className="muted-text">Estimate materials, plan repairs, and share your epoxy project on the go.</p>
            <div className="step-indicator" aria-label={`Step ${step + 1} of 3`}>
              <span className={`dot${step === 0 ? " active" : ""}`}></span>
              <span className={`dot${step === 1 ? " active" : ""}`}></span>
              <span className={`dot${step === 2 ? " active" : ""}`}></span>
            </div>
          </header>
          {step === 0 && <EpoxyConfigForm onNext={handleConfigNext} />}
          {step === 1 && (
            <UserDetailsForm
              onNext={handleUserNext}
              onBack={handleBack}
              status={leadStatus}
            />
          )}
          {step === 2 && <ResultPage data={data} onBack={handleBack} />}
        </div>
      )}
    </>
  );
}
