/**
 * QuestionCard Component
 * Reusable question template with answers and animations
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography, radii } from '@core/theme';
import { Question, AnswerId } from '@core/data/onboarding';
import { AnswerOption } from './AnswerOption';
import { ProgressDots } from './ProgressDots';
import { PrimaryButton } from '@shared/components/ui';

interface QuestionCardProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  selectedAnswer?: AnswerId;
  onAnswer: (answerId: AnswerId) => void;
  onContinue: () => void;
}

export function QuestionCard({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswer,
  onAnswer,
  onContinue,
}: QuestionCardProps) {
  const slideAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Reset and animate on question change
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <ProgressDots 
          totalSteps={totalQuestions} 
          currentStep={questionIndex} 
        />
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.questionSection,
            {
              opacity: fadeAnim,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          {/* Question Number Badge */}
          <View style={styles.questionBadge}>
            <LinearGradient
              colors={[colors.secondaryGradientStart, colors.secondaryGradientEnd]}
              style={styles.badgeGradient}
            >
              <Text style={styles.badgeText}>Question {questionIndex + 1}</Text>
            </LinearGradient>
          </View>

          <Text style={styles.title}>{question.title}</Text>
          <Text style={styles.subtitle}>{question.subtitle}</Text>
        </Animated.View>

        <View style={styles.answersSection}>
          {question.answers.map((answer, index) => (
            <AnswerOption
              key={answer.id}
              answer={answer}
              isSelected={selectedAnswer === answer.id}
              onSelect={() => onAnswer(answer.id)}
              index={index}
            />
          ))}
        </View>

        {/* Trust Badge */}
        <View style={styles.trustBadge}>
          <MaterialCommunityIcons
            name="shield-check"
            size={16}
            color={colors.success}
          />
          <Text style={styles.trustText}>
            Your answers help us personalize your experience
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          title="Continue"
          onPress={onContinue}
          disabled={!selectedAnswer}
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
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  questionSection: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  questionBadge: {
    marginBottom: spacing.md,
  },
  badgeGradient: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
  },
  badgeText: {
    ...typography.caption,
    color: colors.textOnPrimary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  answersSection: {
    marginTop: spacing.md,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
  trustText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xl,
    backgroundColor: colors.background,
  },
});
