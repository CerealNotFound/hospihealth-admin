export interface ProjectExperience {
  project_name: string;
  client: string;
  // duration: string[];
  duration: string;
}

interface TechnicalSkills {
  [key: string]: string[];
}

export interface ResumeData {
  id: string;
  full_name: string;
  address_line_1?: string | null;
  address_line_2?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  email: string;
  phone?: string | null;
  linkedin?: string | null;
  professional_summary?: string | null;
  yoe?: number | null;
  domain?: string[] | null;
  expertise_skill?: string[] | null;
  project_experience?: ProjectExperience[] | null;
  current_ctc?: number | null;
  preferred_job_role?: string[] | null;
  preferred_job_location?: string[] | null;

  // Education
  college_name?: string | null;
  college_city?: string | null;
  college_country?: string | null;
  degree_discipline?: string | null;
  cgpa?: number | null;
  graduation_date?: string | null;
  relevant_courses?: string[] | null;

  // School
  school_name?: string | null;
  school_city?: string | null;
  school_country?: string | null;
  higher_secondary_percentage?: number | null;
  school_completion_date?: string | null;

  // Work Experience
  company_name?: string | null;
  company_city?: string | null;
  company_country?: string | null;
  designation?: string | null;
  work_from?: string | null;
  work_to?: string | null;
  work_summary?: string[] | null;

  // Publications
  published_paper?: string | null;
  journal_name?: string | null;
  volume_issue?: string | null;
  publication_year?: string | null;
  issn?: string | null;

  // Skills & Languages
  technical_skills?: TechnicalSkills | null;
  languages?: string[] | null;
  language_proficiency?: string | null;
}
