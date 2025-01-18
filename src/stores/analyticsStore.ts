import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface AnalyticsStore {
  updateUserStats: (stats: {
    testsPassed?: number;
    timeTaken?: number;
    score?: number;
  }) => Promise<void>;
  updateTestAnalytics: (testId: string, stats: {
    score: number;
    timeTaken: number;
    completed: boolean;
  }) => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsStore>(() => ({
  updateUserStats: async (stats) => {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) return;

      // Get or create user stats
      const { data: existingStats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (existingStats) {
        await supabase
          .from('user_stats')
          .update({
            tests_taken: existingStats.tests_taken + 1,
            tests_passed: existingStats.tests_passed + (stats.testsPassed ? 1 : 0),
            total_time_spent: existingStats.total_time_spent + (stats.timeTaken || 0),
            average_score: (existingStats.average_score * existingStats.tests_taken + (stats.score || 0)) / (existingStats.tests_taken + 1),
            updated_at: new Date()
          })
          .eq('id', existingStats.id);
      } else {
        await supabase
          .from('user_stats')
          .insert({
            user_id: userId,
            tests_taken: 1,
            tests_passed: stats.testsPassed ? 1 : 0,
            total_time_spent: stats.timeTaken || 0,
            average_score: stats.score || 0
          });
      }
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  },

  updateTestAnalytics: async (testId, stats) => {
    try {
      const { data: existingAnalytics } = await supabase
        .from('test_analytics')
        .select('*')
        .eq('test_id', testId)
        .single();

      if (existingAnalytics) {
        const totalAttempts = existingAnalytics.total_attempts + 1;
        await supabase
          .from('test_analytics')
          .update({
            total_attempts: totalAttempts,
            average_score: (existingAnalytics.average_score * existingAnalytics.total_attempts + stats.score) / totalAttempts,
            completion_rate: (existingAnalytics.completion_rate * existingAnalytics.total_attempts + (stats.completed ? 100 : 0)) / totalAttempts,
            average_time_minutes: (existingAnalytics.average_time_minutes * existingAnalytics.total_attempts + stats.timeTaken) / totalAttempts,
            updated_at: new Date()
          })
          .eq('id', existingAnalytics.id);
      } else {
        await supabase
          .from('test_analytics')
          .insert({
            test_id: testId,
            total_attempts: 1,
            average_score: stats.score,
            completion_rate: stats.completed ? 100 : 0,
            average_time_minutes: stats.timeTaken,
            difficulty_rating: 0
          });
      }
    } catch (error) {
      console.error('Error updating test analytics:', error);
    }
  }
}));