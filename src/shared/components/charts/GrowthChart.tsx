/**
 * Growth Chart Component
 * 
 * Displays WHO percentile bands (3rd-97th) with baby's growth trajectory
 * using react-native-svg for full control over shaded regions.
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Line, Text as SvgText, Circle, G, Defs, LinearGradient, Stop } from 'react-native-svg';
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

const PADDING = { top: 20, right: 20, bottom: 40, left: 44 };

const PERCENTILE_LINES = [3, 15, 50, 85, 97] as const;

const BAND_FILLS = {
  outer: 'rgba(229, 115, 115, 0.10)',  // 3rd-15th and 85th-97th (light red)
  inner: 'rgba(16, 185, 129, 0.10)',   // 15th-85th (light green)
};

const PERCENTILE_LINE_STYLES: Record<number, { color: string; width: number; dash?: string }> = {
  3:  { color: 'rgba(229, 115, 115, 0.5)', width: 1, dash: '4,4' },
  15: { color: 'rgba(245, 166, 35, 0.5)',  width: 1, dash: '4,4' },
  50: { color: colors.primary,              width: 1.5 },
  85: { color: 'rgba(245, 166, 35, 0.5)',  width: 1, dash: '4,4' },
  97: { color: 'rgba(229, 115, 115, 0.5)', width: 1, dash: '4,4' },
};

const METRIC_LABELS: Record<string, string> = {
  weight: 'Weight (kg)',
  height: 'Height (cm)',
  headCircumference: 'Head Circ. (cm)',
};

const METRIC_KEY_MAP: Record<string, string> = {
  weight: 'weight',
  height: 'length',
  headCircumference: 'headCircumference',
};

function niceStep(range: number, targetTicks: number): number {
  const rough = range / targetTicks;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rough)));
  const residual = rough / magnitude;
  let nice: number;
  if (residual <= 1.5) nice = 1;
  else if (residual <= 3) nice = 2;
  else if (residual <= 7) nice = 5;
  else nice = 10;
  return nice * magnitude;
}

export function GrowthChart({ baby, entries, metric, height = 280 }: GrowthChartProps) {
  const chartWidth = SCREEN_WIDTH - spacing.md * 2;
  const plotWidth = chartWidth - PADDING.left - PADDING.right;
  const plotHeight = height - PADDING.top - PADDING.bottom;

  const standard = useMemo(() => {
    return HealthDataService.getGrowthStandard(
      METRIC_KEY_MAP[metric] as any,
      baby.biologicalSex,
      'WHO'
    );
  }, [baby.biologicalSex, metric]);

  const babyData = useMemo(() => {
    if (!entries || entries.length === 0) return [];
    const key = metric === 'weight' ? 'weightKg' :
                metric === 'height' ? 'heightCm' :
                'headCircumferenceCm';
    return entries
      .filter(entry => entry[key] !== null && entry[key] !== undefined)
      .map(entry => ({
        x: entry.ageInDays ?? 0,
        y: entry[key] as number,
      }))
      .sort((a, b) => a.x - b.x);
  }, [entries, metric]);

  const xDomain = useMemo(() => {
    if (babyData.length === 0) return { min: 0, max: 180 };
    const maxAge = Math.max(...babyData.map(d => d.x), 60);
    const padded = maxAge + 30;
    const capped = Math.min(padded, standard?.ageRangeMax ?? 1856);
    return { min: 0, max: capped };
  }, [babyData, standard]);

  const percentileCurves = useMemo(() => {
    if (!standard) return [];
    const numPoints = 40;
    const agePoints = Array.from({ length: numPoints }, (_, i) =>
      xDomain.min + (i / (numPoints - 1)) * (xDomain.max - xDomain.min)
    );

    return PERCENTILE_LINES.map(percentile => {
      const data = agePoints
        .map(age => {
          const m = percentileToMeasurement(
            percentile,
            age,
            baby.biologicalSex,
            METRIC_KEY_MAP[metric] as any,
            standard
          );
          return m !== null ? { x: age, y: m } : null;
        })
        .filter((p): p is { x: number; y: number } => p !== null);
      return { percentile, data };
    });
  }, [standard, baby.biologicalSex, metric, xDomain]);

  const yDomain = useMemo(() => {
    const allY: number[] = [];
    percentileCurves.forEach(c => c.data.forEach(d => allY.push(d.y)));
    babyData.forEach(d => allY.push(d.y));

    if (allY.length === 0) return { min: 0, max: 10 };

    const rawMin = Math.min(...allY);
    const rawMax = Math.max(...allY);
    const pad = (rawMax - rawMin) * 0.08;
    return {
      min: Math.max(0, rawMin - pad),
      max: rawMax + pad,
    };
  }, [percentileCurves, babyData]);

  const toSvgX = (val: number) =>
    PADDING.left + ((val - xDomain.min) / (xDomain.max - xDomain.min)) * plotWidth;
  const toSvgY = (val: number) =>
    PADDING.top + (1 - (val - yDomain.min) / (yDomain.max - yDomain.min)) * plotHeight;

  const pointsToPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    return points
      .map((p, i) => `${i === 0 ? 'M' : 'L'}${toSvgX(p.x).toFixed(2)},${toSvgY(p.y).toFixed(2)}`)
      .join(' ');
  };

  const buildBandPath = (
    upper: { x: number; y: number }[],
    lower: { x: number; y: number }[]
  ) => {
    if (upper.length === 0 || lower.length === 0) return '';
    const forwardPath = pointsToPath(upper);
    const reversedLower = [...lower].reverse();
    const backPath = reversedLower
      .map(p => `L${toSvgX(p.x).toFixed(2)},${toSvgY(p.y).toFixed(2)}`)
      .join(' ');
    return `${forwardPath} ${backPath} Z`;
  };

  const xTicks = useMemo(() => {
    const rangeDays = xDomain.max - xDomain.min;
    const stepDays = niceStep(rangeDays, 5) ;
    const roundedStep = Math.max(30, Math.round(stepDays / 30) * 30);
    const ticks: number[] = [];
    for (let d = 0; d <= xDomain.max; d += roundedStep) {
      ticks.push(d);
    }
    if (ticks[ticks.length - 1] < xDomain.max - roundedStep * 0.3) {
      ticks.push(xDomain.max);
    }
    return ticks;
  }, [xDomain]);

  const yTicks = useMemo(() => {
    const range = yDomain.max - yDomain.min;
    const step = niceStep(range, 5);
    const ticks: number[] = [];
    const start = Math.ceil(yDomain.min / step) * step;
    for (let v = start; v <= yDomain.max; v += step) {
      ticks.push(Math.round(v * 100) / 100);
    }
    return ticks;
  }, [yDomain]);

  const getCurveData = (p: number) =>
    percentileCurves.find(c => c.percentile === p)?.data ?? [];

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

  const babyLinePath = pointsToPath(babyData);
  const smoothBabyPath = babyData.length > 1 ? buildSmoothPath(babyData, toSvgX, toSvgY) : babyLinePath;

  return (
    <View style={[styles.container, { height: height + 36 }]}>
      <Svg width={chartWidth} height={height}>
        {/* Horizontal grid lines */}
        {yTicks.map(val => (
          <Line
            key={`grid-y-${val}`}
            x1={PADDING.left}
            y1={toSvgY(val)}
            x2={PADDING.left + plotWidth}
            y2={toSvgY(val)}
            stroke={colors.borderLight}
            strokeWidth={0.5}
          />
        ))}

        {/* Shaded bands */}
        {/* 3rd - 15th (outer lower) */}
        <Path
          d={buildBandPath(getCurveData(15), getCurveData(3))}
          fill={BAND_FILLS.outer}
        />
        {/* 15th - 85th (inner / normal) */}
        <Path
          d={buildBandPath(getCurveData(85), getCurveData(15))}
          fill={BAND_FILLS.inner}
        />
        {/* 85th - 97th (outer upper) */}
        <Path
          d={buildBandPath(getCurveData(97), getCurveData(85))}
          fill={BAND_FILLS.outer}
        />

        {/* Percentile lines */}
        {PERCENTILE_LINES.map(p => {
          const curve = getCurveData(p);
          const style = PERCENTILE_LINE_STYLES[p];
          if (curve.length === 0) return null;
          return (
            <G key={`pline-${p}`}>
              <Path
                d={pointsToPath(curve)}
                stroke={style.color}
                strokeWidth={style.width}
                strokeDasharray={style.dash}
                fill="none"
              />
              {/* Label at the right end */}
              <SvgText
                x={toSvgX(curve[curve.length - 1].x) + 2}
                y={toSvgY(curve[curve.length - 1].y) + (p <= 50 ? 10 : -4)}
                fontSize={8}
                fill={style.color}
                opacity={0.8}
              >
                {p === 50 ? '50th' : `${p}`}
              </SvgText>
            </G>
          );
        })}

        {/* Baby's growth line */}
        <Defs>
          <LinearGradient id="babyGrad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor={colors.chartBabyGrowth} stopOpacity={0.6} />
            <Stop offset="100%" stopColor={colors.chartBabyGrowth} stopOpacity={1} />
          </LinearGradient>
        </Defs>
        <Path
          d={smoothBabyPath}
          stroke="url(#babyGrad)"
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data point dots */}
        {babyData.map((point, i) => (
          <G key={`dot-${i}`}>
            <Circle
              cx={toSvgX(point.x)}
              cy={toSvgY(point.y)}
              r={4}
              fill={colors.surface}
              stroke={colors.chartBabyGrowth}
              strokeWidth={2}
            />
          </G>
        ))}

        {/* X-axis labels */}
        {xTicks.map(days => {
          const months = Math.round(days / 30.44);
          const label = days === 0 ? 'Birth' : `${months}mo`;
          return (
            <SvgText
              key={`xlabel-${days}`}
              x={toSvgX(days)}
              y={PADDING.top + plotHeight + 20}
              fontSize={10}
              fill={colors.textMuted}
              textAnchor="middle"
            >
              {label}
            </SvgText>
          );
        })}

        {/* Y-axis labels */}
        {yTicks.map(val => (
          <SvgText
            key={`ylabel-${val}`}
            x={PADDING.left - 8}
            y={toSvgY(val) + 3}
            fontSize={10}
            fill={colors.textMuted}
            textAnchor="end"
          >
            {Number.isInteger(val) ? val : val.toFixed(1)}
          </SvgText>
        ))}

        {/* Y-axis unit label */}
        <SvgText
          x={PADDING.left - 8}
          y={PADDING.top - 6}
          fontSize={9}
          fill={colors.textMuted}
          textAnchor="end"
        >
          {metric === 'weight' ? 'kg' : 'cm'}
        </SvgText>
      </Svg>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.chartBabyGrowth }]} />
          <Text style={styles.legendText}>Baby's growth</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendLine, { backgroundColor: colors.primary }]} />
          <Text style={styles.legendText}>50th percentile</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBand, { backgroundColor: 'rgba(16, 185, 129, 0.25)' }]} />
          <Text style={styles.legendText}>15th–85th</Text>
        </View>
      </View>
    </View>
  );
}

/**
 * Attempt monotone cubic spline for smoother baby line.
 * Falls back to straight segments for ≤2 points.
 */
function buildSmoothPath(
  points: { x: number; y: number }[],
  toSvgX: (v: number) => number,
  toSvgY: (v: number) => number
): string {
  if (points.length <= 2) {
    return points
      .map((p, i) => `${i === 0 ? 'M' : 'L'}${toSvgX(p.x).toFixed(2)},${toSvgY(p.y).toFixed(2)}`)
      .join(' ');
  }

  const svgPts = points.map(p => ({ x: toSvgX(p.x), y: toSvgY(p.y) }));
  let d = `M${svgPts[0].x.toFixed(2)},${svgPts[0].y.toFixed(2)}`;

  for (let i = 0; i < svgPts.length - 1; i++) {
    const p0 = svgPts[Math.max(0, i - 1)];
    const p1 = svgPts[i];
    const p2 = svgPts[i + 1];
    const p3 = svgPts[Math.min(svgPts.length - 1, i + 2)];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
  }

  return d;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
    marginTop: spacing.xs,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLine: {
    width: 16,
    height: 2,
    borderRadius: 1,
  },
  legendBand: {
    width: 14,
    height: 10,
    borderRadius: 2,
  },
  legendText: {
    ...typography.caption,
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
