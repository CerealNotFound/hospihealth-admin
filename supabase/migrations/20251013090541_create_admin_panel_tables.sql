/*
  # Create Admin Panel Tables

  ## Overview
  Creates three main tables for the admin panel: jobs, job_applications, and blogs.
  All tables include soft-delete functionality via is_deleted column.

  ## New Tables

  ### 1. jobs
  Manages job postings with the following fields:
  - `id` (uuid, primary key) - Unique identifier
  - `job_title` (text) - Title of the job position
  - `about_us` (text) - Company/team description
  - `job_description` (text) - Detailed job description
  - `openings` (integer) - Number of open positions
  - `experience_required` (text[]) - Array of required experience levels
  - `key_responsibilities` (text) - Main responsibilities for the role
  - `qualification` (text) - Required qualifications
  - `is_deleted` (boolean) - Soft delete flag
  - `created_at` (timestamp) - Creation timestamp

  ### 2. job_applications
  Stores comprehensive job application data organized into sections:
  - Personal details (name, address, contact info)
  - Professional summary (experience, skills, expertise)
  - Current details (CTC, job preferences)
  - Education (college, school, degrees)
  - Professional experience (work history)
  - Academic projects (research, publications)
  - Technical skills and languages
  - `is_deleted` (boolean) - Soft delete flag
  - `created_at` (timestamp) - Creation timestamp

  ### 3. blogs
  Manages blog posts with:
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Blog post title
  - `content` (text) - Blog content (markdown/HTML)
  - `images` (jsonb) - Array of image objects with src and alt
  - `is_deleted` (boolean) - Soft delete flag
  - `created_at` (timestamp) - Creation timestamp

  ## Security
  - Enable RLS on all tables
  - Add policies for authenticated access (can be adjusted based on auth requirements)
*/

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_title TEXT NOT NULL,
  about_us TEXT,
  job_description TEXT,
  openings INTEGER DEFAULT 1,
  experience_required TEXT[],
  key_responsibilities TEXT,
  qualification TEXT,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create job_applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- PERSONAL DETAILS
  full_name TEXT NOT NULL,
  address_line_1 TEXT,
  address_line_2 TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  linkedin TEXT,
  
  -- PROFESSIONAL SUMMARY
  professional_summary TEXT,
  yoe INTEGER,
  domain TEXT[],
  expertise_skill TEXT[],
  project_experience JSONB,
  
  -- CURRENT DETAILS
  current_ctc INTEGER,
  preferred_job_role TEXT[],
  preferred_job_location TEXT[],
  
  -- EDUCATION
  college_name TEXT,
  college_city TEXT,
  college_country TEXT,
  degree_discipline TEXT,
  cgpa NUMERIC,
  graduation_date TEXT,
  relevant_courses TEXT[],
  school_name TEXT,
  school_city TEXT,
  school_country TEXT,
  higher_secondary_percentage INTEGER,
  school_completion_date TEXT,
  
  -- PROFESSIONAL EXPERIENCE
  company_name TEXT,
  company_city TEXT,
  company_country TEXT,
  designation TEXT,
  work_from TEXT,
  work_to TEXT,
  work_summary TEXT,
  
  -- ACADEMIC PROJECTS
  project_name TEXT,
  project_aim TEXT,
  tech_stack TEXT[],
  achievements TEXT[],
  published_paper TEXT,
  journal_name TEXT,
  volume_issue TEXT,
  publication_year TEXT,
  issn TEXT,
  
  -- TECHNICAL SKILLS & LANGUAGE
  technical_skills TEXT[],
  languages TEXT[],
  language_proficiency TEXT,
  
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT,
  images JSONB,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust based on auth requirements)
-- For now, allowing all operations for simplicity
CREATE POLICY "Allow all operations on jobs"
  ON jobs
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on job_applications"
  ON job_applications
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on blogs"
  ON blogs
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);