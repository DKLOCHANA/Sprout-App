/**
 * Onboarding Analytics Data
 * Unique analytics for each answer - conversion-optimized content
 */

import { AnalyticsData, QuestionId, AnswerId } from './types';
import { colors } from '@core/theme';

// Analytics for Question 1: Primary Concern
const concernAnalytics: AnalyticsData[] = [
  {
    questionId: 'concern',
    answerId: 'growth',
    type: 'percentileChart',
    title: "Track Growth with Clinical Accuracy",
    subtitle: "WHO & CDC data at your fingertips",
    headline: "See exactly where your baby stands",
    data: {
      type: 'percentileChart',
      percentile: 65,
      label: "65th percentile",
      description: "Real-time percentile tracking based on WHO standards used by pediatricians worldwide",
    },
    ctaText: "Start Tracking Growth",
  },
  {
    questionId: 'concern',
    answerId: 'milestones',
    type: 'progressBar',
    title: "Never Miss a Milestone",
    subtitle: "Track motor, cognitive, social & language development",
    headline: "150+ milestones tracked for you",
    data: {
      type: 'progressBar',
      percentage: 78,
      label: "Milestones tracked",
      milestones: [
        { name: "First smile", tracked: true },
        { name: "Rolling over", tracked: true },
        { name: "Sitting up", tracked: true },
        { name: "First words", tracked: false },
      ],
    },
    ctaText: "Start Tracking Milestones",
  },
  {
    questionId: 'concern',
    answerId: 'sleep',
    type: 'circleChart',
    title: "Understand Sleep Patterns",
    subtitle: "Age-based benchmarks & weekly insights",
    headline: "Parents report 40% less sleep anxiety",
    data: {
      type: 'circleChart',
      percentage: 85,
      centerText: "14.5h",
      segments: [
        { label: "Night sleep", value: 65, color: colors.sleep },
        { label: "Day naps", value: 35, color: colors.primaryLight },
      ],
    },
    ctaText: "Start Tracking Sleep",
  },
  {
    questionId: 'concern',
    answerId: 'feeding',
    type: 'bigNumber',
    title: "Master Feeding Schedules",
    subtitle: "Breastfeeding, bottles & solid food tracking",
    headline: "Know exactly what your baby needs",
    data: {
      type: 'bigNumber',
      number: "8",
      suffix: "feeds/day",
      label: "Average daily feeds tracked",
      subStats: [
        { value: "24oz", label: "Daily intake" },
        { value: "3h", label: "Avg interval" },
      ],
    },
    ctaText: "Start Tracking Feeds",
  },
];

// Analytics for Question 2: Check Frequency
const frequencyAnalytics: AnalyticsData[] = [
  {
    questionId: 'frequency',
    answerId: 'multipleDaily',
    type: 'bigNumber',
    title: "You're Not Alone",
    subtitle: "Most parents feel the same way",
    headline: "Join 50,000+ parents who found peace",
    data: {
      type: 'bigNumber',
      number: "12",
      suffix: "x/day",
      label: "Average parent check-ins",
      subStats: [
        { value: "89%", label: "Feel more confident" },
        { value: "2min", label: "To log & check" },
      ],
    },
    ctaText: "Get Instant Peace of Mind",
  },
  {
    questionId: 'frequency',
    answerId: 'onceDaily',
    type: 'comparison',
    title: "Turn Worry into Confidence",
    subtitle: "See the difference Sprout makes",
    headline: "Daily tracking = daily reassurance",
    data: {
      type: 'comparison',
      before: { value: "73%", label: "Anxious parents" },
      after: { value: "12%", label: "After using Sprout" },
      improvement: "83% reduction in daily worry",
    },
    ctaText: "Reduce Your Worry",
  },
  {
    questionId: 'frequency',
    answerId: 'weekly',
    type: 'progressBar',
    title: "Watch Progress Unfold",
    subtitle: "Week-by-week improvements you can see",
    headline: "Every week brings new milestones",
    data: {
      type: 'progressBar',
      percentage: 92,
      label: "Weekly confidence boost",
      milestones: [
        { name: "Week 1: Baseline", tracked: true },
        { name: "Week 2: Patterns emerge", tracked: true },
        { name: "Week 3: Predictions work", tracked: true },
        { name: "Week 4: Full confidence", tracked: false },
      ],
    },
    ctaText: "Start Your Journey",
  },
  {
    questionId: 'frequency',
    answerId: 'doctorVisits',
    type: 'calendar',
    title: "Don't Wait for Doctor Visits",
    subtitle: "Track every day, not every 2-3 months",
    headline: "90 days of insight vs 1 checkup",
    data: {
      type: 'calendar',
      trackingDays: 90,
      gapDays: 1,
      comparison: "Pediatricians see snapshots. You'll see the full picture.",
    },
    ctaText: "Start Daily Tracking",
  },
];

// Analytics for Question 3: Current Solution
const solutionAnalytics: AnalyticsData[] = [
  {
    questionId: 'currentSolution',
    answerId: 'nothing',
    type: 'successRate',
    title: "From Worry to Peace",
    subtitle: "Join parents who took the first step",
    headline: "94% wish they started sooner",
    data: {
      type: 'successRate',
      percentage: 94,
      totalUsers: "50,000+ parents",
      testimonial: "I finally stopped googling at 3am. Sprout tells me everything I need to know.",
    },
    ctaText: "Take the First Step",
  },
  {
    questionId: 'currentSolution',
    answerId: 'phoneNotes',
    type: 'comparison',
    title: "Upgrade Your Tracking",
    subtitle: "From scattered notes to organized insights",
    headline: "10x more organized in minutes",
    data: {
      type: 'comparison',
      before: { value: "Scattered", label: "Notes everywhere" },
      after: { value: "Organized", label: "Everything in one place" },
      improvement: "Auto-charts, reminders & doctor reports",
    },
    ctaText: "Get Organized Now",
  },
  {
    questionId: 'currentSolution',
    answerId: 'otherApp',
    type: 'percentileChart',
    title: "Finally, Clinical Accuracy",
    subtitle: "Real WHO & CDC data, not guesswork",
    headline: "The accuracy you've been looking for",
    data: {
      type: 'percentileChart',
      percentile: 72,
      label: "Clinically accurate",
      description: "Other apps estimate. Sprout uses the same WHO/CDC charts your pediatrician uses.",
    },
    ctaText: "Switch to Accuracy",
  },
  {
    questionId: 'currentSolution',
    answerId: 'doctorOnly',
    type: 'bigNumber',
    title: "Bridge the Gap",
    subtitle: "Don't wait 2-3 months between visits",
    headline: "Continuous care, not just checkups",
    data: {
      type: 'bigNumber',
      number: "90",
      suffix: "days",
      label: "Average gap between doctor visits",
      subStats: [
        { value: "2,160", label: "Hours of development" },
        { value: "50+", label: "Potential milestones" },
      ],
    },
    ctaText: "Start Tracking Today",
  },
];

export const allAnalytics: AnalyticsData[] = [
  ...concernAnalytics,
  ...frequencyAnalytics,
  ...solutionAnalytics,
];

export const getAnalytics = (
  questionId: QuestionId,
  answerId: AnswerId
): AnalyticsData | undefined => {
  return allAnalytics.find(
    (a) => a.questionId === questionId && a.answerId === answerId
  );
};

export const getAnalyticsForQuestion = (questionId: QuestionId): AnalyticsData[] => {
  return allAnalytics.filter((a) => a.questionId === questionId);
};
