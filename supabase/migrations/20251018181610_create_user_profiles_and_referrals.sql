/*
  # Create User Profiles and Referrals System

  ## Overview
  This migration sets up a comprehensive referral tracking system with user profiles,
  company management, and referral tracking capabilities.

  ## New Tables

  ### 1. `profiles`
  User profile information linked to auth.users
  - `id` (uuid, primary key) - Links to auth.users.id
  - `email` (text) - User's email
  - `full_name` (text) - User's full name
  - `resume_url` (text) - URL to uploaded resume
  - `phone` (text, optional) - Contact number
  - `linkedin_url` (text, optional) - LinkedIn profile
  - `created_at` (timestamptz) - Profile creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `skills`
  User skills extracted from resume
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - References profiles
  - `skill_name` (text) - Name of the skill
  - `proficiency_level` (text, optional) - Beginner/Intermediate/Advanced
  - `created_at` (timestamptz)

  ### 3. `projects`
  User projects extracted from resume
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - References profiles
  - `title` (text) - Project title
  - `description` (text) - Project description
  - `technologies` (text array) - Technologies used
  - `start_date` (date, optional)
  - `end_date` (date, optional)
  - `project_url` (text, optional) - Link to project
  - `created_at` (timestamptz)

  ### 4. `education`
  User education history
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - References profiles
  - `institution` (text) - School/University name
  - `degree` (text) - Degree type
  - `field_of_study` (text) - Major/Field
  - `start_date` (date, optional)
  - `end_date` (date, optional)
  - `grade` (text, optional) - GPA or grade
  - `created_at` (timestamptz)

  ### 5. `companies`
  Companies where users want referrals
  - `id` (uuid, primary key)
  - `name` (text, unique) - Company name
  - `industry` (text, optional) - Industry type
  - `website` (text, optional) - Company website
  - `created_at` (timestamptz)

  ### 6. `employees`
  Employee contacts at companies
  - `id` (uuid, primary key)
  - `company_id` (uuid, foreign key) - References companies
  - `name` (text) - Employee name
  - `email` (text, optional) - Employee email
  - `linkedin_url` (text, optional) - LinkedIn profile
  - `position` (text, optional) - Job title
  - `is_hr` (boolean) - Whether employee is in HR
  - `created_at` (timestamptz)

  ### 7. `referrals`
  Referral requests tracking
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - References profiles
  - `company_id` (uuid, foreign key) - References companies
  - `employee_id` (uuid, foreign key, optional) - References employees
  - `template_type` (text) - Type of template used
  - `email_content` (text) - Generated email content
  - `status` (text) - pending/sent/responded/rejected
  - `sent_at` (timestamptz, optional) - When email was sent
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 8. `followups`
  Follow-up tracking for referrals
  - `id` (uuid, primary key)
  - `referral_id` (uuid, foreign key) - References referrals
  - `followup_date` (timestamptz) - Scheduled followup date
  - `notes` (text, optional) - Followup notes
  - `completed` (boolean) - Whether followup is done
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Users can only access their own data
  - Authenticated users required for all operations
  - Proper ownership checks on all policies

  ## Important Notes
  1. All tables use uuid primary keys with automatic generation
  2. Timestamps use timestamptz with automatic defaults
  3. Foreign key constraints ensure data integrity
  4. Indexes added for frequently queried columns
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  resume_url text,
  phone text,
  linkedin_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_name text NOT NULL,
  proficiency_level text,
  created_at timestamptz DEFAULT now()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  technologies text[],
  start_date date,
  end_date date,
  project_url text,
  created_at timestamptz DEFAULT now()
);

-- Create education table
CREATE TABLE IF NOT EXISTS education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  institution text NOT NULL,
  degree text NOT NULL,
  field_of_study text,
  start_date date,
  end_date date,
  grade text,
  created_at timestamptz DEFAULT now()
);

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  industry text,
  website text,
  created_at timestamptz DEFAULT now()
);

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  linkedin_url text,
  position text,
  is_hr boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  employee_id uuid REFERENCES employees(id) ON DELETE SET NULL,
  template_type text NOT NULL,
  email_content text NOT NULL,
  status text DEFAULT 'pending',
  sent_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create followups table
CREATE TABLE IF NOT EXISTS followups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_id uuid NOT NULL REFERENCES referrals(id) ON DELETE CASCADE,
  followup_date timestamptz NOT NULL,
  notes text,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_skills_user_id ON skills(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_education_user_id ON education(user_id);
CREATE INDEX IF NOT EXISTS idx_employees_company_id ON employees(company_id);
CREATE INDEX IF NOT EXISTS idx_referrals_user_id ON referrals(user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_company_id ON referrals(company_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);
CREATE INDEX IF NOT EXISTS idx_followups_referral_id ON followups(referral_id);
CREATE INDEX IF NOT EXISTS idx_followups_date ON followups(followup_date);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE followups ENABLE ROW LEVEL SECURITY;

-- Policies for profiles table
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policies for skills table
CREATE POLICY "Users can view own skills"
  ON skills FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own skills"
  ON skills FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own skills"
  ON skills FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own skills"
  ON skills FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Policies for projects table
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Policies for education table
CREATE POLICY "Users can view own education"
  ON education FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own education"
  ON education FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own education"
  ON education FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own education"
  ON education FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Policies for companies table (readable by all authenticated users)
CREATE POLICY "Authenticated users can view companies"
  ON companies FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert companies"
  ON companies FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policies for employees table (readable by all authenticated users)
CREATE POLICY "Authenticated users can view employees"
  ON employees FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert employees"
  ON employees FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policies for referrals table
CREATE POLICY "Users can view own referrals"
  ON referrals FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own referrals"
  ON referrals FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own referrals"
  ON referrals FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own referrals"
  ON referrals FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Policies for followups table
CREATE POLICY "Users can view own followups"
  ON followups FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM referrals
      WHERE referrals.id = followups.referral_id
      AND referrals.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own followups"
  ON followups FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM referrals
      WHERE referrals.id = followups.referral_id
      AND referrals.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own followups"
  ON followups FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM referrals
      WHERE referrals.id = followups.referral_id
      AND referrals.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM referrals
      WHERE referrals.id = followups.referral_id
      AND referrals.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own followups"
  ON followups FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM referrals
      WHERE referrals.id = followups.referral_id
      AND referrals.user_id = auth.uid()
    )
  );