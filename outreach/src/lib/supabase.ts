import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          resume_url: string | null;
          phone: string | null;
          linkedin_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          resume_url?: string | null;
          phone?: string | null;
          linkedin_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          resume_url?: string | null;
          phone?: string | null;
          linkedin_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      skills: {
        Row: {
          id: string;
          user_id: string;
          skill_name: string;
          proficiency_level: string | null;
          created_at: string;
        };
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          technologies: string[] | null;
          start_date: string | null;
          end_date: string | null;
          project_url: string | null;
          created_at: string;
        };
      };
      education: {
        Row: {
          id: string;
          user_id: string;
          institution: string;
          degree: string;
          field_of_study: string | null;
          start_date: string | null;
          end_date: string | null;
          grade: string | null;
          created_at: string;
        };
      };
      companies: {
        Row: {
          id: string;
          name: string;
          industry: string | null;
          website: string | null;
          created_at: string;
        };
      };
      employees: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          email: string | null;
          linkedin_url: string | null;
          position: string | null;
          is_hr: boolean;
          created_at: string;
        };
      };
      referrals: {
        Row: {
          id: string;
          user_id: string;
          company_id: string;
          employee_id: string | null;
          template_type: string;
          email_content: string;
          status: string;
          sent_at: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      followups: {
        Row: {
          id: string;
          referral_id: string;
          followup_date: string;
          notes: string | null;
          completed: boolean;
          created_at: string;
        };
      };
    };
  };
};
