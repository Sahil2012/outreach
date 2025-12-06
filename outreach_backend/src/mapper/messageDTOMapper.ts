import { MessageDTO } from "../dto/reponse/MessageDTO.js";

export const toMessageDTO = (message: any): MessageDTO => {
    return {
        subject: message.subject,
        body: message.body,
        threadId: message.threadId,
        messageId: message.id,
        dateSent: message.date ? message.date.toISOString() : null,
        fromUser: message.fromUser,
    };
}