import { AxiosInstance } from "axios";
import { Thread, ThreadsMeta, ThreadsParams } from "@/lib/types/threadsTypes";

export class ThreadService {
  constructor(private client: AxiosInstance) {}

  async getThreads(filters: ThreadsParams): Promise<ThreadsMeta> {
    return this.client.get("/threads", { params: filters }).then((r) => r.data);
  }

  async getThread(id: number): Promise<Thread> {
    return this.client.get(`/threads/${id}`).then((r) => r.data);
  }

  async updatedThread(thread: Partial<Thread>): Promise<Thread> {
    return this.client
      .patch(`/thread/${thread.id}`, thread)
      .then((r) => r.data);
  }
}
