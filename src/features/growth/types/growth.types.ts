/**
 * WHO/CDC Growth Standards Type Definitions
 * 
 * These types define the structure for growth standards data,
 * percentile calculations, and growth alerts.
 */

// ============================================================================
// Growth Standards (WHO/CDC Data)
// ============================================================================

export type GrowthMetric = 'weight' | 'length' | 'height' | 'headCircumference' | 'bmi';
export type GrowthStandardType = 'WHO' | 'CDC';
export type BiologicalSex = 'male' | 'female';

/**
 * Single data point in WHO/CDC growth standard with LMS parameters
 * L = Lambda (skewness/power transformation)
 * M = Mu (median value)
 * S = Sigma (coefficient of variation)
 */
export interface GrowthStandard {
  ageInDays: number;
  L: number;  // Lambda - Box-Cox transformation parameter
  M: number;  // Mu - Median value for this age
  S: number;  // Sigma - Coefficient of variation
}

/**
 * Complete growth standard dataset for a specific metric, sex, and standard
 */
export interface GrowthStandardSet {
  metric: GrowthMetric;
  sex: BiologicalSex;
  standard: GrowthStandardType;
  ageRangeMin: number;  // Minimum age in days
  ageRangeMax: number;  // Maximum age in days
  unit: 'kg' | 'cm' | 'lbs' | 'in';
  description: string;
  source?: string;
  data: GrowthStandard[];
}

// ============================================================================
// Growth Entry (Enhanced)
// ============================================================================

/**
 * Enhanced growth entry with calculated percentiles and z-scores
 * Extends the basic growth measurement with clinical analytics
 */
export interface GrowthEntry {
  // Basic measurement data
  id: string;
  babyId: string;
  date: string;  // ISO date string
  
  // Measurements (nullable - not all metrics measured every time)
  weightKg: number | null;
  heightCm: number | null;
  headCircumferenceCm: number | null;
  
  // Optional notes
  notes?: string;
  
  // Calculated percentiles (0-100)
  weightPercentile?: number;
  heightPercentile?: number;
  headCircumferencePercentile?: number;
  
  // Calculated z-scores (standard deviations from median)
  weightZScore?: number;
  heightZScore?: number;
  headCircumferenceZScore?: number;
  
  // Age at measurement (for premature babies, this may differ from chronological age)
  ageInDays: number;
  adjustedAgeInDays?: number;  // For premature babies
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Growth Analysis
// ============================================================================

/**
 * Percentile calculation result
 */
export interface PercentileResult {
  percentile: number;  // 0-100
  zScore: number;      // Standard deviations from median
  measurement: number;
  ageInDays: number;
  metric: GrowthMetric;
  sex: BiologicalSex;
  standard: GrowthStandardType;
}

/**
 * Growth trend analysis result
 */
export interface GrowthTrend {
  metric: GrowthMetric;
  entries: GrowthEntry[];
  percentileChange: number;  // Change in percentile over time
  averagePercentile: number;
  latestPercentile?: number;
  isStable: boolean;         // True if percentile variation < 15
  isConcerning: boolean;     // True if dropped > 2 percentile lines
}

/**
 * Complete growth analysis for a baby
 */
export interface GrowthAnalysis {
  babyId: string;
  analyzedAt: string;
  
  weightTrend?: GrowthTrend;
  heightTrend?: GrowthTrend;
  headCircumferenceTrend?: GrowthTrend;
  
  alerts: GrowthAlert[];
  overallStatus: 'normal' | 'borderline' | 'concerning';
}

// ============================================================================
// Growth Alerts
// ============================================================================

export type GrowthAlertType = 
  | 'percentile_drop'        // Dropped >2 percentile lines
  | 'percentile_outlier'     // Below 3rd or above 97th percentile
  | 'growth_plateau'         // No growth over 3+ measurements
  | 'rapid_gain'             // Gained >2 percentile lines rapidly
  | 'measurement_missing';   // Missing expected measurements

export type GrowthAlertSeverity = 'info' | 'warning' | 'urgent';

/**
 * Growth alert for concerning patterns
 */
export interface GrowthAlert {
  id: string;
  babyId: string;
  type: GrowthAlertType;
  severity: GrowthAlertSeverity;
  metric: GrowthMetric;
  
  // Alert details
  message: string;
  explanation?: string;      // Why this is flagged
  recommendation?: string;   // What parents should do
  
  // Supporting data
  currentValue?: number;
  currentPercentile?: number;
  previousPercentile?: number;
  percentileChange?: number;
  
  // Metadata
  detectedAt: string;
  dismissed: boolean;
  dismissedAt?: string;
  dismissedBy?: string;
}

// ============================================================================
// Percentile Thresholds
// ============================================================================

/**
 * Percentile ranges for categorization
 */
export const PERCENTILE_RANGES = {
  VERY_LOW: { min: 0, max: 3, label: 'Below 3rd', color: '#DC2626' },      // red-600
  LOW: { min: 3, max: 15, label: '3rd-15th', color: '#F59E0B' },           // amber-500
  NORMAL: { min: 15, max: 85, label: '15th-85th', color: '#10B981' },      // emerald-500
  HIGH: { min: 85, max: 97, label: '85th-97th', color: '#F59E0B' },        // amber-500
  VERY_HIGH: { min: 97, max: 100, label: 'Above 97th', color: '#DC2626' }  // red-600
} as const;

/**
 * Get percentile category from value
 */
export function getPercentileCategory(percentile: number): keyof typeof PERCENTILE_RANGES {
  if (percentile < 3) return 'VERY_LOW';
  if (percentile < 15) return 'LOW';
  if (percentile < 85) return 'NORMAL';
  if (percentile < 97) return 'HIGH';
  return 'VERY_HIGH';
}

// ============================================================================
// Growth Chart Configuration
// ============================================================================

/**
 * Percentile lines to display on growth charts
 */
export const PERCENTILE_LINES = [3, 15, 50, 85, 97] as const;

/**
 * Chart configuration for a specific metric
 */
export interface GrowthChartConfig {
  metric: GrowthMetric;
  title: string;
  yAxisLabel: string;
  unit: string;
  percentileLines: readonly number[];
  minAge: number;  // days
  maxAge: number;  // days
}

// ============================================================================
// Helper Types
// ============================================================================

/**
 * Age calculation result (extends existing BabyAge type)
 */
export interface BabyAge {
  days: number;
  weeks: number;
  months: number;
  years: number;
  adjustedDays?: number;
  adjustedWeeks?: number;
  adjustedMonths?: number;
}

/**
 * Baby profile (reference - actual definition in baby-profile feature)
 */
export interface BabyReference {
  id: string;
  dateOfBirth: string;
  biologicalSex: BiologicalSex;
  isPremature: boolean;
  originalDueDate?: string;
}
