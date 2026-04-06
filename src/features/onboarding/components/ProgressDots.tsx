/**
 * ProgressDots Component
 * Animated visual pagination indicator for onboarding flow
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, radii } from '@core/theme';

interface ProgressDotsProps {
  totalSteps: number;
  currentStep: number;
}

export function ProgressDots({ totalSteps, currentStep }: ProgressDotsProps) {
  const scaleAnims = useRef(
    Array.from({ length: totalSteps }).map(() => new Animated.Value(1))
  ).current;

  useEffect(() => {
    // Pulse animation for current dot
    Animated.sequence([
      Animated.timing(scaleAnims[currentStep], {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnims[currentStep], {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentStep]);

  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <Animated.View
            key={index}
            style={[
              styles.dotWrapper,
              { transform: [{ scale: scaleAnims[index] }] },
            ]}
          >
            {isCompleted ? (
              <View style={styles.completedDot}>
                <MaterialCommunityIcons
                  name="check"
                  size={12}
                  color={colors.textOnPrimary}
                />
              </View>
            ) : isActive ? (
              <LinearGradient
                colors={[colors.secondaryGradientStart, colors.secondaryGradientEnd]}
                style={styles.activeDot}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            ) : (
              <View style={styles.inactiveDot} />
            )}
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dotWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  activeDot: {
    width: 32,
    height: 8,
    borderRadius: 4,
  },
  completedDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
