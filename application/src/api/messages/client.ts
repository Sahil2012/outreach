import { AxiosInstance } from "axios";
import { GenerateMessageReq, Message, MessageType } from "./types";

export class MessageClient {
  constructor(private client: AxiosInstance) { }

  getMessage(id: number): Promise<Message> {
    return this.client.get(`/messages/${id}`).then(r => r.data);
  }

  updateMessage(message: Partial<Message>): Promise<Message> {
    return this.client.patch(`/message/${message.id}`, message).then(r => r.data);
  }

  createMessage(generateMessageReq: GenerateMessageReq): Promise<Message> {
    return this.client.post("/messages", generateMessageReq).then(r => r.data);
  }

  getMessageTypes(): Promise<MessageType[]> {
    return this.client.get("/messages/types").then(r => r.data);
  }

  deleteMessage(id: number): Promise<void> {
    return this.client.delete(`/messages/${id}`).then(r => r.data)
  }

  sendMessage(threadId: number, id: number, attachResume: boolean): Promise<void> {
    return this.client.post(`/message/${id}/send`, { threadId, attachResume }).then(r => r.data);
  }
}