import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Clock, Award, Lock, CreditCard } from 'lucide-react';
import { useTestStore } from '../stores/testStore';
import ZenMode from '../components/ZenMode';

interface Test {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  passing_score: number;
  is_free: boolean;
  requires_zen_mode: boolean;
  test_types: {
    name: string;
    price: number;
    attempts_allowed: number;
  };
  chapters?: {
    name: string;
    subjects: {
      name: string;
    };
  };
}

interface Question {
  id: string;
  question_text: string;
  options: string[];
}

export default function TestDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [test, setTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [access, setAccess] = useState<{
    hasAccess: boolean;
    message?: string;
  }>({ hasAccess: false });
  const { checkTestAccess, purchaseTest } = useTestStore();

  useEffect(() => {
    async function fetchTestDetails() {
      try {
        const { data: testData, error: testError } = await supabase
          .from('tests')
          .select(`
            *,
            test_types (*),
            chapters (
              name,
              subjects (name)
            )
          `)
          .eq('id', id)
          .single();

        if (testError) throw testError;
        setTest(testData);

        const accessStatus = await checkTestAccess(id!);
        setAccess(accessStatus);

        if (accessStatus.hasAccess) {
          const { data: questionData, error: questionError } = await supabase
            .from('questions')
            .select('*')
            .eq('test_id', id);

          if (questionError) throw questionError;
          setQuestions(questionData || []);
        }
      } catch (error) {
        console.error('Error fetching test details:', error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchTestDetails();
    }
  }, [id]);

  const handlePurchase = async () => {
    const result = await purchaseTest(id!);
    if (result.success) {
      const accessStatus = await checkTestAccess(id!);
      setAccess(accessStatus);
    }
  };

  const handleStartTest = async () => {
    if (test?.requires_zen_mode) {
      document.documentElement.requestFullscreen();
    }
    // Start test logic will be implemented here
    console.log('Starting test:', test?.id);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading test details...</div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Test not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{test.title}</h1>
          {!test.is_free && (
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-green-600" />
              <span className="text-lg font-semibold text-green-600">
                ₹{test.test_types.price / 100}
              </span>
            </div>
          )}
        </div>

        <p className="text-gray-600 mb-6">{test.description}</p>

        {test.chapters && (
          <div className="mb-4 text-sm text-gray-500">
            {test.chapters.subjects.name} &gt; {test.chapters.name}
          </div>
        )}

        <div className="flex items-center space-x-6 mb-8">
          <div className="flex items-center text-gray-500">
            <Clock className="h-5 w-5 mr-2" />
            <span>{test.duration_minutes} minutes</span>
          </div>
          <div className="flex items-center text-gray-500">
            <Award className="h-5 w-5 mr-2" />
            <span>Passing score: {test.passing_score}%</span>
          </div>
          {test.requires_zen_mode && (
            <div className="flex items-center text-indigo-600">
              <Lock className="h-5 w-5 mr-2" />
              <span>Zen Mode Required</span>
            </div>
          )}
        </div>

        {!access.hasAccess ? (
          <button
            onClick={handlePurchase}
            className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Purchase Test (₹{test.test_types.price / 100})
          </button>
        ) : (
          <button
            onClick={handleStartTest}
            className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Start Test
          </button>
        )}

        {access.message && (
          <p className="mt-2 text-sm text-gray-500 text-center">
            {access.message}
          </p>
        )}
      </div>

      {access.hasAccess && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Sample Questions ({questions.length})
          </h2>
          <div className="space-y-4">
            {questions.slice(0, 3).map((question, index) => (
              <div key={question.id} className="bg-white rounded-lg shadow-sm p-6">
                <p className="font-medium text-gray-900 mb-4">
                  {index + 1}. {question.question_text}
                </p>
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className="flex items-center space-x-3 p-3 rounded-md bg-gray-50"
                    >
                      <span className="text-gray-600">{option}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {test.requires_zen_mode && <ZenMode />}
    </div>
  );
}