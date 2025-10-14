import React, { useMemo, useState } from "react";
import EpoxyConfigForm from "./EpoxyConfigForm";
import UserDetailsForm from "./UserDetailsForm";
import ResultPage from "./ResultPage";
import SplashScreen from "./SplashScreen";
import { saveLead } from "../services/firebase";
import { calculateEpoxyKit } from "../utils/epoxyCalc";

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
      repairThickness: data.repairThickness
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
          repairThickness: payload.repairThickness
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

  const handleReset = () => {
    setData({});
    setLeadStatus({ state: "idle", message: null, reference: null });
    setStep(0);
  };

  const progress = ((step + 1) / 3) * 100;

  return (
    <>
      {loading && <SplashScreen onFinish={() => setLoading(false)} />}
      {!loading && (
        <div className="app-shell" role="main">
          <div className="app-inner">
            <header className="brand-banner">
              <div className="brand-copy">
                <span className="brand-kicker">Starshield</span>
                <h1>Epoxy Flooring Visualizer</h1>
                <p className="brand-subtitle">
                  Plan, repair, and estimate epoxy coatings with a workflow tuned for job sites and mobile crews.
                </p>
                <div>
                  <div className="progress-track" role="progressbar" aria-valuemin={1} aria-valuemax={3} aria-valuenow={step + 1}>
                    <span className="progress-meter" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="progress-label">Step {step + 1} of 3</span>
                </div>
              </div>
              <div className="brand-visual" aria-hidden="true">
                <div className="brand-burst">
                  <span className="burst-inner"></span>
                </div>
                <span className="brand-tagline">Trusted by Starshield applicators</span>
              </div>
            </header>
            {step === 0 && <EpoxyConfigForm onNext={handleConfigNext} />}
            {step === 1 && <UserDetailsForm onNext={handleUserNext} onBack={handleBack} status={leadStatus} />}
            {step === 2 && (
              <ResultPage data={data} calculation={calculation} onBack={handleBack} onReset={handleReset} leadStatus={leadStatus} />
            )}
          </div>
        </div>
      )}
    </>
  );
}
