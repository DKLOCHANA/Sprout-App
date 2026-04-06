/**
 * AnswerOption Component
 * Selectable answer button with icon for onboarding questions
 */

import React, { useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, radii, typography } from '@core/theme';
import { Answer } from '@core/data/onboarding';

interface AnswerOptionProps {
  answer: Answer;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

export function AnswerOption({ answer, isSelected, onSelect, index }: AnswerOptionProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  const handlePress = () => {
    // Bounce animation on select
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
    onSelect();
  };

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.container, isSelected && styles.selected]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, isSelected && styles.iconContainerSelected]}>
          {isSelected ? (
            <LinearGradient
              colors={[colors.secondaryGradientStart, colors.secondaryGradientEnd]}
              style={styles.iconGradient}
            >
              <MaterialCommunityIcons
                name={answer.icon as any}
                size={24}
                color={colors.textOnPrimary}
              />
            </LinearGradient>
          ) : (
            <MaterialCommunityIcons
              name={answer.icon as any}
              size={24}
              color={colors.primary}
            />
          )}
        </View>
        <Text style={[styles.text, isSelected && styles.textSelected]}>
          {answer.text}
        </Text>
        <View style={[styles.radio, isSelected && styles.radioSelected]}>
          {isSelected && (
            <MaterialCommunityIcons
              name="check"
              size={16}
              color={colors.textOnPrimary}
            />
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryDim,
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryDim,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  iconContainerSelected: {
    backgroundColor: 'transparent',
  },
  iconGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    ...typography.body,
    flex: 1,
    color: colors.textPrimary,
  },
  textSelected: {
    fontWeight: '600',
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
});
