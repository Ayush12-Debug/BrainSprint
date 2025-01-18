import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Clock, Users } from 'lucide-react';
import { useAdminStore } from '../stores/adminStore';

interface Test {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  created_at: string;
}

export default function Tests() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAdminStore();

  useEffect(() => {
    async function fetchTests() {
      try {
        const { data, error } = await supabase
          .from('tests')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTests(data || []);
      } catch (error) {
        console.error('Error fetching tests:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTests();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading tests...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Available Tests</h1>
        {isAdmin && (
          <Link
            to="/tests/create"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Create Test
          </Link>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tests.map((test) => (
          <Link
            key={test.id}
            to={`/tests/${test.id}`}
            className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {test.title}
              </h2>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {test.description}
              </p>
              <div className="flex items-center text-gray-500 text-sm">
                <Clock className="h-4 w-4 mr-1" />
                <span className="mr-4">{test.duration_minutes} minutes</span>
                <Users className="h-4 w-4 mr-1" />
                <span>Open for all</span>
              </div>
            </div>
          </Link>
        ))}

        {tests.length === 0 && (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No tests available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}