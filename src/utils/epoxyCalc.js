const repairLookup = {
  0.5: { density: 1.25, consumption: 0.625, wastage: 10, adjusted: 0.6875 },
  1: { density: 1.25, consumption: 1.25, wastage: 10, adjusted: 1.375 },
  2: { density: 1.25, consumption: 2.5, wastage: 10, adjusted: 2.75 },
  3: { density: 1.25, consumption: 3.75, wastage: 10, adjusted: 4.125 },
  5: { density: 1.25, consumption: 6.25, wastage: 10, adjusted: 6.875 }
};

export function calculateEpoxyKit({ area, epoxyType, floorThickness, needsRepair, repairThickness, protectiveCoat }) {
  const thickness = parseFloat(floorThickness);

  // Consumption rates from the shared sheet (kg/m2)
  const CONSUMPTION = {
    primerKgPerM2: 0.2, // 200 gm/m2
    screedKgPerM2: 1.5, // 1.5 kg/m2
    topKgPerM2: 1.5,    // 1.5 kg/m2 across finishes
    protectiveKgPerM2: 0.05 // 50 gm/m2
  };

  // Map epoxy finish to standard pack sizes (kg). Values reflect the screenshot table.
  // For finishes not explicitly listed, fall back to Plain.
  const PACKS = {
    Plain:        { primerKg: 3,  screedKg: 45, topKg: 25 },
    Texture:      { primerKg: 3,  screedKg: 45, topKg: 15 },
    Metallic:     { primerKg: 3,  screedKg: 45, topKg: 15 },
    '3D':         { primerKg: 3,  screedKg: 45, topKg: 12 },
    Clear:        { primerKg: 3,  screedKg: 45, topKg: 12 },
    Multicolor:   { primerKg: 3,  screedKg: 45, topKg: 25 }, // treat similar to Plain for now
    Factory:      { primerKg: 12, screedKg: 90, topKg: 50 }
  };

  const key = PACKS[epoxyType] ? epoxyType : 'Plain';
  const packs = PACKS[key];

  // Base weight calculations (retain for backward compatibility in existing table)
  const primer = +(CONSUMPTION.primerKgPerM2 * area);
  const screed = +(CONSUMPTION.screedKgPerM2 * area); // screed not tied to thickness in the shared sheet
  const top = +(CONSUMPTION.topKgPerM2 * area);
  const pigment = 0; // Specific pigment consumption varies by design; treat as 0 in generic calc

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

  // Helper to compute pack metrics
  const asPacks = (requiredKg, packSizeKg, perM2) => {
    const coveragePerPack = +(packSizeKg / perM2).toFixed(2);
    const requiredPacks = Math.ceil(requiredKg / packSizeKg) || 0;
    const totalPackWeight = +(requiredPacks * packSizeKg).toFixed(2);
    return { packSizeKg, perM2, coveragePerPack, requiredPacks, requiredKg: +requiredKg.toFixed(2), totalPackWeight };
  };

  const protectiveNeeded = protectiveCoat === 'Yes';
  const packages = {
    Primer: asPacks(primer, packs.primerKg, CONSUMPTION.primerKgPerM2),
    Screed: asPacks(screed, packs.screedKg, CONSUMPTION.screedKgPerM2),
    TopCoat: asPacks(top, packs.topKg, CONSUMPTION.topKgPerM2),
    ...(protectiveNeeded
      ? { Protective: asPacks(+(CONSUMPTION.protectiveKgPerM2 * area), 1, CONSUMPTION.protectiveKgPerM2) }
      : {})
  };

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
        Pigment: 0,
        Weight: top.toFixed(2)
      }
    },
    totalKitWeight: (primer + screed + top + pigment).toFixed(2),
    coverage: area,
    thickness,
    epoxyType: key,
    repair,
    packages
  };
}
