export enum MessageType {
  FOLLOW_UP = "FOLLOW_UP",
  COLD = "COLD",
  TAILORED = "TAILORED",
  THANK_YOU = "THANK_YOU"
}

interface ContactInfo {
  contactName: string;
  contactEmail: string;
  companyName: string;
  role: string;
}

interface TailoredEmail extends ContactInfo {
  type: MessageType.TAILORED,
  jobs: string[];
  jobDescription: string;
}

interface ColdEmailBody extends ContactInfo {
  type: MessageType.COLD;
  templateId?: string;
}

interface FollowupEmailBody {
  type: MessageType.FOLLOW_UP;
  threadId: number;
}

interface ThankYouEmailBody {
  type: MessageType.THANK_YOU;
  threadId: number;
}

export type GenerateMessageReq = TailoredEmail | ColdEmailBody | FollowupEmailBody | ThankYouEmailBody

export type MessageStatus = "DRAFT" | "SENT";
export interface Message {
  id: number;
  threadId: number;
  subject: string;
  body: string;
  date: string;
  fromUser: boolean;
  status: MessageStatus;
}
