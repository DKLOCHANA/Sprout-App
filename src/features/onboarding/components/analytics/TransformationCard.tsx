/**
 * TransformationCard - Template 2 (Q2: Check Frequency)
 * Dramatic before→after with animated improvement counter.
 * Shows the user how Sprout transforms their worry into confidence.
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography, radii } from '@core/theme';
import { TransformationData } from '@core/data/onboarding';

interface TransformationCardProps {
  data: TransformationData;
}

export function TransformationCard({ data }: TransformationCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const beforeSlide = useRef(new Animated.Value(-40)).current;
  const afterSlide = useRef(new Animated.Value(40)).current;
  const counterAnim = useRef(new Animated.Value(0)).current;
  const badgeScale = useRef(new Animated.Value(0)).current;
  const statAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(200, [
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // Slide before card from left
      Animated.spring(beforeSlide, {
        toValue: 0,
        friction: 8,
        tension: 50,
        useNativeDriver: true,
      }),
      // Slide after card from right
      Animated.spring(afterSlide, {
        toValue: 0,
        friction: 8,
        tension: 50,
        useNativeDriver: true,
      }),
      // Animate counter
      Animated.timing(counterAnim, {
        toValue: data.improvementPercent,
        duration: 1000,
        useNativeDriver: false,
      }),
      // Pop in the badge
      Animated.spring(badgeScale, {
        toValue: 1,
        friction: 5,
        tension: 60,
        useNativeDriver: true,
      }),
      // Slide up bottom stat
      Animated.spring(statAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [data.improvementPercent]);

  // Animated counter text
  const counterText = counterAnim.interpolate({
    inputRange: [0, data.improvementPercent],
    outputRange: ['0', String(data.improvementPercent)],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Before / After Cards */}
      <View style={styles.cardsRow}>
        {/* Before */}
        <Animated.View
          style={[
            styles.card,
            styles.beforeCard,
            { transform: [{ translateX: beforeSlide }] },
          ]}
        >
          <View style={styles.beforeIconWrap}>
            <MaterialCommunityIcons
              name="emoticon-sad-outline"
              size={28}
              color={colors.error}
            />
          </View>
          <Text style={styles.beforeValue}>{data.beforeValue}</Text>
          <Text style={styles.cardLabel}>{data.beforeLabel}</Text>
        </Animated.View>

        {/* Arrow divider */}
        <View style={styles.arrowWrap}>
          <LinearGradient
            colors={[colors.error + '40', colors.success + '40']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.arrowLine}
          />
          <View style={styles.arrowCircle}>
            <MaterialCommunityIcons
              name="arrow-right"
              size={18}
              color={colors.textOnPrimary}
            />
          </View>
        </View>

        {/* After */}
        <Animated.View
          style={[
            styles.card,
            styles.afterCard,
            { transform: [{ translateX: afterSlide }] },
          ]}
        >
          <View style={styles.afterIconWrap}>
            <MaterialCommunityIcons
              name="emoticon-happy-outline"
              size={28}
              color={colors.success}
            />
          </View>
          <Text style={styles.afterValue}>{data.afterValue}</Text>
          <Text style={styles.cardLabel}>{data.afterLabel}</Text>
        </Animated.View>
      </View>

      {/* Improvement Badge */}
      <Animated.View
        style={[
          styles.improvementBadge,
          { transform: [{ scale: badgeScale }] },
        ]}
      >
        <LinearGradient
          colors={[colors.success, '#2E9B6A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.improvementGradient}
        >
          <MaterialCommunityIcons
            name="trending-down"
            size={20}
            color={colors.textOnPrimary}
          />
          <Text style={styles.improvementNumber}>
            {data.improvementPercent}%
          </Text>
          <Text style={styles.improvementLabel}>{data.improvementLabel}</Text>
        </LinearGradient>
      </Animated.View>

      {/* Bottom Stat */}
      <Animated.View
        style={[
          styles.bottomStat,
          {
            opacity: statAnim,
            transform: [
              {
                translateY: statAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [15, 0],
                }),
              },
            ],
          },
        ]}
      >
        <MaterialCommunityIcons
          name={data.stat.icon as any}
          size={20}
          color={colors.primary}
        />
        <Text style={styles.bottomStatValue}>{data.stat.value}</Text>
        <Text style={styles.bottomStatLabel}>{data.stat.label}</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'center',
  },
  cardsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  card: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radii.lg,
    alignItems: 'center',
  },
  beforeCard: {
    backgroundColor: colors.errorDim,
    borderWidth: 1,
    borderColor: colors.error + '20',
  },
  afterCard: {
    backgroundColor: colors.successDim,
    borderWidth: 1,
    borderColor: colors.success + '20',
  },
  beforeIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.error + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  afterIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.success + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  beforeValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.error,
    lineHeight: 28,
  },
  afterValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.success,
    lineHeight: 28,
  },
  cardLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
  },
  arrowWrap: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  arrowLine: {
    width: 2,
    height: 40,
    borderRadius: 1,
    marginBottom: -8,
  },
  arrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  improvementBadge: {
    marginBottom: spacing.md,
    borderRadius: radii.lg,
    overflow: 'hidden',
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  improvementGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  improvementNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textOnPrimary,
    lineHeight: 32,
  },
  improvementLabel: {
    ...typography.body,
    color: colors.textOnPrimary,
    fontWeight: '600',
    opacity: 0.9,
  },
  bottomStat: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSecondary,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radii.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  bottomStatValue: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  bottomStatLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
});
