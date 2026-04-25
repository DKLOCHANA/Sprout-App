/**
 * Unit Conversion Utilities
 * Supports metric (kg, cm) and standard/imperial (lbs, in) systems
 */

export type UnitSystem = 'metric' | 'standard';

// ─── Conversion factors ───────────────────────────────────────────────────────
const KG_TO_LBS = 2.20462;
const LBS_TO_KG = 1 / KG_TO_LBS;
const CM_TO_IN = 1 / 2.54;
const IN_TO_CM = 2.54;

// ─── Raw converters ───────────────────────────────────────────────────────────
export const unitConversions = {
  kgToLbs: (kg: number): number => parseFloat((kg * KG_TO_LBS).toFixed(2)),
  lbsToKg: (lbs: number): number => parseFloat((lbs * LBS_TO_KG).toFixed(4)),
  cmToInches: (cm: number): number => parseFloat((cm * CM_TO_IN).toFixed(2)),
  inchesToCm: (inches: number): number => parseFloat((inches * IN_TO_CM).toFixed(2)),
};

// ─── Unit labels ──────────────────────────────────────────────────────────────
export const unitLabels = {
  weight: (system: UnitSystem) => (system === 'metric' ? 'kg' : 'lbs'),
  length: (system: UnitSystem) => (system === 'metric' ? 'cm' : 'in'),
};

// ─── Input placeholders ───────────────────────────────────────────────────────
export const unitPlaceholders = {
  weight: (system: UnitSystem) => (system === 'metric' ? '3.4' : '7.5'),
  height: (system: UnitSystem) => (system === 'metric' ? '50' : '19.7'),
  head: (system: UnitSystem) => (system === 'metric' ? '34' : '13.4'),
};

// ─── Convert user input to metric for storage ─────────────────────────────────

/** Convert a weight value (in the given unit system) to kg */
export function toKg(value: number, system: UnitSystem): number {
  return system === 'standard' ? unitConversions.lbsToKg(value) : value;
}

/** Convert a length/circumference value (in the given unit system) to cm */
export function toCm(value: number, system: UnitSystem): number {
  return system === 'standard' ? unitConversions.inchesToCm(value) : value;
}

// ─── Convert metric storage values to display values ─────────────────────────

/** Convert kg to the display unit */
export function fromKg(kg: number, system: UnitSystem): number {
  return system === 'standard' ? unitConversions.kgToLbs(kg) : kg;
}

/** Convert cm to the display unit */
export function fromCm(cm: number, system: UnitSystem): number {
  return system === 'standard' ? unitConversions.cmToInches(cm) : cm;
}
