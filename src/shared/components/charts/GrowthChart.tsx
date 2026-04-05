/**
 * Growth Chart Component
 * 
 * Displays WHO/CDC percentile curves with baby's growth trajectory
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import type { GrowthEntry } from '@/features/growth/types/growth.types';
import type { Baby } from '@/features/baby-profile/types';
import { colors, typography, spacing } from '@/core/theme';
import HealthDataService from '@/core/api/healthDataService';
import { percentileToMeasurement } from '@/shared/utils/growthCalculations';

interface GrowthChartProps {
  baby: Baby;
  entries: GrowthEntry[];
  metric: 'weight' | 'height' | 'headCircumference';
  height?: number;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_WIDTH = SCREEN_WIDTH - spacing.md - spacing.xl; // Less margin on left, more on right

// Percentile lines to display
const PERCENTILE_LINES = [3, 15, 50, 85, 97];

// Colors for percentile lines
const PERCENTILE_COLORS = {
  3: colors.chartLine,       // Light red
  15: colors.chartLineSecondary,   // Light orange
  50: colors.primary, // Primary color
  85: colors.chartLineSecondary,   // Light orange  
  97: colors.chartLine,   // Light red
};

export function GrowthChart({ baby, entries, metric, height = 280 }: GrowthChartProps) {
  // Load growth standard
  const standard = useMemo(() => {
    const metricMap = {
      weight: 'weight',
      height: 'length',
      headCircumference: 'headCircumference'
    } as const;
    
    return HealthDataService.getGrowthStandard(
      metricMap[metric],
      baby.biologicalSex,
      'WHO'
    );
  }, [baby.biologicalSex, metric]);

  // Prepare data for baby's actual measurements
  const babyData = useMemo(() => {
    if (!entries || entries.length === 0) return [];

    const key = metric === 'weight' ? 'weightKg' : 
                metric === 'height' ? 'heightCm' : 
                'headCircumferenceCm';

    return entries
      .filter(entry => entry[key] !== null)
      .map(entry => ({
        x: entry.ageInDays,
        y: entry[key] as number,
      }))
      .sort((a, b) => a.x - b.x);
  }, [entries, metric]);

  // Generate percentile curves
  const percentileCurves = useMemo(() => {
    if (!standard) return [];

    const maxAge = Math.min(180, standard.ageRangeMax); // Show up to 6 months
    const agePoints = Array.from({ length: 30 }, (_, i) => i * (maxAge / 29));

    return PERCENTILE_LINES.map(percentile => {
      const data = agePoints.map(age => {
        const measurement = percentileToMeasurement(
          percentile,
          age,
          baby.biologicalSex,
          metric === 'weight' ? 'weight' : metric === 'height' ? 'length' : 'headCircumference',
          standard
        );
        return measurement ? { x: age, y: measurement } : null;
      }).filter(point => point !== null);

      return {
        percentile,
        data,
        color: PERCENTILE_COLORS[percentile as keyof typeof PERCENTILE_COLORS],
      };
    });
  }, [standard, baby.biologicalSex, metric]);

  // Calculate axis ranges
  const { xDomain, yDomain } = useMemo(() => {
    if (percentileCurves.length === 0 || !babyData || babyData.length === 0) {
      return { xDomain: [0, 180], yDomain: [0, 10] };
    }

    const maxAgeInData = Math.max(...babyData.map(d => d.x), 90); // At least 3 months
    const xMax = Math.min(maxAgeInData + 30, 180); // Add padding, cap at 6 months

    // Find y range from percentile curves
    const allYValues = percentileCurves.flatMap(curve => 
      curve.data.filter(d => d.x <= xMax).map(d => d.y)
    );
    const yMin = Math.min(...allYValues, ...babyData.map(d => d.y));
    const yMax = Math.max(...allYValues, ...babyData.map(d => d.y));
    const yPadding = (yMax - yMin) * 0.1;

    return {
      xDomain: [0, xMax],
      yDomain: [Math.max(0, yMin - yPadding), yMax + yPadding],
    };
  }, [percentileCurves, babyData]);

  if (!standard) {
    return (
      <View style={[styles.container, { height }]}>
        <Text style={styles.errorText}>Growth standard not available</Text>
      </View>
    );
  }

  if (babyData.length === 0) {
    return (
      <View style={[styles.container, { height }]}>
        <Text style={styles.emptyText}>No growth data yet</Text>
        <Text style={styles.emptySubtext}>Add your first measurement below</Text>
      </View>
    );
  }

  // Prepare chart data
  const chartData = useMemo(() => {
    if (babyData.length === 0) return null;

    // Create time-based X-axis (0 to maxAge in steps)
    const maxAge = Math.max(...babyData.map(d => d.x));
    const ageStep = Math.ceil(maxAge / 6); // 6-7 labels
    const timePoints = Array.from({ length: 7 }, (_, i) => i * ageStep);
    
    // X-axis labels (age in months)
    const labels = timePoints.map(days => {
      const months = Math.floor(days / 30);
      return months === 0 ? 'Birth' : `${months}mo`;
    });

    // Interpolate baby's data to match time points
    const babyValues = timePoints.map(targetAge => {
      // Find closest data point
      const closest = babyData.reduce((prev, curr) => 
        Math.abs(curr.x - targetAge) < Math.abs(prev.x - targetAge) ? curr : prev
      );
      // Only use if within 10 days
      return Math.abs(closest.x - targetAge) < 10 ? closest.y : null;
    });

    // Build datasets
    const datasets = [
      {
        data: babyValues.map((v, i) => v !== null ? v : (i === 0 ? 0 : babyValues[i-1] || 0)), // Fill nulls for chart
        color: (opacity = 1) => `rgba(74, 144, 217, ${opacity})`,
        strokeWidth: 3,
      },
    ];

    // Add 50th percentile reference line
    const p50Curve = percentileCurves.find(c => c.percentile === 50);
    if (p50Curve) {
      const p50Values = timePoints.map(age => {
        const point = p50Curve.data.find(p => Math.abs(p.x - age) < ageStep/2);
        return point ? point.y : null;
      });
      
      if (p50Values.some(v => v !== null)) {
        datasets.push({
          data: p50Values.map((v, i) => v !== null ? v : (i === 0 ? 0 : p50Values[i-1] || 0)),
          color: (opacity = 1) => `rgba(158, 158, 158, ${opacity * 0.5})`,
          strokeWidth: 1,
        });
      }
    }

    return { labels, datasets };
  }, [babyData, percentileCurves]);

  if (!chartData) {
    return (
      <View style={[styles.container, { height }]}>
        <Text style={styles.emptyText}>No growth data yet</Text>
        <Text style={styles.emptySubtext}>Add your first measurement below</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }]}>
      <LineChart
        data={chartData}
        width={CHART_WIDTH}
        height={height - 40} // Account for legend
        chartConfig={{
          backgroundColor: colors.surface,
          backgroundGradientFrom: colors.surface,
          backgroundGradientTo: colors.surface,
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: colors.surface,
          },
        }}
        bezier
        style={{
          marginVertical: 0, // Remove vertical margin
          borderRadius: 12,
        }}
        withInnerLines
        withOuterLines={false}
        withVerticalLines={false}
        withHorizontalLines
        segments={4}
      />
      
      {/* Chart legend at bottom */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.secondary }]} />
          <Text style={styles.legendText}>Baby's growth</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.chartReference }]} />
          <Text style={styles.legendText}>50th percentile</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    marginTop: spacing.xs, // Reduced spacing
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    textAlign: 'center',
  },
  emptyText: {
    ...typography.h3,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
