export interface Template {
  id: string;
  name: string;
  content: string;
}

export interface RecipientInfo {
  userName: string,
  userContact: string,
  contactName: string;
  companyName: string;
  jobIds: string[];
  jobLinks: string[];
  jobDescription?: string;
  resumeLink?: string;
}

interface Email {
  subject: string,
  body: string
}

export interface GeneratedEmail {
  email: Email
}

export interface SendEmail {
  subject: string,
  text: string,
  to: string
}