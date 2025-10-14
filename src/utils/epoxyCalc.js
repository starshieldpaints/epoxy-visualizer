const repairLookup = {
  0.5: { density: 1.25, consumption: 0.625, wastage: 10, adjusted: 0.6875 },
  1: { density: 1.25, consumption: 1.25, wastage: 10, adjusted: 1.375 },
  2: { density: 1.25, consumption: 2.5, wastage: 10, adjusted: 2.75 },
  3: { density: 1.25, consumption: 3.75, wastage: 10, adjusted: 4.125 },
  5: { density: 1.25, consumption: 6.25, wastage: 10, adjusted: 6.875 }
};

export function calculateEpoxyKit({ area, epoxyType, floorThickness, needsRepair, repairThickness }) {
  const thickness = parseFloat(floorThickness);

  const rates = {
    Plain: {
      primer: 0.15,
      screedPerMM: 0.75,
      topPerMM: 0.5,
      pigment: 0.0
    },
    Designer: {
      primer: 0.15,
      screedPerMM: 0.75,
      topPerMM: 0.5,
      pigment: 0.25
    }
  };

  const key = epoxyType === "Plain" ? "Plain" : "Designer";
  const r = rates[key];

  const primer = +(r.primer * area);
  const screed = +(r.screedPerMM * thickness * area);
  const top = +(r.topPerMM * thickness * area);
  const pigment = +(r.pigment * area);

  const repair = (() => {
    if (needsRepair !== "Yes" || !repairThickness) return null;
    const selected = repairLookup[repairThickness];
    if (!selected) return null;
    const baseTotal = +(selected.consumption * area).toFixed(3);
    const adjustedTotal = +(selected.adjusted * area).toFixed(3);
    return {
      thickness: Number(repairThickness),
      ...selected,
      baseTotal,
      adjustedTotal
    };
  })();

  return {
    kit: {
      Primer: {
        Resin: (primer * 2 / 3).toFixed(2),
        Hardener: (primer * 1 / 3).toFixed(2),
        Silica: 0,
        Pigment: 0,
        Weight: primer.toFixed(2)
      },
      Screed: {
        Resin: (screed * 0.7).toFixed(2),
        Hardener: (screed * 0.3).toFixed(2),
        Silica: key === "Plain" ? (screed * 0.2).toFixed(2) : 0,
        Pigment: 0,
        Weight: screed.toFixed(2)
      },
      TopCoat: {
        Resin: (top * 0.65).toFixed(2),
        Hardener: (top * 0.3).toFixed(2),
        Silica: key === "Plain" ? (top * 0.15).toFixed(2) : 0,
        Pigment: key === "Plain" ? 0 : pigment.toFixed(2),
        Weight: top.toFixed(2)
      }
    },
    totalKitWeight: (primer + screed + top + pigment).toFixed(2),
    coverage: area,
    thickness,
    epoxyType: key,
    repair
  };
}
