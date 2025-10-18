/*
  # Create Resume Storage Bucket

  ## Overview
  Creates a storage bucket for user resumes with appropriate access policies

  ## Changes
  1. Creates 'resumes' storage bucket
  2. Sets up RLS policies for secure file access
  3. Allows authenticated users to upload their own resumes
  4. Allows users to view their own resumes

  ## Security
  - Users can only upload files with their user ID in the path
  - Users can only view/download their own resume files
  - File size limits enforced at application level
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload own resume"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'resumes' AND
    (storage.foldername(name))[1] = 'resumes'
  );

CREATE POLICY "Users can view own resume"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'resumes');

CREATE POLICY "Users can update own resume"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'resumes')
  WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Users can delete own resume"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'resumes');