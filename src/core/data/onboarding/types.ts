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

/**
 * 3 Analytics Template Types — one per question
 * Template 1: HeroStat (Q1 - Concern) - Animated ring + bold stat + mini pills
 * Template 2: Transformation (Q2 - Frequency) - Before/after + animated counter
 * Template 3: SocialProof (Q3 - Current Solution) - Success ring + testimonial + features
 */
export type AnalyticsType = 'heroStat' | 'transformation' | 'socialProof';

export interface AnalyticsData {
  questionId: QuestionId;
  answerId: AnswerId;
  type: AnalyticsType;
  headline: string;
  subtitle: string;
  data: AnalyticsDisplayData;
  ctaText: string;
}

// Template 1: Hero Stat Card (Q1 - What's your biggest concern?)
export interface HeroStatData {
  type: 'heroStat';
  ringPercentage: number;        // Animated ring fill (0-100)
  ringLabel: string;             // Text inside ring e.g. "65th"
  ringSublabel: string;          // Below ring label e.g. "percentile"
  ringColor: string;             // Accent color for the ring
  icon: string;                  // MaterialCommunityIcons name
  description: string;           // Short compelling description
  pills: {                       // 3 mini stat pills
    icon: string;
    value: string;
    label: string;
  }[];
}

// Template 2: Transformation Card (Q2 - How often do you worry?)
export interface TransformationData {
  type: 'transformation';
  beforeValue: string;           // e.g. "12x"
  beforeLabel: string;           // e.g. "daily worry checks"
  afterValue: string;            // e.g. "2 min"
  afterLabel: string;            // e.g. "to feel reassured"
  improvementPercent: number;    // e.g. 83 — animated counter
  improvementLabel: string;      // e.g. "less anxiety"
  stat: {                        // Bottom compelling stat
    value: string;
    label: string;
    icon: string;
  };
}

// Template 3: Social Proof Card (Q3 - What do you currently use?)
export interface SocialProofData {
  type: 'socialProof';
  percentage: number;            // Animated ring percentage
  percentageLabel: string;       // e.g. "of parents"
  testimonial: string;           // Quote from a parent
  testimonialAuthor: string;     // e.g. "Sarah, mom of 8mo"
  features: {                    // 3 feature highlights with icons
    icon: string;
    text: string;
  }[];
}

export type AnalyticsDisplayData =
  | HeroStatData
  | TransformationData
  | SocialProofData;

export interface OnboardingState {
  currentStep: number;
  answers: Partial<Record<QuestionId, AnswerId>>;
  hasCompletedSurvey: boolean;
}
