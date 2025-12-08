export interface Project {
  id?: string;
  title: string;
  description?: string;
  technologies?: string[];
  start_date?: Date;
  end_date?: Date;
  project_url?: string;
}

export interface Education {
  id?: string;
  institution: string;
  degree: string;
  field_of_study?: string;
  start_date?: Date;
  end_date?: Date;
  grade?: string;
  year_of_passing?: string;
}

export interface Experience {
  id?: string;
  title: string;
  company: string;
  location?: string;
  start_date?: Date;
  end_date?: Date;
  description?: string;
}

export interface Profile {
  firstName?: string;
  lastName?: string;
  isResumeUploaded?: boolean;
  isResumeParsed?: boolean;
  skills?: string[];
  projects?: Project[];
  education?: Education[];
  experience?: Experience[];
}

export interface Template {
  id: string;
  name: string;
  content: string;
}

export interface RecipientInfo {
  employeeName: string;
  employeeEmail: string;
  companyName: string;
  jobId: string;
  jobDescription?: string;
}

interface Email {
  subject: string;
  body: string;
}

export interface GeneratedEmail {
  email: Email;
  isMailGenerated?: boolean;
  isDraftCompleted?: boolean;
}

export interface SendEmail {
  subject: string,
  text: string,
  to: string
}

export type OutreachStatus = 'Generated' | 'Sent' | 'First Follow Up' | 'Second Follow Up' | 'Third Follow Up' | 'Absconded' | 'Responded' | 'Referred';

export interface OutreachStats {
  reachedOut: number;
  referred: number;
  followUps: number;
  absconded: number;
}

export interface OutreachListItem {
  id: string;
  employeeName: string;
  employeeEmail: string;
  companyName: string;
  status: OutreachStatus;
  isAutomated: boolean;
  lastActivity: string;
}

export interface OutreachMetaResponse {
    data: OutreachListItem[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }
}

export interface Draft {
  id: string;
  employeeName: string;
  employeeEmail: string;
  companyName: string;
  status: 'Generated' | 'Generating' | 'Sent';
  createdAt: string;
}