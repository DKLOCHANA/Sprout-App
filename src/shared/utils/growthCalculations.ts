/**
 * Growth Percentile Calculations
 * 
 * Implements WHO/CDC LMS method for calculating growth percentiles
 * and z-scores from measurement data.
 * 
 * References:
 * - WHO Child Growth Standards: https://www.who.int/tools/child-growth-standards
 * - LMS Method: Cole TJ (1990). The LMS method for constructing normalized growth standards
 */

import type {
  GrowthStandard,
  GrowthStandardSet,
  GrowthMetric,
  BiologicalSex,
  GrowthStandardType,
  PercentileResult
} from '../../features/growth/types/growth.types';

// ============================================================================
// LMS Method Percentile Calculation
// ============================================================================

/**
 * Calculate z-score from measurement using LMS parameters
 * 
 * Formula: Z = [(X/M)^L - 1] / (L * S)
 * Special case: When L = 0, Z = ln(X/M) / S
 * 
 * @param measurement - The measured value (e.g., weight in kg, height in cm)
 * @param L - Lambda (skewness parameter)
 * @param M - Mu (median value for age/sex)
 * @param S - Sigma (coefficient of variation)
 * @returns Z-score (standard deviations from median)
 */
export function calculateZScore(
  measurement: number,
  L: number,
  M: number,
  S: number
): number {
  if (measurement <= 0 || M <= 0 || S <= 0) {
    throw new Error('Invalid measurement or LMS parameters');
  }

  // Special case for L = 0 (log-normal distribution)
  if (Math.abs(L) < 0.00001) {
    return Math.log(measurement / M) / S;
  }

  // Standard LMS formula
  const ratio = measurement / M;
  const powered = Math.pow(ratio, L);
  const zScore = (powered - 1) / (L * S);

  return zScore;
}

/**
 * Convert z-score to percentile (0-100)
 * 
 * Uses standard normal cumulative distribution function (CDF)
 * Approximation: Abramowitz and Stegun formula
 * 
 * @param zScore - Standard deviations from median
 * @returns Percentile value (0-100)
 */
export function zScoreToPercentile(zScore: number): number {
  // Handle extreme values
  if (zScore < -5) return 0;
  if (zScore > 5) return 100;

  // Standard normal CDF approximation
  const cdf = normalCDF(zScore);
  return cdf * 100;
}

/**
 * Standard normal cumulative distribution function
 * Approximation using error function (erf)
 */
function normalCDF(z: number): number {
  return 0.5 * (1 + erf(z / Math.sqrt(2)));
}

/**
 * Error function approximation (Abramowitz and Stegun)
 */
function erf(x: number): number {
  // Constants for approximation
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  // Save the sign of x
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);

  // A&S formula 7.1.26
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
}

/**
 * Convert percentile to z-score
 * Inverse of zScoreToPercentile
 * 
 * @param percentile - Percentile value (0-100)
 * @returns Z-score (standard deviations from median)
 */
export function percentileToZScore(percentile: number): number {
  if (percentile <= 0) return -5;
  if (percentile >= 100) return 5;

  // Convert to probability (0-1)
  const p = percentile / 100;

  // Inverse normal CDF
  return inverseNormalCDF(p);
}

/**
 * Inverse normal CDF (approximation)
 */
function inverseNormalCDF(p: number): number {
  if (p <= 0 || p >= 1) {
    throw new Error('Probability must be between 0 and 1');
  }

  // Beasley-Springer-Moro algorithm approximation
  const a0 = 2.50662823884;
  const a1 = -18.61500062529;
  const a2 = 41.39119773534;
  const a3 = -25.44106049637;

  const b0 = -8.47351093090;
  const b1 = 23.08336743743;
  const b2 = -21.06224101826;
  const b3 = 3.13082909833;

  const c0 = 0.3374754822726147;
  const c1 = 0.9761690190917186;
  const c2 = 0.1607979714918209;
  const c3 = 0.0276438810333863;
  const c4 = 0.0038405729373609;
  const c5 = 0.0003951896511919;
  const c6 = 0.0000321767881768;
  const c7 = 0.0000002888167364;
  const c8 = 0.0000003960315187;

  const y = p - 0.5;

  if (Math.abs(y) < 0.42) {
    const r = y * y;
    return y * (((a3 * r + a2) * r + a1) * r + a0) /
      ((((b3 * r + b2) * r + b1) * r + b0) * r + 1);
  }

  let r = p;
  if (y > 0) {
    r = 1 - p;
  }

  r = Math.log(-Math.log(r));
  const x = c0 + r * (c1 + r * (c2 + r * (c3 + r * (c4 + r * (c5 + r * (c6 + r * (c7 + r * c8)))))));

  if (y < 0) {
    return -x;
  }

  return x;
}

// ============================================================================
// LMS Parameter Interpolation
// ============================================================================

/**
 * Find LMS parameters for a specific age by interpolation
 * 
 * @param ageInDays - Age in days
 * @param standards - Growth standard dataset
 * @returns Interpolated LMS parameters, or null if age out of range
 */
export function getLMSForAge(
  ageInDays: number,
  standards: GrowthStandard[]
): { L: number; M: number; S: number } | null {
  if (standards.length === 0) {
    return null;
  }

  // Check if age is within range
  const minAge = standards[0].ageInDays;
  const maxAge = standards[standards.length - 1].ageInDays;

  if (ageInDays < minAge || ageInDays > maxAge) {
    return null;
  }

  // Find exact match
  const exactMatch = standards.find(s => s.ageInDays === ageInDays);
  if (exactMatch) {
    return { L: exactMatch.L, M: exactMatch.M, S: exactMatch.S };
  }

  // Find surrounding data points for interpolation
  let lowerIndex = 0;
  let upperIndex = standards.length - 1;

  for (let i = 0; i < standards.length - 1; i++) {
    if (standards[i].ageInDays <= ageInDays && standards[i + 1].ageInDays >= ageInDays) {
      lowerIndex = i;
      upperIndex = i + 1;
      break;
    }
  }

  const lower = standards[lowerIndex];
  const upper = standards[upperIndex];

  // Linear interpolation
  const ageDiff = upper.ageInDays - lower.ageInDays;
  const fraction = (ageInDays - lower.ageInDays) / ageDiff;

  return {
    L: lower.L + fraction * (upper.L - lower.L),
    M: lower.M + fraction * (upper.M - lower.M),
    S: lower.S + fraction * (upper.S - lower.S)
  };
}

// ============================================================================
// Main Percentile Calculation Function
// ============================================================================

/**
 * Calculate percentile for a measurement
 * 
 * @param measurement - The measured value
 * @param ageInDays - Baby's age in days
 * @param sex - Biological sex
 * @param metric - Growth metric type
 * @param standardSet - Growth standard dataset
 * @returns Percentile result with z-score
 */
export function calculatePercentile(
  measurement: number,
  ageInDays: number,
  sex: BiologicalSex,
  metric: GrowthMetric,
  standardSet: GrowthStandardSet
): PercentileResult | null {
  // Validate inputs
  if (measurement <= 0 || ageInDays < 0) {
    return null;
  }

  if (standardSet.sex !== sex || standardSet.metric !== metric) {
    return null;
  }

  // Get LMS parameters for age
  const lms = getLMSForAge(ageInDays, standardSet.data);
  if (!lms) {
    return null;
  }

  try {
    // Calculate z-score
    const zScore = calculateZScore(measurement, lms.L, lms.M, lms.S);

    // Convert to percentile
    const percentile = zScoreToPercentile(zScore);

    return {
      percentile,
      zScore,
      measurement,
      ageInDays,
      metric,
      sex,
      standard: standardSet.standard
    };
  } catch (error) {
    console.error('Error calculating percentile:', error);
    return null;
  }
}

/**
 * Calculate measurement value from percentile and age
 * Inverse of calculatePercentile - useful for plotting percentile curves
 * 
 * @param percentile - Target percentile (0-100)
 * @param ageInDays - Age in days
 * @param sex - Biological sex
 * @param metric - Growth metric type
 * @param standardSet - Growth standard dataset
 * @returns Measurement value at the specified percentile
 */
export function percentileToMeasurement(
  percentile: number,
  ageInDays: number,
  sex: BiologicalSex,
  metric: GrowthMetric,
  standardSet: GrowthStandardSet
): number | null {
  if (standardSet.sex !== sex || standardSet.metric !== metric) {
    return null;
  }

  // Get LMS parameters for age
  const lms = getLMSForAge(ageInDays, standardSet.data);
  if (!lms) {
    return null;
  }

  try {
    // Convert percentile to z-score
    const zScore = percentileToZScore(percentile);

    // Reverse LMS formula: X = M * [1 + L * S * Z]^(1/L)
    if (Math.abs(lms.L) < 0.00001) {
      // Special case for L = 0
      return lms.M * Math.exp(lms.S * zScore);
    }

    const inner = 1 + lms.L * lms.S * zScore;
    if (inner <= 0) {
      return null; // Invalid calculation
    }

    return lms.M * Math.pow(inner, 1 / lms.L);
  } catch (error) {
    console.error('Error calculating measurement from percentile:', error);
    return null;
  }
}

// ============================================================================
// Batch Calculations
// ============================================================================

/**
 * Calculate percentiles for multiple measurements
 * Useful for calculating all metrics at once
 */
export interface MeasurementSet {
  weightKg?: number;
  heightCm?: number;
  headCircumferenceCm?: number;
}

export interface PercentileSet {
  weightPercentile?: number;
  weightZScore?: number;
  heightPercentile?: number;
  heightZScore?: number;
  headCircumferencePercentile?: number;
  headCircumferenceZScore?: number;
}

/**
 * Calculate all percentiles for a set of measurements
 * 
 * @param measurements - Object with weight, height, and/or head circumference
 * @param ageInDays - Baby's age in days
 * @param sex - Biological sex
 * @param weightStandard - Weight growth standard dataset
 * @param heightStandard - Height growth standard dataset
 * @param headCircumferenceStandard - Head circumference growth standard dataset
 * @returns Object with all calculated percentiles and z-scores
 */
export function calculateAllPercentiles(
  measurements: MeasurementSet,
  ageInDays: number,
  sex: BiologicalSex,
  weightStandard?: GrowthStandardSet,
  heightStandard?: GrowthStandardSet,
  headCircumferenceStandard?: GrowthStandardSet
): PercentileSet {
  const results: PercentileSet = {};

  // Calculate weight percentile
  if (measurements.weightKg && weightStandard) {
    const weightResult = calculatePercentile(
      measurements.weightKg,
      ageInDays,
      sex,
      'weight',
      weightStandard
    );
    if (weightResult) {
      results.weightPercentile = weightResult.percentile;
      results.weightZScore = weightResult.zScore;
    }
  }

  // Calculate height percentile
  if (measurements.heightCm && heightStandard) {
    const heightResult = calculatePercentile(
      measurements.heightCm,
      ageInDays,
      sex,
      'length',
      heightStandard
    );
    if (heightResult) {
      results.heightPercentile = heightResult.percentile;
      results.heightZScore = heightResult.zScore;
    }
  }

  // Calculate head circumference percentile
  if (measurements.headCircumferenceCm && headCircumferenceStandard) {
    const hcResult = calculatePercentile(
      measurements.headCircumferenceCm,
      ageInDays,
      sex,
      'headCircumference',
      headCircumferenceStandard
    );
    if (hcResult) {
      results.headCircumferencePercentile = hcResult.percentile;
      results.headCircumferenceZScore = hcResult.zScore;
    }
  }

  return results;
}
