import React, { useState } from 'react';
import { Brain } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const { setSession } = useAuthStore();

  const createUserProfile = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .insert([
          {
            id: userId,
            full_name: email.split('@')[0], // Default name from email
            created_at: new Date().toISOString(),
          },
        ])
        .single();

      if (error && !error.message.includes('duplicate key')) {
        throw error;
      }
    } catch (err) {
      console.error('Error creating user profile:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let authResponse;
      
      if (isSignUp) {
        authResponse = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });

        if (authResponse.data.user) {
          await createUserProfile(authResponse.data.user.id);
        }
      } else {
        authResponse = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authResponse.data.user) {
          // Check if profile exists, if not create it
          const { data: existingProfile } = await supabase
            .from('users')
            .select()
            .eq('id', authResponse.data.user.id)
            .single();

          if (!existingProfile) {
            await createUserProfile(authResponse.data.user.id);
          }
        }
      }

      if (authResponse.error) {
        if (authResponse.error.message.includes('already registered')) {
          setError('This email is already registered. Please sign in instead.');
          setIsSignUp(false);
        } else if (authResponse.error.message.includes('Invalid login')) {
          setError('Invalid email or password. Please try again.');
        } else {
          setError(authResponse.error.message);
        }
      } else if (authResponse.data.session) {
        setSession(authResponse.data.session);
      } else if (isSignUp) {
        setError('Please check your email to confirm your registration.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Brain className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome to BrainSprint
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isSignUp ? "Create your account" : "Sign in to your account"}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder={isSignUp ? "At least 6 characters" : "Enter your password"}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          <div className="mt-6">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setEmail('');
                setPassword('');
              }}
              className="w-full text-center text-sm text-indigo-600 hover:text-indigo-500"
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}