import { AxiosInstance } from "axios";
import { Thread, ThreadsMeta, ThreadsParams } from "./types";

export class ThreadClient {
  constructor(private client: AxiosInstance) { }

  getThreads(filters: ThreadsParams): Promise<ThreadsMeta> {
    return this.client.get("/threads", { params: filters }).then(r => r.data)
  }

  getThread(id: number): Promise<Thread> {
    return this.client.get(`/threads/${id}`).then(r => r.data);
  }

  updatedThread(thread: Partial<Thread>): Promise<Thread> {
    return this.client.patch(`/thread/${thread.id}`, thread).then(r => r.data);
  }
}