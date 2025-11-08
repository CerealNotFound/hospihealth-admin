// Minimal fields for list/table view
export interface ApplicationListItem {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  yoe: number | null;
  current_ctc: number | null;
  created_at: string;
  is_deleted?: boolean;
  job_id?: string | null;
}

// Complete application with all nested relations (for detail view)
export interface Application {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  address_line_1?: string | null;
  address_line_2?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  linkedin?: string | null;
  professional_summary: string | null;
  yoe: number | null;
  current_ctc: number | null;
  domain: string[] | null;
  preferred_job_role: string[] | null;
  preferred_job_location: string[] | null;
  is_deleted?: boolean;
  created_at: string;

  education: Education[];
  work_experience: WorkExperience[];
  projects: Project[];
  published_papers: PublishedPaper[];
  technical_skills: TechnicalSkill[];
  languages: Language[];
}

export interface Education {
  id: string;
  application_id: string;
  level: string;
  institution_name: string | null;
  city: string | null;
  country: string | null;
  degree_discipline: string | null;
  cgpa: number | null;
  percentage: number | null;
  graduation_date: string | null;
  relevant_courses: string[] | null;
}

export interface WorkExperience {
  id: string;
  application_id: string;
  company_name: string | null;
  company_city: string | null;
  company_country: string | null;
  designation: string | null;
  work_from: string | null;
  work_to: string | null;
  work_summary: string[] | null;
}

export interface Project {
  id: string;
  application_id: string;
  project_name: string | null;
  project_aim: string | null;
  tech_stack: string[] | null;
  achievements: string[] | null;
}

export interface PublishedPaper {
  id: string;
  application_id: string;
  paper_title: string | null;
  journal_name: string | null;
  volume_issue: string | null;
  publication_year: string | null;
  issn: string | null;
}

export interface TechnicalSkill {
  id: string;
  application_id: string;
  skill_category: string;
  skills: string[];
}

export interface Language {
  id: string;
  application_id: string;
  language_name: string;
  proficiency: "beginner" | "intermediate" | "advanced" | "native";
}
