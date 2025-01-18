import React, { useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAdminStore } from '../stores/adminStore';
import { Shield, Upload, Users, BookOpen, Settings } from 'lucide-react';

export default function Admin() {
  const { isAdmin, adminKey, setAdminKey } = useAdminStore();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminKey(adminKey);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setMessage('');

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const csvContent = event.target?.result as string;
        const rows = csvContent.split('\n').filter(row => row.trim());
        const headers = rows[0].split(',');
        const questions = rows.slice(1).map(row => {
          const values = row.split(',');
          return {
            question_text: values[0],
            options: JSON.stringify(values.slice(1, -1)),
            correct_answer: values[values.length - 1],
            test_id: '', // Will be set when creating a test
            points: 1
          };
        });

        const { data: test, error: testError } = await supabase
          .from('tests')
          .insert({
            title: file.name.replace('.csv', ''),
            description: `Uploaded test with ${questions.length} questions`,
            duration_minutes: 30,
            passing_score: 70
          })
          .select()
          .single();

        if (testError) throw testError;

        const questionsWithTestId = questions.map(q => ({
          ...q,
          test_id: test.id
        }));

        const { error: questionsError } = await supabase
          .from('questions')
          .insert(questionsWithTestId);

        if (questionsError) throw questionsError;

        setMessage('Test uploaded successfully!');
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (error) {
        console.error('Error uploading test:', error);
        setMessage('Error uploading test. Please check the file format.');
      } finally {
        setLoading(false);
      }
    };

    reader.readAsText(file);
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="h-6 w-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Admin Access</h1>
          </div>
          <form onSubmit={handleKeySubmit}>
            <input
              type="password"
              placeholder="Enter admin key"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="submit"
              className="w-full mt-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Access Admin Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Upload className="h-6 w-6 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Upload Test (CSV)
            </h2>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          {message && (
            <p className={`mt-2 text-sm ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
              {message}
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="h-6 w-6 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              User Management
            </h2>
          </div>
          <button
            onClick={() => {/* Implement user management */}}
            className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Manage Users
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-4">
            <BookOpen className="h-6 w-6 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Test Management
            </h2>
          </div>
          <button
            onClick={() => {/* Implement test management */}}
            className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Manage Tests
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Settings className="h-6 w-6 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            System Settings
          </h2>
        </div>
        {/* Add system settings controls here */}
      </div>
    </div>
  );
}