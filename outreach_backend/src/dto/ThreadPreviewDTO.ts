
export interface ThreadPreviewDTO {
  threadId: number;
  status: string;
  lastUpdated: Date;
  firstMessage: {
    id: number
    subject: string;
    body: string;
  } | null;
}