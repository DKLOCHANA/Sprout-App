/**
 * AgeDisplay Component
 * Shows baby's current age with personalized greeting
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography, radii, shadows } from '@/core/theme';

interface AgeDisplayProps {
  months: number;
  days: number;
  babyName?: string;
}

export function AgeDisplay({ months, days, babyName = 'Your baby' }: AgeDisplayProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Greeting text */}
        <Text style={styles.greeting}>
          Your baby, <Text style={styles.babyName}>{babyName}</Text> is
        </Text>
        
        {/* Age display - all in one line */}
        <View style={styles.ageRow}>
          {months > 0 && (
            <>
              <Text style={styles.ageNumber}>{months}</Text>
              <Text style={styles.ageUnit}>month{months !== 1 ? 's' : ''}</Text>
            </>
          )}
          
          {months > 0 && days > 0 && (
            <Text style={styles.comma}>, </Text>
          )}
          
          {days > 0 && (
            <>
              <Text style={styles.ageNumber}>{days}</Text>
              <Text style={styles.ageUnit}>day{days !== 1 ? 's' : ''}</Text>
            </>
          )}
          
          {months === 0 && days === 0 ? (
            <Text style={styles.ageNumber}>just born</Text>
          ) : (
            <Text style={styles.suffix}> old!</Text>
          )}
        </View>

        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    
    
  },
  card: {
    borderRadius: radii.xl,
    padding: spacing.lg,
    
    ...shadows.md,
    overflow: 'hidden',
    position: 'relative',
  },
  greeting: {
    ...typography.body,
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    lineHeight: 24,
  },
  babyName: {
    
    fontSize: 22,
    fontWeight: '700',
    fontStyle: 'italic',
    color: colors.secondary,
  },
  ageRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
  },
  ageNumber: {
    fontSize: 56,
    fontWeight: '700',
    fontStyle: 'italic',
    color: colors.secondary,
    lineHeight: 56,
    marginRight: spacing.xs,
  },
  ageUnit: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 32,
    marginRight: spacing.xs,
  },
  comma: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 32,
  },
  suffix: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 36,
  },
  
});