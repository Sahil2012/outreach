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

export type ProfileStatus = "INCOMPLETE" | "PROCESSING" | "PARTIAL" | "COMPLETE";

export interface Profile {
  firstName?: string;
  lastName?: string;
  summary?: string;
  email: string;
  phoneNo?: string;
  status: ProfileStatus;
  credits: number;
  education?: Education[];
  skills?: Skill[];
  experience?: Experience[];
}

export interface ProfileStats {
  reachedOut: number;
  referred: number;
  followUp: number;
  absconded: number;
}