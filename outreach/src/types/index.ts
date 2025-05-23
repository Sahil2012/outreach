export interface Template {
  id: string;
  name: string;
  content: string;
}

export interface RecipientInfo {
  userName : string,
  userContact : string,
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