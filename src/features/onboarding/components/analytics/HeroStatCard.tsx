/**
 * HeroStatCard - Template 1 (Q1: Primary Concern)
 * Eye-catching animated ring with bold center stat, icon badge, and 3 mini stat pills.
 * Designed to immediately show the value of tracking the user's specific concern.
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop, G } from 'react-native-svg';
import { colors, spacing, typography, radii } from '@core/theme';
import { HeroStatData } from '@core/data/onboarding';

interface HeroStatCardProps {
  data: HeroStatData;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function HeroStatCard({ data }: HeroStatCardProps) {
  const ringAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pillAnims = useRef(data.pills.map(() => new Animated.Value(0))).current;

  const size = 180;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    // Staggered entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.timing(ringAnim, {
        toValue: data.ringPercentage,
        duration: 1400,
        useNativeDriver: true,
      }),
      // Stagger pill animations
      ...pillAnims.map((anim, i) =>
        Animated.spring(anim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          delay: 600 + i * 150,
          useNativeDriver: true,
        })
      ),
    ]).start();
  }, [data.ringPercentage]);

  const strokeDashoffset = ringAnim.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {/* Ring + Center Stat */}
      <View style={styles.ringWrapper}>
        {/* Glow effect */}
        <View style={[styles.ringGlow, { shadowColor: data.ringColor }]} />

        <Svg width={size} height={size}>
          <Defs>
            <SvgGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={data.ringColor} stopOpacity="1" />
              <Stop offset="100%" stopColor={colors.primary} stopOpacity="1" />
            </SvgGradient>
          </Defs>
          <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
            {/* Background track */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={colors.surfaceTertiary}
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Animated ring */}
            <AnimatedCircle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="url(#ringGrad)"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </G>
        </Svg>

        {/* Center content */}
        <View style={styles.centerContent}>
          <View style={[styles.iconBadge, { backgroundColor: data.ringColor + '20' }]}>
            <MaterialCommunityIcons
              name={data.icon as any}
              size={22}
              color={data.ringColor}
            />
          </View>
          <Text style={[styles.ringLabel, { color: data.ringColor }]}>
            {data.ringLabel}
          </Text>
          <Text style={styles.ringSublabel}>{data.ringSublabel}</Text>
        </View>
      </View>

      {/* Description */}
      <Text style={styles.description}>{data.description}</Text>

      {/* Mini stat pills */}
      <View style={styles.pillsRow}>
        {data.pills.map((pill, index) => (
          <Animated.View
            key={index}
            style={[
              styles.pill,
              {
                opacity: pillAnims[index],
                transform: [
                  {
                    translateY: pillAnims[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={[colors.surface, colors.surfaceSecondary]}
              style={styles.pillGradient}
            >
              <MaterialCommunityIcons
                name={pill.icon as any}
                size={18}
                color={data.ringColor}
              />
              <Text style={styles.pillValue}>{pill.value}</Text>
              <Text style={styles.pillLabel}>{pill.label}</Text>
            </LinearGradient>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringWrapper: {
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  ringGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  ringLabel: {
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 32,
  },
  ringSublabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '500',
    marginTop: -2,
  },
  description: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
    lineHeight: 20,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    width: '100%',
  },
  pill: {
    flex: 1,
    borderRadius: radii.md,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  pillGradient: {
    padding: spacing.sm,
    alignItems: 'center',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  pillValue: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 4,
  },
  pillLabel: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 1,
  },
});
