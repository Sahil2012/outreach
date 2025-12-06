import { EmployeeDTO } from "./EmployeeDTO.js";
import { JobDTO } from "./JobDTO.js";
import { MessageDTO } from "./MessageDTO.js";

export interface ThreadDTO {
  threadId: number;
  status: string;
  type: string;
  externalId?: string | null;
  createdAt: Date;
  lastUpdated: Date;
  jobs: JobDTO[] | null;
  employee: EmployeeDTO | null;
  messages: MessageDTO[];
}
