import { ThreadPreviewDTO } from "../dto/reponse/ThreadPreviewDTO.js";

export const toThreadPreviewDTO = (thread : any) : ThreadPreviewDTO => {

    return {
        threadId: thread.id,
        status: thread.status,
        lastUpdated: thread.lastUpdated,
        firstMessage: thread.Message && thread.Message.length > 0 ? {
            id: thread.Message[0].id,
            subject: thread.Message[0].subject,
            body: thread.Message[0].body
        } : null
    };
}