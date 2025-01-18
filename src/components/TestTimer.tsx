import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TestTimerProps {
  durationMinutes: number;
  onTimeUp: () => void;
}

export default function TestTimer({ durationMinutes, onTimeUp }: TestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    if (timeLeft <= 300) { // 5 minutes warning
      setIsWarning(true);
    }

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-sm transition-colors ${
      isWarning ? 'bg-red-50' : ''
    }`}>
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className={`h-5 w-5 ${isWarning ? 'text-red-500' : 'text-primary'}`} />
          <span className={`font-medium ${isWarning ? 'text-red-500' : 'text-gray-900'}`}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>
        {isWarning && (
          <span className="text-sm text-red-500">Time is running out!</span>
        )}
      </div>
    </div>
  );
}