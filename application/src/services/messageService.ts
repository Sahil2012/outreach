import { AxiosInstance } from "axios";
import {
  GenerateMessageReq,
  Message,
  MessageType,
} from "@/lib/types/messagesTypes";

export class MessageService {
  constructor(private client: AxiosInstance) {}

  async getMessage(id: number): Promise<Message> {
    return this.client.get(`/messages/${id}`).then((r) => r.data);
  }

  async updateMessage(message: Partial<Message>): Promise<Message> {
    return this.client
      .patch(`/messages/${message.id}`, message)
      .then((r) => r.data);
  }

  async createMessage(
    generateMessageReq: GenerateMessageReq,
  ): Promise<Message> {
    return this.client
      .post("/messages", generateMessageReq)
      .then((r) => r.data);
  }

  async getMessageTypes(): Promise<MessageType[]> {
    return this.client.get("/messages/types").then((r) => r.data);
  }

  async deleteMessage(id: number): Promise<void> {
    return this.client.delete(`/messages/${id}`).then((r) => r.data);
  }

  async sendMessage(
    threadId: number,
    id: number,
    attachResume: boolean,
  ): Promise<void> {
    return this.client
      .post(`/messages/${id}/send`, { threadId, attachResume })
      .then((r) => r.data);
  }
}
