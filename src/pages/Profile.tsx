import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { User, Trophy, Clock } from 'lucide-react';

interface UserProfile {
  id: string;
  full_name: string;
  avatar_url: string;
}

interface TestAttempt {
  id: string;
  test: {
    title: string;
  };
  score: number;
  completed_at: string;
}

export default function Profile() {
  const { session } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        if (!session?.user.id) return;

        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        const { data: attemptsData, error: attemptsError } = await supabase
          .from('attempts')
          .select('*, test:tests(title)')
          .eq('user_id', session.user.id)
          .order('completed_at', { ascending: false });

        if (attemptsError) throw attemptsError;
        setAttempts(attemptsData || []);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [session]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
        <div className="flex items-center space-x-4">
          <div className="bg-indigo-100 p-3 rounded-full">
            <User className="h-8 w-8 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {profile?.full_name || 'User Profile'}
            </h1>
            <p className="text-gray-500">{session?.user.email}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Trophy className="h-6 w-6 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Test Performance
            </h2>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {attempts.length > 0
              ? Math.round(
                  attempts.reduce((acc, curr) => acc + (curr.score || 0), 0) /
                    attempts.length
                )
              : 0}
            %
          </div>
          <p className="text-gray-500">Average Score</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Clock className="h-6 w-6 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Tests Completed
            </h2>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {attempts.length}
          </div>
          <p className="text-gray-500">Total Attempts</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 p-6 border-b">
          Recent Test Attempts
        </h2>
        <div className="divide-y">
          {attempts.map((attempt) => (
            <div key={attempt.id} className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {attempt.test.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(attempt.completed_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {attempt.score}%
                </div>
              </div>
            </div>
          ))}

          {attempts.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No test attempts yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}