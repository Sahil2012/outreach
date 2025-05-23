export interface Template {
  id: string;
  name: string;
  content: string;
}

export interface RecipientInfo {
  contactName: string;
  companyName: string;
  jobIds: string[];
  jobLinks: string[];
  resumeLink?: string;
}

export interface EmailDistribution {
  emailList: string[];
  subject: string;
}