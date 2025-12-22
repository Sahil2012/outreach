export interface ProfileDTO {
  summary: string | null;
  education: any | null;
  skills: Array<{
    name: string;
  }>;
  experiences: Array<{
    title: string;
    company: string;
    startDate?: string | null;
    endDate?: string | null;
    description?: string | null;
  }>;
  status: string | null;
  firstName: string | null;
  lastName: string | null;
  resumeUrl?: string | null;
}
