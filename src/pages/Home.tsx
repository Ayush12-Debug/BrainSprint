import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, BookOpen, Trophy } from 'lucide-react';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center py-16 px-4">
        <div className="flex justify-center mb-8">
          <img src="/brain-sprint-icon.svg" alt="BrainSprint Logo" className="w-24 h-24" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl mb-4">
          Welcome to BrainSprint
        </h1>
        <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
          Sprint Towards Your Dream University With BrainSprint
        </p>
        <p className="mt-4 text-lg text-gray-500">
          Test your knowledge, track your progress, and challenge yourself with our comprehensive testing platform.
        </p>
        <div className="mt-10">
          <Link
            to="/tests"
            className="btn-primary inline-flex items-center px-8 py-3 text-lg"
          >
            Get Started
          </Link>
        </div>
      </div>

      <div className="mt-32 grid grid-cols-1 gap-8 sm:grid-cols-3 px-4">
        <div className="card text-center">
          <div className="flex justify-center">
            <Brain className="h-12 w-12 text-primary" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Smart Learning</h3>
          <p className="mt-2 text-base text-gray-500">
            Adaptive testing that grows with your knowledge level
          </p>
        </div>

        <div className="card text-center">
          <div className="flex justify-center">
            <BookOpen className="h-12 w-12 text-secondary" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Diverse Topics</h3>
          <p className="mt-2 text-base text-gray-500">
            Wide range of subjects and difficulty levels
          </p>
        </div>

        <div className="card text-center">
          <div className="flex justify-center">
            <Trophy className="h-12 w-12 text-accent" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Track Progress</h3>
          <p className="mt-2 text-base text-gray-500">
            Monitor your improvement with detailed analytics
          </p>
        </div>
      </div>
    </div>
  );
}