import { MessageState, Prisma, ThreadStatus } from "@prisma/client";
import { mapEmailTypeToDB } from "../mapper/emailTypeMapper.js";
import { log } from "console";
import EmailType from "../types/EmailType.js";
import externalMailService from "./externalMailService.js";
import { getLastMessage, populateMessagesForThread } from "./messageService.js";

const status = [
  ThreadStatus.PENDING,
  ThreadStatus.SENT,
  ThreadStatus.FIRST_FOLLOW_UP,
  ThreadStatus.SECOND_FOLLOW_UP,
  ThreadStatus.THIRD_FOLLOW_UP
]

export async function createThread(
  tx: Prisma.TransactionClient,
  authUserId: string,
  employeeId: number,
  type: EmailType.COLD | EmailType.TAILORED
) {
  log(
    "Creating thread for user:",
    authUserId,
    "and employee:",
    employeeId,
    "of type:",
    type
  );
  return tx.thread.create({
    data: {
      authUserId,
      employeeId,
      type: mapEmailTypeToDB(type),
      lastUpdated: new Date(),
    },
  });
}

export async function getThreadPreview(
  tx: Prisma.TransactionClient,
  authUserId: string,
  threadId: number
) {
  log("Fetching preview for thread ID:", threadId);
  return tx.thread.findUnique({
    where: { id: threadId, AND: { authUserId: authUserId } },
    include: {
      Message: {
        orderBy: {
          date: "desc",
        },
        take: 1,
      },
    },
  });
}

export async function getThreadById(
  tx: Prisma.TransactionClient,
  authUserId: string,
  threadId: number
) {
  log("Fetching full thread for thread ID:", threadId);
  return tx.thread.findUnique({
    where: { id: threadId, AND: { authUserId: authUserId } },
    include: {
      Message: {
        orderBy: {
          date: "asc",
        },
      },
      Employee: true,
      Job: {
        select: {
          Job: true,
        },
      },
    },
  });
}

export async function syncThreadWithGoogle(
  tx: Prisma.TransactionClient,
  authUserId: string,
  threadId: number
) {
  log("Fetching thread messages for thread ID from external source:", threadId);
  let messages: any[] = [];
  let status = true;
  let code = "";

  try {
    messages = await externalMailService.getThreadMessage(threadId, authUserId);
  } catch (err: any) {
    console.error("Error fetching thread messages from external source:", err.message);
    status = false;
    code = err.message;
  }

  log("Populating messages for thread ID:", threadId);
  try {
    await populateMessagesForThread(tx, threadId, authUserId, messages);
  } catch (err: any) {
    console.error("Error populating messages for thread ID:", threadId, err.message);
    status = false;
    code = err.message;
  }

  return status ? { status } : { status, code };
}

export async function getStats(
  tx: Prisma.TransactionClient,
  authUserId: string
) {
  console.log("Calculating stats for user:", authUserId);

  const statQueries = {
    followUps: {
      authUserId,
      status: {
        in: [
          ThreadStatus.FIRST_FOLLOW_UP,
          ThreadStatus.SECOND_FOLLOW_UP,
          ThreadStatus.THIRD_FOLLOW_UP,
        ],
      },
    },
    absonded: {
      authUserId,
      status: ThreadStatus.CLOSED,
    },
    reachedOut: {
      authUserId,
      status: ThreadStatus.SENT,
    },
    reffered: {
      authUserId,
      status: ThreadStatus.REFFERED,
    },
  };

  const [followUps, absonded, reachedOut, reffered] = await Promise.all([
    tx.thread.count({ where: statQueries.followUps }),
    tx.thread.count({ where: statQueries.absonded }),
    tx.thread.count({ where: statQueries.reachedOut }),
    tx.thread.count({ where: statQueries.reffered }),
  ]);

  return {
    followUps,
    absonded,
    reachedOut,
    reffered,
  };
}

export async function extractThreadMeta(
  tx: Prisma.TransactionClient,
  authUserId: string,
  page: number,
  pageSize: number,
  search?: string[],
  messageState?: MessageState[],
  status?: ThreadStatus[]
) {
  const skip = (page - 1) * pageSize;
  const limit = pageSize;

  const whereClause: Prisma.ThreadWhereInput = {
    authUserId,
  };

  const employeeFilter: Prisma.EmployeeWhereInput | undefined = buildEmployeeFilter(search, search);

  if (employeeFilter) {
    log("Applying employee filters:", employeeFilter);
    whereClause.Employee = employeeFilter;
  }

  if (status && status.length > 0) {
    log("Filtering by statuses:", status);
    whereClause.status = { in: status };
  }

  if (messageState && messageState.length > 0) {
    log("Filtering by message states:", messageState);
    whereClause.Message = { some: { state: { in: messageState } } };
  }

  log("Fetching threads for user:", authUserId);

  const [threads, total] = await Promise.all([
    tx.thread.findMany({
      where: whereClause,
      orderBy: { lastUpdated: "desc" },
      skip,
      take: limit,
      select: {
        status: true,
        lastUpdated: true,
        Employee: {
          select: {
            name: true,
            company: true,
            email: true,
          },
        },
        Message: {
          orderBy: { date: "desc" },
          take: 1,
          select: {
            id: true,
            state: true,
          },
        },
        automated: true,
        type: true,
        id: true,
        _count: {
          select: { Message: true },
        },
      },
    }),
    tx.thread.count({ where: whereClause }),
  ]);

  return {
    threads,
    total,
    page,
    pageSize,
  };
}

export async function linkToExternalThread(tx: Prisma.TransactionClient, threadId: number, externalThreadId: string, externalMessageId: string) {
  log("Linking thread", threadId, "to external thread", externalThreadId);
  return tx.thread.update({
    where: { id: threadId },
    data: {
      externalThreadId,
      Message: {
        updateMany: {
          where: {
            threadId: threadId
          },
          data: {
            externalMessageId: externalMessageId
          }
        }
      }
    }
  })
}

export async function updateStatus(tx: Prisma.TransactionClient, threadId: number, status: ThreadStatus, authUserId: string) {
  log("Updating status of thread", threadId, "to", status);
  return await tx.thread.update({
    where: { id: threadId, authUserId },
    data: {
      status
    }
  });
}

export async function upgradeThreadStatus(tx: Prisma.TransactionClient, threadId: number, userId: string) {
  log("Upgrading status of thread", threadId);

  const currentStatus = await tx.thread.findUnique({ where: { id: threadId } });
  if (!currentStatus
    || currentStatus.status === ThreadStatus.CLOSED
    || currentStatus.status === ThreadStatus.REFFERED
    || currentStatus.status === ThreadStatus.DELETED
    || currentStatus.status === ThreadStatus.THIRD_FOLLOW_UP
  ) {
    throw new Error("Thread not found or already in unupgradable state");
  }

  const lastMessage = await getLastMessage(tx, threadId, userId);

  if (lastMessage?.state === MessageState.SENT) {
    return;
  }

  return await updateStatus(tx, threadId, calculateNextState(currentStatus.status), userId);
}

export async function updateAutomated(tx: Prisma.TransactionClient, threadId: number, automated: boolean) {
  log("Updating automated status of thread", threadId, "to", automated);
  return tx.thread.update({
    where: { id: threadId },
    data: {
      automated,
    }
  });
}

function buildEmployeeFilter(
  companyName?: string[],
  employeeName?: string[]
): Prisma.EmployeeWhereInput | undefined {
  let employeeFilter: Prisma.EmployeeWhereInput[] = [];

  if (companyName && companyName.length > 0) {
    log("Filtering by company names:", companyName);
    employeeFilter.push({
      company: { in: companyName, mode: "insensitive" },
    });
  }

  if (employeeName && employeeName.length > 0) {
    log("Filtering by employee names:", employeeName);
    employeeFilter.push({
      OR: employeeName.map((n) => ({
        name: { contains: n, mode: "insensitive" },
      })),
    });
  }

  if (employeeFilter.length == 0) return undefined;

  return {
    OR: employeeFilter,
  };
}

function calculateNextState(currentStatus: ThreadStatus): ThreadStatus {
  const index = status.findIndex((s) => s === currentStatus);
  if (index === -1) {
    return currentStatus;
  }
  return status[index + 1];
}