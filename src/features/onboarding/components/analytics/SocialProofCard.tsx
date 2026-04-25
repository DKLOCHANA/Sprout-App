/**
 * SocialProofCard - Template 3 (Q3: Current Solution)
 * Animated success ring + parent count + testimonial with stars + feature highlights.
 * Final push before subscription — designed to convert.
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop, G } from 'react-native-svg';
import { colors, spacing, typography, radii } from '@core/theme';
import { SocialProofData } from '@core/data/onboarding';

interface SocialProofCardProps {
  data: SocialProofData;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function SocialProofCard({ data }: SocialProofCardProps) {
  const ringAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const quoteAnim = useRef(new Animated.Value(0)).current;
  const featureAnims = useRef(data.features.map(() => new Animated.Value(0))).current;

  const size = 140;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    Animated.parallel([
      // Main fade
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // Ring fill
      Animated.timing(ringAnim, {
        toValue: data.percentage,
        duration: 1400,
        useNativeDriver: true,
      }),
      // Quote card
      Animated.spring(quoteAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        delay: 500,
        useNativeDriver: true,
      }),
      // Stagger features
      ...featureAnims.map((anim, i) =>
        Animated.spring(anim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          delay: 800 + i * 120,
          useNativeDriver: true,
        })
      ),
    ]).start();
  }, [data.percentage]);

  const strokeDashoffset = ringAnim.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Ring + Percentage */}
      <View style={styles.ringRow}>
        <View style={styles.ringWrapper}>
          {/* Glow */}
          <View style={styles.ringGlow} />

          <Svg width={size} height={size}>
            <Defs>
              <SvgGradient id="proofRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={colors.success} stopOpacity="1" />
                <Stop offset="100%" stopColor="#2E9B6A" stopOpacity="1" />
              </SvgGradient>
            </Defs>
            <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={colors.surfaceTertiary}
                strokeWidth={strokeWidth}
                fill="none"
              />
              <AnimatedCircle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="url(#proofRingGrad)"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </G>
          </Svg>

          <View style={styles.centerContent}>
            <Text style={styles.percentageText}>{data.percentage}%</Text>
          </View>
        </View>

        <View style={styles.ringInfo}>
          <Text style={styles.percentageLabel}>{data.percentageLabel}</Text>
          <View style={styles.parentsBadge}>
            <MaterialCommunityIcons
              name="account-group"
              size={16}
              color={colors.primary}
            />
            <Text style={styles.parentsCount}>50,000+ parents</Text>
          </View>
        </View>
      </View>

      {/* Testimonial */}
      <Animated.View
        style={[
          styles.testimonialCard,
          {
            opacity: quoteAnim,
            transform: [
              {
                translateY: quoteAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.quoteIcon}>
          <MaterialCommunityIcons
            name="format-quote-open"
            size={18}
            color={colors.primary}
          />
        </View>
        <Text style={styles.testimonialText}>{data.testimonial}</Text>
        <View style={styles.testimonialFooter}>
          <Text style={styles.authorText}>{data.testimonialAuthor}</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <MaterialCommunityIcons
                key={star}
                name="star"
                size={14}
                color={colors.warning}
              />
            ))}
          </View>
        </View>
      </Animated.View>

      {/* Feature highlights */}
      <View style={styles.featuresRow}>
        {data.features.map((feature, index) => (
          <Animated.View
            key={index}
            style={[
              styles.featureItem,
              {
                opacity: featureAnims[index],
                transform: [
                  {
                    scale: featureAnims[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.7, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={[colors.primaryDim, colors.surface]}
              style={styles.featureGradient}
            >
              <MaterialCommunityIcons
                name={feature.icon as any}
                size={20}
                color={colors.primary}
              />
              <Text style={styles.featureText}>{feature.text}</Text>
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
    justifyContent: 'center',
  },
  ringRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  ringWrapper: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.success,
    lineHeight: 38,
  },
  ringInfo: {
    flex: 1,
    paddingLeft: spacing.md,
  },
  percentageLabel: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  parentsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryDim,
    paddingVertical: 6,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: radii.full,
    gap: 6,
    alignSelf: 'flex-start',
  },
  parentsCount: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  testimonialCard: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  quoteIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryDim,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  testimonialText: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontStyle: 'italic',
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  testimonialFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  authorText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 1,
  },
  featuresRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  featureItem: {
    flex: 1,
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  featureGradient: {
    padding: spacing.sm,
    alignItems: 'center',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 4,
  },
  featureText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 15,
  },
});
