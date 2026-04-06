/**
 * Onboarding Store
 * Zustand store for onboarding flow state management
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuestionId, AnswerId, OnboardingState } from '@core/data/onboarding';

interface OnboardingStore extends OnboardingState {
  // Actions
  setAnswer: (questionId: QuestionId, answerId: AnswerId) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetOnboarding: () => void;
  completeSurvey: () => void;
  
  // Computed helpers
  getCurrentStepType: () => 'splash' | 'question' | 'analytics';
  getQuestionIndex: () => number;
  isLastAnalytics: () => boolean;
}

const TOTAL_QUESTIONS = 3;

// Step mapping:
// 0: Splash
// 1: Q1, 2: A1
// 3: Q2, 4: A2
// 5: Q3, 6: A3
// After 6: Complete -> Register

const getStepType = (step: number): 'splash' | 'question' | 'analytics' => {
  if (step === 0) return 'splash';
  const adjustedStep = step - 1;
  return adjustedStep % 2 === 0 ? 'question' : 'analytics';
};

const getQuestionIndexFromStep = (step: number): number => {
  if (step === 0) return -1;
  return Math.floor((step - 1) / 2);
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      // Initial State
      currentStep: 0,
      answers: {},
      hasCompletedSurvey: false,

      // Actions
      setAnswer: (questionId, answerId) =>
        set((state) => ({
          answers: { ...state.answers, [questionId]: answerId },
        })),

      nextStep: () =>
        set((state) => ({
          currentStep: state.currentStep + 1,
        })),

      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(0, state.currentStep - 1),
        })),

      resetOnboarding: () =>
        set({
          currentStep: 0,
          answers: {},
          hasCompletedSurvey: false,
        }),

      completeSurvey: () =>
        set({
          hasCompletedSurvey: true,
        }),

      // Computed helpers
      getCurrentStepType: () => getStepType(get().currentStep),
      
      getQuestionIndex: () => getQuestionIndexFromStep(get().currentStep),
      
      isLastAnalytics: () => {
        const step = get().currentStep;
        // Last analytics is step 6 (Q3's analytics, after step 5 which is Q3)
        return step === TOTAL_QUESTIONS * 2;
      },
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        answers: state.answers,
        hasCompletedSurvey: state.hasCompletedSurvey,
      }),
    }
  )
);
