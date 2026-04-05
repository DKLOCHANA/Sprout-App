/**
 * Growth Alert Detection
 * 
 * Detects concerning growth patterns that may warrant medical attention.
 * Implements clinical guidelines for growth monitoring.
 */

import type {
  GrowthEntry,
  GrowthAlert,
  GrowthAlertType,
  GrowthAlertSeverity,
  GrowthMetric
} from '../../features/growth/types/growth.types';
import { getPercentileCategory, PERCENTILE_RANGES } from '../../features/growth/types/growth.types';

// ============================================================================
// Alert Detection Configuration
// ============================================================================

const ALERT_THRESHOLDS = {
  PERCENTILE_DROP: 20,           // Drop of >20 percentile points (≈2 major percentile lines)
  PERCENTILE_RISE: 25,           // Rapid rise of >25 percentile points
  LOW_PERCENTILE: 3,             // Below 3rd percentile
  HIGH_PERCENTILE: 97,           // Above 97th percentile
  PLATEAU_COUNT: 3,              // No growth over 3 consecutive measurements
  PLATEAU_TOLERANCE: 0.5,        // Tolerance for "no growth" (kg or cm)
  MIN_ENTRIES_FOR_TREND: 2       // Minimum entries needed to detect trends
} as const;

// ============================================================================
// Main Alert Detection Function
// ============================================================================

/**
 * Detect all growth alerts for a baby's growth entries
 * 
 * @param entries - Array of growth entries (should be sorted by date, oldest first)
 * @param babyId - Baby's ID
 * @returns Array of detected growth alerts
 */
export function detectGrowthAlerts(
  entries: GrowthEntry[],
  babyId: string
): GrowthAlert[] {
  if (entries.length === 0) {
    return [];
  }

  const alerts: GrowthAlert[] = [];

  // Sort entries by date (oldest first) to ensure chronological order
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Check each metric
  alerts.push(...detectWeightAlerts(sortedEntries, babyId));
  alerts.push(...detectHeightAlerts(sortedEntries, babyId));
  alerts.push(...detectHeadCircumferenceAlerts(sortedEntries, babyId));

  return alerts;
}

// ============================================================================
// Metric-Specific Alert Detection
// ============================================================================

/**
 * Detect alerts for weight measurements
 */
function detectWeightAlerts(entries: GrowthEntry[], babyId: string): GrowthAlert[] {
  const weightEntries = entries.filter(e => e.weightKg !== null && e.weightPercentile !== undefined);
  return detectAlertsForMetric(weightEntries, babyId, 'weight', 'weightKg', 'weightPercentile');
}

/**
 * Detect alerts for height measurements
 */
function detectHeightAlerts(entries: GrowthEntry[], babyId: string): GrowthAlert[] {
  const heightEntries = entries.filter(e => e.heightCm !== null && e.heightPercentile !== undefined);
  return detectAlertsForMetric(heightEntries, babyId, 'length', 'heightCm', 'heightPercentile');
}

/**
 * Detect alerts for head circumference measurements
 */
function detectHeadCircumferenceAlerts(entries: GrowthEntry[], babyId: string): GrowthAlert[] {
  const hcEntries = entries.filter(e => e.headCircumferenceCm !== null && e.headCircumferencePercentile !== undefined);
  return detectAlertsForMetric(hcEntries, babyId, 'headCircumference', 'headCircumferenceCm', 'headCircumferencePercentile');
}

/**
 * Generic alert detection for any metric
 */
function detectAlertsForMetric(
  entries: GrowthEntry[],
  babyId: string,
  metric: GrowthMetric,
  valueKey: 'weightKg' | 'heightCm' | 'headCircumferenceCm',
  percentileKey: 'weightPercentile' | 'heightPercentile' | 'headCircumferencePercentile'
): GrowthAlert[] {
  if (entries.length < ALERT_THRESHOLDS.MIN_ENTRIES_FOR_TREND) {
    return [];
  }

  const alerts: GrowthAlert[] = [];

  // Check latest measurement for outliers
  const latest = entries[entries.length - 1];
  const latestPercentile = latest[percentileKey];
  
  if (latestPercentile !== undefined) {
    // Check for very low percentile
    if (latestPercentile < ALERT_THRESHOLDS.LOW_PERCENTILE) {
      alerts.push(createOutlierAlert(babyId, metric, latestPercentile, latest[valueKey]!, 'low'));
    }
    
    // Check for very high percentile
    if (latestPercentile > ALERT_THRESHOLDS.HIGH_PERCENTILE) {
      alerts.push(createOutlierAlert(babyId, metric, latestPercentile, latest[valueKey]!, 'high'));
    }
  }

  // Check for percentile drops
  if (entries.length >= 2) {
    const percentileDropAlert = detectPercentileDrop(entries, babyId, metric, percentileKey);
    if (percentileDropAlert) {
      alerts.push(percentileDropAlert);
    }

    const percentileRiseAlert = detectRapidPercentileRise(entries, babyId, metric, percentileKey);
    if (percentileRiseAlert) {
      alerts.push(percentileRiseAlert);
    }
  }

  // Check for growth plateau
  if (entries.length >= ALERT_THRESHOLDS.PLATEAU_COUNT) {
    const plateauAlert = detectGrowthPlateau(entries, babyId, metric, valueKey);
    if (plateauAlert) {
      alerts.push(plateauAlert);
    }
  }

  return alerts;
}

// ============================================================================
// Specific Alert Creators
// ============================================================================

/**
 * Create alert for outlier percentile (too low or too high)
 */
function createOutlierAlert(
  babyId: string,
  metric: GrowthMetric,
  percentile: number,
  value: number,
  direction: 'low' | 'high'
): GrowthAlert {
  const metricLabel = getMetricLabel(metric);
  const unit = getMetricUnit(metric);
  
  const isLow = direction === 'low';
  const message = isLow 
    ? `${metricLabel} is below 3rd percentile`
    : `${metricLabel} is above 97th percentile`;
  
  const explanation = isLow
    ? `Your baby's ${metricLabel.toLowerCase()} (${value.toFixed(1)}${unit}) is at the ${percentile.toFixed(1)}th percentile, which is below the typical range.`
    : `Your baby's ${metricLabel.toLowerCase()} (${value.toFixed(1)}${unit}) is at the ${percentile.toFixed(1)}th percentile, which is above the typical range.`;
  
  const recommendation = isLow
    ? 'Consider discussing this with your pediatrician to ensure adequate nutrition and rule out any underlying issues.'
    : 'This may be normal for your baby, but it\'s worth discussing with your pediatrician to ensure healthy development.';

  return {
    id: `alert-${babyId}-${metric}-outlier-${Date.now()}`,
    babyId,
    type: 'percentile_outlier',
    severity: isLow ? 'urgent' : 'warning',
    metric,
    message,
    explanation,
    recommendation,
    currentValue: value,
    currentPercentile: percentile,
    detectedAt: new Date().toISOString(),
    dismissed: false
  };
}

/**
 * Detect significant percentile drop
 */
function detectPercentileDrop(
  entries: GrowthEntry[],
  babyId: string,
  metric: GrowthMetric,
  percentileKey: 'weightPercentile' | 'heightPercentile' | 'headCircumferencePercentile'
): GrowthAlert | null {
  const latest = entries[entries.length - 1];
  const previous = entries[entries.length - 2];
  
  const latestPercentile = latest[percentileKey];
  const previousPercentile = previous[percentileKey];
  
  if (latestPercentile === undefined || previousPercentile === undefined) {
    return null;
  }

  const drop = previousPercentile - latestPercentile;
  
  if (drop >= ALERT_THRESHOLDS.PERCENTILE_DROP) {
    const metricLabel = getMetricLabel(metric);
    
    return {
      id: `alert-${babyId}-${metric}-drop-${Date.now()}`,
      babyId,
      type: 'percentile_drop',
      severity: drop >= 30 ? 'urgent' : 'warning',
      metric,
      message: `${metricLabel} percentile dropped significantly`,
      explanation: `Your baby's ${metricLabel.toLowerCase()} percentile dropped from ${previousPercentile.toFixed(0)}th to ${latestPercentile.toFixed(0)}th percentile (${drop.toFixed(0)} percentile points).`,
      recommendation: 'A significant drop in percentiles may indicate a growth concern. Please consult with your pediatrician.',
      currentPercentile: latestPercentile,
      previousPercentile: previousPercentile,
      percentileChange: -drop,
      detectedAt: new Date().toISOString(),
      dismissed: false
    };
  }

  return null;
}

/**
 * Detect rapid percentile rise
 */
function detectRapidPercentileRise(
  entries: GrowthEntry[],
  babyId: string,
  metric: GrowthMetric,
  percentileKey: 'weightPercentile' | 'heightPercentile' | 'headCircumferencePercentile'
): GrowthAlert | null {
  const latest = entries[entries.length - 1];
  const previous = entries[entries.length - 2];
  
  const latestPercentile = latest[percentileKey];
  const previousPercentile = previous[percentileKey];
  
  if (latestPercentile === undefined || previousPercentile === undefined) {
    return null;
  }

  const rise = latestPercentile - previousPercentile;
  
  // Only alert on weight gain, not height (rapid height gain is less concerning)
  if (metric === 'weight' && rise >= ALERT_THRESHOLDS.PERCENTILE_RISE) {
    const metricLabel = getMetricLabel(metric);
    
    return {
      id: `alert-${babyId}-${metric}-rise-${Date.now()}`,
      babyId,
      type: 'rapid_gain',
      severity: 'info',
      metric,
      message: `${metricLabel} percentile increased rapidly`,
      explanation: `Your baby's ${metricLabel.toLowerCase()} percentile rose from ${previousPercentile.toFixed(0)}th to ${latestPercentile.toFixed(0)}th percentile (${rise.toFixed(0)} percentile points).`,
      recommendation: 'Rapid weight gain may be normal during growth spurts, but discuss with your pediatrician if you have concerns about feeding or development.',
      currentPercentile: latestPercentile,
      previousPercentile: previousPercentile,
      percentileChange: rise,
      detectedAt: new Date().toISOString(),
      dismissed: false
    };
  }

  return null;
}

/**
 * Detect growth plateau
 */
function detectGrowthPlateau(
  entries: GrowthEntry[],
  babyId: string,
  metric: GrowthMetric,
  valueKey: 'weightKg' | 'heightCm' | 'headCircumferenceCm'
): GrowthAlert | null {
  const recentEntries = entries.slice(-ALERT_THRESHOLDS.PLATEAU_COUNT);
  
  // Check if all values are within tolerance
  const values = recentEntries.map(e => e[valueKey]!).filter(v => v !== null);
  if (values.length < ALERT_THRESHOLDS.PLATEAU_COUNT) {
    return null;
  }

  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue;

  if (range <= ALERT_THRESHOLDS.PLATEAU_TOLERANCE) {
    const metricLabel = getMetricLabel(metric);
    const unit = getMetricUnit(metric);
    
    return {
      id: `alert-${babyId}-${metric}-plateau-${Date.now()}`,
      babyId,
      type: 'growth_plateau',
      severity: 'warning',
      metric,
      message: `${metricLabel} shows no growth`,
      explanation: `Your baby's ${metricLabel.toLowerCase()} has remained at approximately ${values[0].toFixed(1)}${unit} over the last ${ALERT_THRESHOLDS.PLATEAU_COUNT} measurements.`,
      recommendation: 'A period of no growth may be normal, but if it persists, please discuss with your pediatrician.',
      currentValue: values[values.length - 1],
      detectedAt: new Date().toISOString(),
      dismissed: false
    };
  }

  return null;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get human-readable label for metric
 */
function getMetricLabel(metric: GrowthMetric): string {
  const labels: Record<GrowthMetric, string> = {
    weight: 'Weight',
    length: 'Length',
    height: 'Height',
    headCircumference: 'Head Circumference',
    bmi: 'BMI'
  };
  return labels[metric] || metric;
}

/**
 * Get unit for metric
 */
function getMetricUnit(metric: GrowthMetric): string {
  const units: Record<GrowthMetric, string> = {
    weight: 'kg',
    length: 'cm',
    height: 'cm',
    headCircumference: 'cm',
    bmi: ''
  };
  return units[metric] || '';
}

/**
 * Check if alert already exists (to prevent duplicates)
 */
export function isDuplicateAlert(
  newAlert: GrowthAlert,
  existingAlerts: GrowthAlert[]
): boolean {
  return existingAlerts.some(alert =>
    alert.babyId === newAlert.babyId &&
    alert.type === newAlert.type &&
    alert.metric === newAlert.metric &&
    !alert.dismissed
  );
}

/**
 * Filter out dismissed and duplicate alerts
 */
export function filterActiveAlerts(alerts: GrowthAlert[]): GrowthAlert[] {
  return alerts.filter(alert => !alert.dismissed);
}

/**
 * Sort alerts by severity (urgent > warning > info)
 */
export function sortAlertsBySeverity(alerts: GrowthAlert[]): GrowthAlert[] {
  const severityOrder: Record<GrowthAlertSeverity, number> = {
    urgent: 0,
    warning: 1,
    info: 2
  };

  return [...alerts].sort((a, b) => {
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
}
