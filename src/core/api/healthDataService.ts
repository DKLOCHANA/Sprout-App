/**
 * Health Data Service
 * 
 * Provides access to WHO/CDC growth standards data.
 * Implements caching for performance.
 */

import type {
  GrowthStandardSet,
  GrowthMetric,
  BiologicalSex,
  GrowthStandardType
} from '../../features/growth/types/growth.types';

// Import growth standard datasets
import whoWeightBoysData from '../data/growthStandards/who-weight-for-age-boys.json';
import whoWeightGirlsData from '../data/growthStandards/who-weight-for-age-girls.json';
import whoLengthBoysData from '../data/growthStandards/who-length-for-age-boys.json';
import whoLengthGirlsData from '../data/growthStandards/who-length-for-age-girls.json';
import whoHeadCircumferenceBoysData from '../data/growthStandards/who-head-circumference-boys.json';
import whoHeadCircumferenceGirlsData from '../data/growthStandards/who-head-circumference-girls.json';

// ============================================================================
// In-Memory Cache
// ============================================================================

interface CacheKey {
  metric: GrowthMetric;
  sex: BiologicalSex;
  standard: GrowthStandardType;
}

const growthStandardCache = new Map<string, GrowthStandardSet>();

function getCacheKey(metric: GrowthMetric, sex: BiologicalSex, standard: GrowthStandardType): string {
  return `${standard}-${metric}-${sex}`;
}

// ============================================================================
// Dataset Registry
// ============================================================================

/**
 * Registry mapping cache keys to dataset imports
 * This allows for lazy loading and easy extension
 */
const datasetRegistry: Record<string, GrowthStandardSet> = {
  'WHO-weight-male': whoWeightBoysData as GrowthStandardSet,
  'WHO-weight-female': whoWeightGirlsData as GrowthStandardSet,
  'WHO-length-male': whoLengthBoysData as GrowthStandardSet,
  'WHO-length-female': whoLengthGirlsData as GrowthStandardSet,
  'WHO-height-male': whoLengthBoysData as GrowthStandardSet,  // Same as length for WHO
  'WHO-height-female': whoLengthGirlsData as GrowthStandardSet,
  'WHO-headCircumference-male': whoHeadCircumferenceBoysData as GrowthStandardSet,
  'WHO-headCircumference-female': whoHeadCircumferenceGirlsData as GrowthStandardSet,
};

// ============================================================================
// Main Service Functions
// ============================================================================

/**
 * Get growth standard dataset for specific parameters
 * 
 * @param metric - Growth metric (weight, length, height, headCircumference)
 * @param sex - Biological sex (male, female)
 * @param standard - Growth standard type (WHO, CDC)
 * @returns Growth standard dataset, or null if not found
 */
export function getGrowthStandard(
  metric: GrowthMetric,
  sex: BiologicalSex,
  standard: GrowthStandardType = 'WHO'
): GrowthStandardSet | null {
  const cacheKey = getCacheKey(metric, sex, standard);

  // Check cache first
  if (growthStandardCache.has(cacheKey)) {
    return growthStandardCache.get(cacheKey)!;
  }

  // Load from registry
  const dataset = datasetRegistry[cacheKey];
  if (!dataset) {
    console.warn(`Growth standard not found: ${cacheKey}`);
    return null;
  }

  // Validate dataset structure
  if (!validateGrowthStandardSet(dataset)) {
    console.error(`Invalid growth standard dataset: ${cacheKey}`);
    return null;
  }

  // Cache and return
  growthStandardCache.set(cacheKey, dataset);
  return dataset;
}

/**
 * Get multiple growth standards at once
 * Useful when calculating all percentiles for a baby
 * 
 * @param sex - Biological sex
 * @param standard - Growth standard type (default: WHO)
 * @returns Object with all available growth standards
 */
export function getAllGrowthStandards(
  sex: BiologicalSex,
  standard: GrowthStandardType = 'WHO'
): {
  weight?: GrowthStandardSet;
  length?: GrowthStandardSet;
  height?: GrowthStandardSet;
  headCircumference?: GrowthStandardSet;
} {
  return {
    weight: getGrowthStandard('weight', sex, standard) ?? undefined,
    length: getGrowthStandard('length', sex, standard) ?? undefined,
    height: getGrowthStandard('height', sex, standard) ?? undefined,
    headCircumference: getGrowthStandard('headCircumference', sex, standard) ?? undefined,
  };
}

/**
 * Check if a growth standard is available
 * 
 * @param metric - Growth metric
 * @param sex - Biological sex
 * @param standard - Growth standard type
 * @returns True if standard is available
 */
export function isGrowthStandardAvailable(
  metric: GrowthMetric,
  sex: BiologicalSex,
  standard: GrowthStandardType = 'WHO'
): boolean {
  const cacheKey = getCacheKey(metric, sex, standard);
  return cacheKey in datasetRegistry;
}

/**
 * Get available age range for a growth standard
 * 
 * @param metric - Growth metric
 * @param sex - Biological sex
 * @param standard - Growth standard type
 * @returns Age range in days, or null if not found
 */
export function getAgeRange(
  metric: GrowthMetric,
  sex: BiologicalSex,
  standard: GrowthStandardType = 'WHO'
): { min: number; max: number } | null {
  const dataset = getGrowthStandard(metric, sex, standard);
  if (!dataset) {
    return null;
  }

  return {
    min: dataset.ageRangeMin,
    max: dataset.ageRangeMax
  };
}

// ============================================================================
// Validation
// ============================================================================

/**
 * Validate growth standard dataset structure
 */
function validateGrowthStandardSet(dataset: unknown): dataset is GrowthStandardSet {
  if (!dataset || typeof dataset !== 'object') {
    return false;
  }

  const obj = dataset as Record<string, unknown>;

  // Check required fields
  const requiredFields = ['metric', 'sex', 'standard', 'ageRangeMin', 'ageRangeMax', 'unit', 'data'];
  for (const field of requiredFields) {
    if (!(field in obj)) {
      return false;
    }
  }

  // Validate data array
  if (!Array.isArray(obj.data) || obj.data.length === 0) {
    return false;
  }

  // Validate first data point structure
  const firstPoint = obj.data[0] as Record<string, unknown> | undefined;
  if (!firstPoint || typeof firstPoint !== 'object') {
    return false;
  }

  if (!('ageInDays' in firstPoint && 'L' in firstPoint && 'M' in firstPoint && 'S' in firstPoint)) {
    return false;
  }

  return true;
}

// ============================================================================
// Cache Management
// ============================================================================

/**
 * Clear growth standard cache
 * Useful for testing or memory management
 */
export function clearCache(): void {
  growthStandardCache.clear();
}

/**
 * Get cache statistics
 * Useful for debugging
 */
export function getCacheStats(): {
  size: number;
  keys: string[];
} {
  return {
    size: growthStandardCache.size,
    keys: Array.from(growthStandardCache.keys())
  };
}

/**
 * Preload all growth standards into cache
 * Call this on app startup for better performance
 * 
 * @param sex - Biological sex to preload (or both if undefined)
 * @param standard - Growth standard type (default: WHO)
 */
export function preloadGrowthStandards(
  sex?: BiologicalSex,
  standard: GrowthStandardType = 'WHO'
): void {
  const sexes: BiologicalSex[] = sex ? [sex] : ['male', 'female'];
  const metrics: GrowthMetric[] = ['weight', 'length', 'height', 'headCircumference'];

  for (const s of sexes) {
    for (const metric of metrics) {
      getGrowthStandard(metric, s, standard);
    }
  }
}

// ============================================================================
// Metadata
// ============================================================================

/**
 * Get information about available growth standards
 */
export function getAvailableStandards(): Array<{
  standard: GrowthStandardType;
  metric: GrowthMetric;
  sex: BiologicalSex;
  ageRange: { min: number; max: number };
  description: string;
}> {
  const standards: Array<{
    standard: GrowthStandardType;
    metric: GrowthMetric;
    sex: BiologicalSex;
    ageRange: { min: number; max: number };
    description: string;
  }> = [];

  for (const key in datasetRegistry) {
    const dataset = datasetRegistry[key];
    standards.push({
      standard: dataset.standard,
      metric: dataset.metric,
      sex: dataset.sex,
      ageRange: { min: dataset.ageRangeMin, max: dataset.ageRangeMax },
      description: dataset.description
    });
  }

  return standards;
}

// ============================================================================
// Export Default Service Object
// ============================================================================

export const HealthDataService = {
  getGrowthStandard,
  getAllGrowthStandards,
  isGrowthStandardAvailable,
  getAgeRange,
  preloadGrowthStandards,
  getAvailableStandards,
  clearCache,
  getCacheStats
};

export default HealthDataService;
