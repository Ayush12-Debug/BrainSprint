import React from 'react';
import { cn } from '../lib/utils';

interface QuestionNavigationProps {
  totalQuestions: number;
  currentQuestion: number;
  answeredQuestions: number[];
  flaggedQuestions: number[];
  onQuestionSelect: (index: number) => void;
}

export default function QuestionNavigation({
  totalQuestions,
  currentQuestion,
  answeredQuestions,
  flaggedQuestions,
  onQuestionSelect,
}: QuestionNavigationProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Question Navigation</h3>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }, (_, i) => (
          <button
            key={i}
            onClick={() => onQuestionSelect(i)}
            className={cn(
              'h-10 w-10 rounded-md text-sm font-medium transition-colors',
              currentQuestion === i && 'ring-2 ring-primary',
              answeredQuestions.includes(i) && 'bg-green-100 text-green-700',
              flaggedQuestions.includes(i) && 'bg-yellow-100 text-yellow-700',
              !answeredQuestions.includes(i) && !flaggedQuestions.includes(i) && 'bg-gray-100 text-gray-700'
            )}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-100 rounded-sm" />
          <span>Answered</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-100 rounded-sm" />
          <span>Flagged</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-100 rounded-sm" />
          <span>Unanswered</span>
        </div>
      </div>
    </div>
  );
}