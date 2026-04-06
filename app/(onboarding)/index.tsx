/**
 * Onboarding Index Screen
 * Main onboarding flow controller
 */

import React from 'react';
import { useRouter } from 'expo-router';
import { questions, getAnalytics, QuestionId, AnswerId } from '@core/data/onboarding';
import { useOnboardingStore } from '@features/onboarding/store';
import { OnboardingSplash, QuestionScreen, AnalyticsScreen } from '@features/onboarding/screens';

export default function OnboardingIndex() {
  const router = useRouter();
  const {
    currentStep,
    answers,
    setAnswer,
    nextStep,
    prevStep,
    completeSurvey,
    getCurrentStepType,
    getQuestionIndex,
    isLastAnalytics,
  } = useOnboardingStore();

  const stepType = getCurrentStepType();
  const questionIndex = getQuestionIndex();

  // Handle splash "Get Started"
  const handleGetStarted = () => {
    nextStep();
  };

  // Handle answer selection
  const handleAnswer = (answerId: AnswerId) => {
    const question = questions[questionIndex];
    if (question) {
      setAnswer(question.id, answerId);
    }
  };

  // Handle continue from question
  const handleQuestionContinue = () => {
    nextStep();
  };

  // Handle continue from analytics
  const handleAnalyticsContinue = () => {
    if (isLastAnalytics()) {
      // Mark survey complete and navigate to register
      completeSurvey();
      router.replace('/(auth)/register');
    } else {
      nextStep();
    }
  };

  // Handle back navigation
  const handleBack = () => {
    if (currentStep > 0) {
      prevStep();
    }
  };

  // Render splash screen
  if (stepType === 'splash') {
    return <OnboardingSplash onGetStarted={handleGetStarted} />;
  }

  // Render question screen
  if (stepType === 'question') {
    const question = questions[questionIndex];
    if (!question) return null;

    const selectedAnswer = answers[question.id];

    return (
      <QuestionScreen
        question={question}
        questionIndex={questionIndex}
        totalQuestions={questions.length}
        selectedAnswer={selectedAnswer}
        onAnswer={handleAnswer}
        onContinue={handleQuestionContinue}
      />
    );
  }

  // Render analytics screen
  if (stepType === 'analytics') {
    const question = questions[questionIndex];
    if (!question) return null;

    const answerId = answers[question.id];
    if (!answerId) return null;

    const analytics = getAnalytics(question.id, answerId);
    if (!analytics) return null;

    return (
      <AnalyticsScreen
        analytics={analytics}
        questionIndex={questionIndex}
        totalQuestions={questions.length}
        onContinue={handleAnalyticsContinue}
        onBack={handleBack}
        isLastAnalytics={isLastAnalytics()}
      />
    );
  }

  return null;
}
