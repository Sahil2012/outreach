import { ThreadDTO } from "../dto/reponse/ThreadDTO.js";
import { toEmployeeDTO } from "./employeeDTOMapper.js";
import { toJobDTO } from "./jobDTOMapper.js";
import { toMessageDTO } from "./messageDTOMapper.js";

export const toThreadDTO = (thread: any): ThreadDTO => {
  return {
    threadId: thread.id,
    status: thread.status,
    type: thread.type,
    externalId: thread.threadId ?? null,
    createdAt: thread.createdAt,
    lastUpdated: thread.lastUpdated,
    jobs: thread.Job.map((job: any) => toJobDTO(job.Job)) ?? null,
    employee: toEmployeeDTO(thread.Employee),
    messages: thread.Message.map((message: any) => (toMessageDTO(message))),
  };
}       