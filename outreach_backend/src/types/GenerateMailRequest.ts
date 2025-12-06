
export type EmailType =
  | "tailored"
  | "followup"
  | "cold"
  | "thankyou";

export interface EmailRequestBase {
  userId?: string;
  type: EmailType;
  contactName: string;
  contactEmail?: string;
  companyName: string;
  role?: string;
}

export interface TailoredEmailRequest extends EmailRequestBase {
  type: "tailored";
  jobs: [string];
  jobDescription: string;
}

export interface FollowupEmailRequest extends EmailRequestBase {
  type: "followup";
  threadId: string;
}

export interface ColdEmailRequest extends EmailRequestBase {
  type: "cold";
  templateId?: string;
}

export interface ThankYouEmailRequest extends EmailRequestBase {
  type: "thankyou";
}

export type GenerateMailRequest =
  | TailoredEmailRequest
  | FollowupEmailRequest
  | ColdEmailRequest
  | ThankYouEmailRequest;
