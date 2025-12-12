import { EmailType, ThreadStatus } from "@prisma/client";

export interface ThreadMetaResponse {
  threads: ThreadMetaItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ThreadMetaItem {
  status: ThreadStatus;        
  lastUpdated: Date;         
  Employee: ThreadEmployeeInfo;
  automated: boolean;
  type: EmailType;             
  _count: ThreadMessageCount;
}

export interface ThreadEmployeeInfo {
  name: string;
  company: string | null;
}

export interface ThreadMessageCount {
  Message: number;
}
