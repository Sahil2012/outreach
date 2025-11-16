
export type EmailType =
  | "referral"
  | "followup"
  | "cold"
  | "thankyou";

export interface EmailRequestBase {
  userId?: string;
  type: EmailType;
  contactName: string;
}

export interface ReferralEmailRequest extends EmailRequestBase {
  type: "referral";
  jobId: string;
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
  | ReferralEmailRequest
  | FollowupEmailRequest
  | ColdEmailRequest
  | ThankYouEmailRequest;
