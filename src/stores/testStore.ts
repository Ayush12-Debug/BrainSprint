import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface TestStore {
  zenMode: boolean;
  setZenMode: (enabled: boolean) => void;
  checkTestAccess: (testId: string) => Promise<{
    hasAccess: boolean;
    message?: string;
  }>;
  purchaseTest: (testId: string) => Promise<{
    success: boolean;
    message: string;
  }>;
}

export const useTestStore = create<TestStore>((set) => ({
  zenMode: false,
  setZenMode: (enabled) => set({ zenMode: enabled }),
  
  checkTestAccess: async (testId) => {
    try {
      // First check if the test is free
      const { data: test } = await supabase
        .from('tests')
        .select('is_free, type_id')
        .eq('id', testId)
        .single();

      if (test?.is_free) {
        return { hasAccess: true };
      }

      // Check if user has purchased this test
      const { data: purchase } = await supabase
        .from('purchases')
        .select('attempts_remaining, valid_until')
        .eq('test_id', testId)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!purchase) {
        return { 
          hasAccess: false,
          message: 'This test requires purchase'
        };
      }

      if (purchase.attempts_remaining <= 0) {
        return {
          hasAccess: false,
          message: 'No attempts remaining for this test'
        };
      }

      if (purchase.valid_until && new Date(purchase.valid_until) < new Date()) {
        return {
          hasAccess: false,
          message: 'Test access has expired'
        };
      }

      return { hasAccess: true };
    } catch (error) {
      console.error('Error checking test access:', error);
      return {
        hasAccess: false,
        message: 'Error checking test access'
      };
    }
  },

  purchaseTest: async (testId) => {
    try {
      const { data: test } = await supabase
        .from('tests')
        .select('*, test_types(*)')
        .eq('id', testId)
        .single();

      if (!test) {
        return {
          success: false,
          message: 'Test not found'
        };
      }

      // In a real app, integrate with a payment gateway here
      // For now, we'll simulate a successful payment
      const { error } = await supabase
        .from('purchases')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          test_id: testId,
          amount_paid: test.test_types.price,
          attempts_remaining: test.test_types.attempts_allowed,
          valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        });

      if (error) throw error;

      return {
        success: true,
        message: 'Test purchased successfully'
      };
    } catch (error) {
      console.error('Error purchasing test:', error);
      return {
        success: false,
        message: 'Error purchasing test'
      };
    }
  }
}));