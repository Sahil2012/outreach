import { MessageState } from "@prisma/client";

export interface MessageDTO {
    subject?: string | null;
    body?: string | null;
    threadId?: number | null;
    messageId?: number | null;
    dateSent?: string | null;
    fromUser?: boolean | null;
    state?: MessageState | null;
}