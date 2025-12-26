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
  status?: "INCOMPLETE" | "PARTIAL" | "COMPLETE";
  resumeUrl?: string;
  skills?: { name: string }[];
  projects?: Project[];
  education?: Education[];
  experiences?: Experience[];
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
  role: string;
  jobIds: string[];
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
  threadId?: number;
  messageId?: number;
}

export interface GenerateEmailResponse {
  threadId: number;
  messageId: number;
  subject: string;
  body: string;
}

export interface SendEmail {
  threadId: number;
  messageId: number;
}

export const THREAD_STATUS_VALUES = ['PENDING', 'FIRST_FOLLOWUP', 'SECOND_FOLLOWUP', 'THIRD_FOLLOWUP', 'CLOSED', 'SENT', 'REFERRED', 'DELETED'];

export type ThreadStatus = typeof THREAD_STATUS_VALUES[number];

export interface OutreachStats {
  reachedOut: number;
  reffered: number;
  followUps: number;
  absonded: number;
}

export type EmailType = "TAILORED" | "COLD";

export interface ThreadMessageCount {
  Message: number;
}

export interface ThreadEmployeeInfo {
  name: string;
  company: string | null;
  email: string;
}

export interface ThreadMetaItem {
  id: number;
  status: ThreadStatus;
  lastUpdated: Date;
  Employee: ThreadEmployeeInfo;
  automated: boolean;
  type: EmailType;
  _count: ThreadMessageCount;
}

export interface ThreadMetaResponse {
  threads: ThreadMetaItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface Draft {
  id: string;
  employeeName: string;
  employeeEmail: string;
  companyName: string;
  status: 'Generated' | 'Generating' | 'Sent';
  createdAt: string;
}