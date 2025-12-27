import EmailType from "./EmailType.js";


export interface EmailRequestBase {
  userId: string;
  type: EmailType;
  contactName: string;
  contactEmail?: string;
  companyName: string;
  role?: string;
}

export interface TailoredEmailRequest extends EmailRequestBase {
  type: EmailType.TAILORED;
  jobs: [string];
  jobDescription: string;
}

export interface FollowupEmailRequest extends EmailRequestBase {
  type: EmailType.FOLLOWUP;
  threadId: number;
}

export interface ColdEmailRequest extends EmailRequestBase {
  type: EmailType.COLD;
  templateId?: string;
}

export interface ThankYouEmailRequest extends EmailRequestBase {
  type: EmailType.THANKYOU;
}

export type GenerateMailRequest =
  | TailoredEmailRequest
  | FollowupEmailRequest
  | ColdEmailRequest
  | ThankYouEmailRequest;
