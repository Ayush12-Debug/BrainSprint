export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tests: {
        Row: {
          id: string
          title: string
          description: string | null
          duration_minutes: number
          passing_score: number
          created_by: string | null
          created_at: string
          updated_at: string
          type_id: string | null
          chapter_id: string | null
          subject_id: string | null
          is_free: boolean
          requires_zen_mode: boolean
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          duration_minutes?: number
          passing_score?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
          type_id?: string | null
          chapter_id?: string | null
          subject_id?: string | null
          is_free?: boolean
          requires_zen_mode?: boolean
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          duration_minutes?: number
          passing_score?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
          type_id?: string | null
          chapter_id?: string | null
          subject_id?: string | null
          is_free?: boolean
          requires_zen_mode?: boolean
        }
      }
    }
    Enums: {
      test_status: 'pending' | 'in_progress' | 'completed' | 'expired'
      payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
      user_role: 'student' | 'teacher' | 'admin'
    }
    Functions: {
      check_test_access: {
        Args: { user_id: string; test_id: string }
        Returns: { has_access: boolean; message: string }
      }
      calculate_test_score: {
        Args: { attempt_id: string }
        Returns: { score: number; passed: boolean }
      }
    }
  }
}