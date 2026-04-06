/**
 * PercentileChart Analytics Component
 * Compact percentile visualization for growth tracking
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography, radii } from '@core/theme';
import { PercentileChartData } from '@core/data/onboarding';

interface PercentileChartProps {
  data: PercentileChartData;
}

export function PercentileChart({ data }: PercentileChartProps) {
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animatedOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(animatedWidth, {
        toValue: data.percentile,
        duration: 1200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [data.percentile]);

  const widthInterpolate = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: animatedOpacity }]}>
      <View style={styles.chartContainer}>
        {/* Zone labels */}
        <View style={styles.zoneLabels}>
          <Text style={styles.zoneLabelText}>Low</Text>
          <Text style={[styles.zoneLabelText, styles.zoneLabelNormal]}>Normal</Text>
          <Text style={styles.zoneLabelText}>High</Text>
        </View>

        {/* Percentile zones */}
        <View style={styles.zonesContainer}>
          <LinearGradient
            colors={['#FFE4B8', '#FFEAA7']}
            style={styles.zone}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
          <LinearGradient
            colors={['#C8E6C9', '#A5D6A7']}
            style={[styles.zone, styles.zoneNormal]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
          <LinearGradient
            colors={['#FFEAA7', '#FFE4B8']}
            style={styles.zone}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </View>

        {/* Percentile marker */}
        <Animated.View 
          style={[
            styles.markerContainer,
            { left: widthInterpolate }
          ]}
        >
          <View style={styles.marker}>
            <LinearGradient
              colors={[colors.secondaryGradientStart, colors.secondaryGradientEnd]}
              style={styles.markerGradient}
            >
              <Text style={styles.markerText}>{data.percentile}%</Text>
            </LinearGradient>
          </View>
          <View style={styles.markerLine} />
          <View style={styles.markerDot} />
        </Animated.View>

        {/* Labels */}
        <View style={styles.labelsContainer}>
          <Text style={styles.labelText}>0%</Text>
          <Text style={styles.labelText}>50%</Text>
          <Text style={styles.labelText}>100%</Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.percentileBadge}>
          <MaterialCommunityIcons
            name="check-circle"
            size={18}
            color={colors.success}
          />
          <Text style={styles.percentileLabel}>{data.label}</Text>
        </View>
        <Text style={styles.description}>{data.description}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'center',
  },
  chartContainer: {
    height: 110,
    marginBottom: spacing.md,
  },
  zoneLabels: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  zoneLabelText: {
    flex: 1,
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
  zoneLabelNormal: {
    color: colors.success,
    fontWeight: '600',
  },
  zonesContainer: {
    flexDirection: 'row',
    height: 40,
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  zone: {
    flex: 1,
  },
  zoneNormal: {
    flex: 1.5,
  },
  markerContainer: {
    position: 'absolute',
    top: 10,
    alignItems: 'center',
    marginLeft: -24,
  },
  marker: {
    borderRadius: radii.sm,
    overflow: 'hidden',
  },
  markerGradient: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  markerText: {
    ...typography.caption,
    color: colors.textOnPrimary,
    fontWeight: '700',
  },
  markerLine: {
    width: 2,
    height: 32,
    backgroundColor: colors.primary,
    borderRadius: 1,
  },
  markerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  labelText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  infoContainer: {
    alignItems: 'center',
  },
  percentileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  percentileLabel: {
    ...typography.body,
    color: colors.success,
    fontWeight: '600',
  },
  description: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
