export interface Skill {
  name: string;
  category?: string;
}

export interface Experience {
  role: string;
  company: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export type ProfileStatus = "INCOMPLETE" | "PROCESSING" | "PARTIAL" | "COMPLETE";

export interface Profile {
  firstName?: string;
  lastName?: string;
  summary?: string;
  email: string;
  phoneNo?: string;
  status: ProfileStatus;
  credits: number;
  education?: any;
  skills?: Skill[];
  experiences?: Experience[];
}

export interface ProfileStats {
  reachedOut: number;
  referred: number;
  followUp: number;
  absconded: number;
}