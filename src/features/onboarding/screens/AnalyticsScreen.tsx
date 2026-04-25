/**
 * Analytics Screen
 * Renders 1 of 3 templates based on question type
 * Eye-catching, conversion-optimized design
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography, radii } from '@core/theme';
import { AnalyticsData } from '@core/data/onboarding';
import { ProgressDots } from '../components';
import {
  HeroStatCard,
  TransformationCard,
  SocialProofCard,
} from '../components/analytics';
import { PrimaryButton } from '@shared/components/ui';

interface AnalyticsScreenProps {
  analytics: AnalyticsData;
  questionIndex: number;
  totalQuestions: number;
  onContinue: () => void;
  onBack: () => void;
  isLastAnalytics: boolean;
}

export function AnalyticsScreen({
  analytics,
  questionIndex,
  totalQuestions,
  onContinue,
  onBack,
  isLastAnalytics,
}: AnalyticsScreenProps) {
  const slideAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    slideAnim.setValue(50);
    fadeAnim.setValue(0);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [questionIndex]);

  const renderAnalyticsContent = () => {
    const { data } = analytics;

    switch (data.type) {
      case 'heroStat':
        return <HeroStatCard data={data} />;
      case 'transformation':
        return <TransformationCard data={data} />;
      case 'socialProof':
        return <SocialProofCard data={data} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <MaterialCommunityIcons
            name="chevron-left"
            size={28}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <ProgressDots totalSteps={totalQuestions} currentStep={questionIndex} />
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Headline Section */}
        <Animated.View
          style={[
            styles.headlineSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.headline}>{analytics.headline}</Text>
          <Text style={styles.subtitle}>{analytics.subtitle}</Text>
        </Animated.View>

        {/* Analytics Content */}
        <Animated.View
          style={[
            styles.analyticsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {renderAnalyticsContent()}
        </Animated.View>

        {/* Trust Badge */}
        <Animated.View style={[styles.trustBadge, { opacity: fadeAnim }]}>
          <MaterialCommunityIcons
            name="shield-check"
            size={14}
            color={colors.success}
          />
          <Text style={styles.trustText}>
            Trusted by <Text style={styles.trustHighlight}>50,000+ parents</Text>
          </Text>
        </Animated.View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <PrimaryButton
          title={isLastAnalytics ? "Let's Grow Together" : analytics.ctaText}
          onPress={onContinue}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  progressContainer: {
    flex: 1,
    alignItems: 'center',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
    justifyContent: 'space-between',
  },
  headlineSection: {
    alignItems: 'center',
    paddingTop: spacing.xs,
  },
  headline: {
    ...typography.h3,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  analyticsContainer: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    marginVertical: spacing.sm,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingBottom: spacing.xs,
  },
  trustText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  trustHighlight: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
});
