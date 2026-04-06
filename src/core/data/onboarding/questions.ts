/**
 * Onboarding Questions Data
 * Pain-point focused questions for new parent conversion
 */

import { Question } from './types';

export const questions: Question[] = [
  {
    id: 'concern',
    title: "What's your biggest worry about your baby right now?",
    subtitle: "We'll personalize your experience based on what matters most to you",
    answers: [
      {
        id: 'growth',
        text: "Not sure if baby is growing properly",
        icon: 'chart-line',
      },
      {
        id: 'milestones',
        text: "Worried about developmental milestones",
        icon: 'flag-checkered',
      },
      {
        id: 'sleep',
        text: "Struggling with sleep schedules",
        icon: 'weather-night',
      },
      {
        id: 'feeding',
        text: "Confused about feeding patterns",
        icon: 'baby-bottle-outline',
      },
    ],
  },
  {
    id: 'frequency',
    title: "How often do you wonder if your baby is 'on track'?",
    subtitle: "Understanding your mindset helps us support you better",
    answers: [
      {
        id: 'multipleDaily',
        text: "Multiple times a day",
        icon: 'clock-fast',
      },
      {
        id: 'onceDaily',
        text: "Once a day",
        icon: 'calendar-today',
      },
      {
        id: 'weekly',
        text: "A few times a week",
        icon: 'calendar-week',
      },
      {
        id: 'doctorVisits',
        text: "Only before doctor visits",
        icon: 'stethoscope',
      },
    ],
  },
  {
    id: 'currentSolution',
    title: "What do you currently use to track your baby's progress?",
    subtitle: "This helps us show you what you've been missing",
    answers: [
      {
        id: 'nothing',
        text: "Nothing - I'm just worried",
        icon: 'emoticon-sad-outline',
      },
      {
        id: 'phoneNotes',
        text: "Notes on my phone",
        icon: 'note-text-outline',
      },
      {
        id: 'otherApp',
        text: "Another app that doesn't feel accurate",
        icon: 'cellphone',
      },
      {
        id: 'doctorOnly',
        text: "Doctor visits only (every few months)",
        icon: 'hospital-building',
      },
    ],
  },
];

export const getQuestionByIndex = (index: number): Question | undefined => {
  return questions[index];
};

export const getTotalQuestions = (): number => {
  return questions.length;
};
