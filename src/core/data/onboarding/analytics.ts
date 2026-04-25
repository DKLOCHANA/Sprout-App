/**
 * Onboarding Analytics Data
 * 3 templates × 4 answers = 12 unique experiences
 * Each answer gets different data within the same template for its question
 */

import { AnalyticsData, QuestionId, AnswerId } from './types';
import { colors } from '@core/theme';

// ═══════════════════════════════════════════════
// Q1: "What's your biggest worry?" → HeroStat template
// ═══════════════════════════════════════════════
const concernAnalytics: AnalyticsData[] = [
  {
    questionId: 'concern',
    answerId: 'growth',
    type: 'heroStat',
    headline: "See exactly where your baby stands",
    subtitle: "WHO & CDC growth charts at your fingertips",
    data: {
      type: 'heroStat',
      ringPercentage: 65,
      ringLabel: '65th',
      ringSublabel: 'percentile',
      ringColor: '#4A90D9',
      icon: 'chart-line',
      description: "Track weight, height & head circumference with the same clinical charts your pediatrician uses",
      pills: [
        { icon: 'scale-bathroom', value: 'WHO', label: 'Standards' },
        { icon: 'chart-bell-curve-cumulative', value: 'Live', label: 'Percentiles' },
        { icon: 'alert-circle-outline', value: 'Smart', label: 'Alerts' },
      ],
    },
    ctaText: "Start Tracking Growth",
  },
  {
    questionId: 'concern',
    answerId: 'milestones',
    type: 'heroStat',
    headline: "Never miss a milestone again",
    subtitle: "150+ developmental milestones tracked",
    data: {
      type: 'heroStat',
      ringPercentage: 78,
      ringLabel: '150+',
      ringSublabel: 'milestones',
      ringColor: '#D4B8FF',
      icon: 'flag-checkered',
      description: "Motor, cognitive, social & language milestones — personalized to your baby's age with gentle reminders",
      pills: [
        { icon: 'brain', value: '4', label: 'Categories' },
        { icon: 'bell-ring-outline', value: 'Smart', label: 'Reminders' },
        { icon: 'file-document-outline', value: 'PDF', label: 'Reports' },
      ],
    },
    ctaText: "Start Tracking Milestones",
  },
  {
    questionId: 'concern',
    answerId: 'sleep',
    type: 'heroStat',
    headline: "Understand your baby's sleep",
    subtitle: "Parents report 40% less sleep anxiety",
    data: {
      type: 'heroStat',
      ringPercentage: 85,
      ringLabel: '14.5h',
      ringSublabel: 'avg/day',
      ringColor: '#B8D4FF',
      icon: 'weather-night',
      description: "Age-based sleep benchmarks, nap tracking & weekly pattern insights that actually help you rest easier",
      pills: [
        { icon: 'moon-waning-crescent', value: '65%', label: 'Night' },
        { icon: 'white-balance-sunny', value: '35%', label: 'Naps' },
        { icon: 'chart-timeline-variant', value: 'Weekly', label: 'Insights' },
      ],
    },
    ctaText: "Start Tracking Sleep",
  },
  {
    questionId: 'concern',
    answerId: 'feeding',
    type: 'heroStat',
    headline: "Know exactly what baby needs",
    subtitle: "Breast, bottle & solids in one place",
    data: {
      type: 'heroStat',
      ringPercentage: 72,
      ringLabel: '8',
      ringSublabel: 'feeds/day',
      ringColor: '#FFB8B8',
      icon: 'baby-bottle-outline',
      description: "Track every feed, see daily intake totals & get age-appropriate feeding schedules — all backed by data",
      pills: [
        { icon: 'cup-water', value: '24oz', label: 'Daily' },
        { icon: 'clock-outline', value: '3h', label: 'Interval' },
        { icon: 'silverware-fork-knife', value: 'Solids', label: 'Ready' },
      ],
    },
    ctaText: "Start Tracking Feeds",
  },
];

// ═══════════════════════════════════════════════
// Q2: "How often do you worry?" → Transformation template
// ═══════════════════════════════════════════════
const frequencyAnalytics: AnalyticsData[] = [
  {
    questionId: 'frequency',
    answerId: 'multipleDaily',
    type: 'transformation',
    headline: "From constant worry to instant peace",
    subtitle: "You check because you care — we make it easier",
    data: {
      type: 'transformation',
      beforeValue: '12x',
      beforeLabel: 'daily worry\nchecks',
      afterValue: '2 min',
      afterLabel: 'to feel\nreassured',
      improvementPercent: 89,
      improvementLabel: 'less anxiety',
      stat: {
        value: '50,000+',
        label: 'parents found peace of mind',
        icon: 'heart-outline',
      },
    },
    ctaText: "Get Instant Peace of Mind",
  },
  {
    questionId: 'frequency',
    answerId: 'onceDaily',
    type: 'transformation',
    headline: "Turn daily worry into daily confidence",
    subtitle: "One check-in a day changes everything",
    data: {
      type: 'transformation',
      beforeValue: '73%',
      beforeLabel: 'parents feel\nanxious daily',
      afterValue: '12%',
      afterLabel: 'after using\nSprout',
      improvementPercent: 83,
      improvementLabel: 'less worry',
      stat: {
        value: '30 sec',
        label: 'daily log — that\'s all it takes',
        icon: 'timer-outline',
      },
    },
    ctaText: "Reduce Your Worry",
  },
  {
    questionId: 'frequency',
    answerId: 'weekly',
    type: 'transformation',
    headline: "Every week reveals new progress",
    subtitle: "Watch your baby's growth unfold beautifully",
    data: {
      type: 'transformation',
      beforeValue: '?',
      beforeLabel: 'guessing\neach week',
      afterValue: '100%',
      afterLabel: 'clarity on\nprogress',
      improvementPercent: 92,
      improvementLabel: 'confidence boost',
      stat: {
        value: 'Week 4',
        label: 'is when parents feel fully confident',
        icon: 'calendar-check-outline',
      },
    },
    ctaText: "Start Your Journey",
  },
  {
    questionId: 'frequency',
    answerId: 'doctorVisits',
    type: 'transformation',
    headline: "Don't wait months between answers",
    subtitle: "90 days of insight vs 1 checkup snapshot",
    data: {
      type: 'transformation',
      beforeValue: '1',
      beforeLabel: 'snapshot per\n3 months',
      afterValue: '90',
      afterLabel: 'days of\ncontinuous data',
      improvementPercent: 90,
      improvementLabel: 'more insight',
      stat: {
        value: '2,160h',
        label: 'of development between visits',
        icon: 'clock-fast',
      },
    },
    ctaText: "Start Daily Tracking",
  },
];

// ═══════════════════════════════════════════════
// Q3: "What do you currently use?" → SocialProof template
// ═══════════════════════════════════════════════
const solutionAnalytics: AnalyticsData[] = [
  {
    questionId: 'currentSolution',
    answerId: 'nothing',
    type: 'socialProof',
    headline: "94% wish they started sooner",
    subtitle: "Take the first step — thousands already did",
    data: {
      type: 'socialProof',
      percentage: 94,
      percentageLabel: "of parents wish they started tracking earlier",
      testimonial: "I spent months worrying alone. Sprout gave me answers in my first week — I finally stopped googling at 3am.",
      testimonialAuthor: "Sarah, mom of 8mo",
      features: [
        { icon: 'rocket-launch-outline', text: 'Setup in\n60 seconds' },
        { icon: 'shield-check-outline', text: 'Clinical\naccuracy' },
        { icon: 'heart-pulse', text: 'Peace of\nmind' },
      ],
    },
    ctaText: "Take the First Step",
  },
  {
    questionId: 'currentSolution',
    answerId: 'phoneNotes',
    type: 'socialProof',
    headline: "10x more organized in minutes",
    subtitle: "From scattered notes to smart insights",
    data: {
      type: 'socialProof',
      percentage: 87,
      percentageLabel: "of note-takers switched and never looked back",
      testimonial: "I had notes everywhere — texts, photos, random apps. Sprout organized everything and now I actually see patterns.",
      testimonialAuthor: "Emma, mom of 5mo",
      features: [
        { icon: 'chart-timeline-variant', text: 'Auto\ncharts' },
        { icon: 'bell-outline', text: 'Smart\nreminders' },
        { icon: 'file-chart-outline', text: 'Doctor\nreports' },
      ],
    },
    ctaText: "Get Organized Now",
  },
  {
    questionId: 'currentSolution',
    answerId: 'otherApp',
    type: 'socialProof',
    headline: "The accuracy you've been looking for",
    subtitle: "Real WHO & CDC data, not guesswork",
    data: {
      type: 'socialProof',
      percentage: 91,
      percentageLabel: "of switchers say Sprout is more accurate",
      testimonial: "My old app said my baby was 'fine' — Sprout showed me the actual percentile data my pediatrician uses. Game changer.",
      testimonialAuthor: "Jessica, mom of 11mo",
      features: [
        { icon: 'medical-bag', text: 'WHO/CDC\nstandards' },
        { icon: 'swap-horizontal', text: 'Easy\nimport' },
        { icon: 'check-decagram', text: 'Verified\ndata' },
      ],
    },
    ctaText: "Switch to Accuracy",
  },
  {
    questionId: 'currentSolution',
    answerId: 'doctorOnly',
    type: 'socialProof',
    headline: "Continuous care, not just checkups",
    subtitle: "Bridge the gap between doctor visits",
    data: {
      type: 'socialProof',
      percentage: 96,
      percentageLabel: "of parents feel more prepared for doctor visits",
      testimonial: "I used to forget half the questions by appointment time. Now I walk in with data and my pediatrician loves it.",
      testimonialAuthor: "Maria, mom of 7mo",
      features: [
        { icon: 'calendar-clock', text: 'Daily\ninsights' },
        { icon: 'file-document-outline', text: 'Visit\nreports' },
        { icon: 'stethoscope', text: 'Doctor\nready' },
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
