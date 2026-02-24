// types.ts

export interface PersonalInfo {
  fullName?: string;
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
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
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
  graduationDate?: string;
  gpa?: string;
}

export interface ResumeData {
  personalInfo?: PersonalInfo;
  professionalSummary?: string;
  workExperience?: Experience[];
  projects?: Project[];
  education?: Education[];
  skills?: string[];
}

export interface TemplateProps {
  data: ResumeData;
  accentColor: string;
  alignment?: string;
}
