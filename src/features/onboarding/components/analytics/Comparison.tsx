/**
 * Comparison Analytics Component
 * Compact before/after comparison
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography, radii } from '@core/theme';
import { ComparisonData } from '@core/data/onboarding';

interface ComparisonProps {
  data: ComparisonData;
}

export function Comparison({ data }: ComparisonProps) {
  const beforeAnim = useRef(new Animated.Value(0)).current;
  const afterAnim = useRef(new Animated.Value(0)).current;
  const improvementAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(beforeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(afterAnim, {
        toValue: 1,
        duration: 400,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.spring(improvementAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.comparisonRow}>
        {/* Before */}
        <Animated.View
          style={[
            styles.card,
            styles.beforeCard,
            { opacity: beforeAnim },
          ]}
        >
          <MaterialCommunityIcons
            name="emoticon-sad-outline"
            size={32}
            color={colors.error}
          />
          <Text style={styles.cardLabel}>BEFORE</Text>
          <Text style={styles.beforeValue}>{data.before.value}</Text>
          <Text style={styles.cardDescription}>{data.before.label}</Text>
        </Animated.View>

        {/* Arrow */}
        <View style={styles.arrowContainer}>
          <MaterialCommunityIcons
            name="arrow-right"
            size={24}
            color={colors.success}
          />
        </View>

        {/* After */}
        <Animated.View
          style={[
            styles.card,
            styles.afterCard,
            { opacity: afterAnim },
          ]}
        >
          <MaterialCommunityIcons
            name="emoticon-happy-outline"
            size={32}
            color={colors.success}
          />
          <Text style={styles.cardLabel}>AFTER</Text>
          <Text style={styles.afterValue}>{data.after.value}</Text>
          <Text style={styles.cardDescription}>{data.after.label}</Text>
        </Animated.View>
      </View>

      {/* Improvement Badge */}
      <Animated.View
        style={[
          styles.improvementBadge,
          {
            opacity: improvementAnim,
            transform: [{ scale: improvementAnim }],
          },
        ]}
      >
        <MaterialCommunityIcons
          name="check-decagram"
          size={18}
          color={colors.success}
        />
        <Text style={styles.improvementText}>{data.improvement}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'center',
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  },
  afterCard: {
    backgroundColor: colors.successDim,
  },
  cardLabel: {
    ...typography.caption,
    color: colors.textMuted,
    letterSpacing: 1,
    marginTop: spacing.xs,
  },
  beforeValue: {
    ...typography.h3,
    color: colors.error,
  },
  afterValue: {
    ...typography.h3,
    color: colors.success,
  },
  cardDescription: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  arrowContainer: {
    paddingHorizontal: spacing.xs,
  },
  improvementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.successDim,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.lg,
    gap: spacing.xs,
  },
  improvementText: {
    ...typography.bodySmall,
    color: colors.success,
    fontWeight: '600',
  },
});
