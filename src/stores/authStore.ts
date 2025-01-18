import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  loading: boolean;
  setSession: (session: Session | null) => void;
  signOut: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  loading: true,
  setSession: (session) => set({ session, loading: false }),
  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null });
  },
  initializeAuth: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({ session, loading: false });

      // Set up auth state change listener
      supabase.auth.onAuthStateChange((_event, session) => {
        set({ session, loading: false });
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ loading: false });
    }
  },
}));