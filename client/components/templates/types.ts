// types.ts

export interface PersonalInfo {
  full_name?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  website?: string;
  image?: string | File; // for both uploaded file and URL
  profession?: string;
}

export interface Experience {
  position: string;
  company: string;
  start_date: string;
  end_date?: string;
  is_current?: boolean;
  description?: string;
}

export interface Project {
  name: string;
  description?: string;
  type?: string;
}

export interface Education {
  degree: string;
  field?: string;
  institution: string;
  graduation_date?: string;
  gpa?: string;
}

export interface ResumeData {
  personal_info?: PersonalInfo;
  professional_summary?: string;
  experience?: Experience[];
  project?: Project[];
  education?: Education[];
  skills?: string[];
}

export interface TemplateProps {
  data: ResumeData;
  accentColor: string;
}
