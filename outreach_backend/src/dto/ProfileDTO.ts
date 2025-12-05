export interface ProfileDTO {
  summary: string | null;
  education: any | null;
  skills: Array<{
    name: string;
  }>;
  experiences: Array<{
    title: string;
    company: string;
    startDate: string;
    endDate?: string | null;
    description?: string | null;
  }>;
  readiness: string | null;
}
