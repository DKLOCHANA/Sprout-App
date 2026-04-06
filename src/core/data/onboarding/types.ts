/**
 * Onboarding Data Types
 * Types for questions, answers, and analytics
 */

export type QuestionId = 'concern' | 'frequency' | 'currentSolution';

export type AnswerId = 
  // Question 1: Primary Concern
  | 'growth' | 'milestones' | 'sleep' | 'feeding'
  // Question 2: Check Frequency
  | 'multipleDaily' | 'onceDaily' | 'weekly' | 'doctorVisits'
  // Question 3: Current Solution
  | 'nothing' | 'phoneNotes' | 'otherApp' | 'doctorOnly';

export interface Answer {
  id: AnswerId;
  text: string;
  icon: string; // MaterialCommunityIcons name
}

export interface Question {
  id: QuestionId;
  title: string;
  subtitle: string;
  answers: Answer[];
}

export type AnalyticsType = 
  | 'percentileChart' 
  | 'progressBar' 
  | 'circleChart' 
  | 'bigNumber'
  | 'comparison'
  | 'successRate'
  | 'calendar';

export interface AnalyticsData {
  questionId: QuestionId;
  answerId: AnswerId;
  type: AnalyticsType;
  title: string;
  subtitle: string;
  headline: string;
  data: AnalyticsDisplayData;
  ctaText: string;
}

export interface PercentileChartData {
  type: 'percentileChart';
  percentile: number;
  label: string;
  description: string;
}

export interface ProgressBarData {
  type: 'progressBar';
  percentage: number;
  label: string;
  milestones: { name: string; tracked: boolean }[];
}

export interface CircleChartData {
  type: 'circleChart';
  percentage: number;
  centerText: string;
  segments: { label: string; value: number; color: string }[];
}

export interface BigNumberData {
  type: 'bigNumber';
  number: string;
  suffix: string;
  label: string;
  subStats: { value: string; label: string }[];
}

export interface ComparisonData {
  type: 'comparison';
  before: { value: string; label: string };
  after: { value: string; label: string };
  improvement: string;
}

export interface SuccessRateData {
  type: 'successRate';
  percentage: number;
  totalUsers: string;
  testimonial: string;
}

export interface CalendarData {
  type: 'calendar';
  trackingDays: number;
  gapDays: number;
  comparison: string;
}

export type AnalyticsDisplayData =
  | PercentileChartData
  | ProgressBarData
  | CircleChartData
  | BigNumberData
  | ComparisonData
  | SuccessRateData
  | CalendarData;

export interface OnboardingState {
  currentStep: number;
  answers: Partial<Record<QuestionId, AnswerId>>;
  hasCompletedSurvey: boolean;
}
