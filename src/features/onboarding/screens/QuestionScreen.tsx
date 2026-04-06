/**
 * Question Screen
 * Displays question with answer options
 */

import React from 'react';
import { Question, AnswerId } from '@core/data/onboarding';
import { QuestionCard } from '../components';

interface QuestionScreenProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  selectedAnswer?: AnswerId;
  onAnswer: (answerId: AnswerId) => void;
  onContinue: () => void;
}

export function QuestionScreen({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswer,
  onAnswer,
  onContinue,
}: QuestionScreenProps) {
  return (
    <QuestionCard
      question={question}
      questionIndex={questionIndex}
      totalQuestions={totalQuestions}
      selectedAnswer={selectedAnswer}
      onAnswer={onAnswer}
      onContinue={onContinue}
    />
  );
}
