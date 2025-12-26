import { Prisma, ThreadStatus } from "@prisma/client";
import { mapEmailTypeToDB } from "../mapper/emailTypeMapper.js";
import { log } from "console";
import EmailType from "../types/EmailType.js";

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
          ThreadStatus.FIRST_FOLLOWUP,
          ThreadStatus.SECOND_FOLLOWUP,
          ThreadStatus.THIRD_FOLLOWUP,
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
  companyName?: string[],
  employeeName?: string[],
  status?: ThreadStatus[]
) {
  const skip = (page - 1) * pageSize;
  const limit = pageSize;

  const whereClause: Prisma.ThreadWhereInput = {
    authUserId,
  };

  const employeeFilter: Prisma.EmployeeWhereInput | undefined = buildEmployeeFilter(companyName, employeeName);

  if (employeeFilter) {
    log("Applying employee filters:", employeeFilter);
    whereClause.Employee = employeeFilter;
  }

  if (status && status.length > 0) {
    log("Filtering by statuses:", status);
    whereClause.status = { in: status };
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

export async function linkToExternalThread(tx: Prisma.TransactionClient, threadId: number, externalThreadId: string) {
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
            externalMessageId: externalThreadId
          }
        }
      }
    }
  })
}

function buildEmployeeFilter(
  companyName?: string[],
  employeeName?: string[]
): Prisma.EmployeeWhereInput | undefined {
  let employeeFilter: Prisma.EmployeeWhereInput | undefined = undefined;

  if (companyName && companyName.length > 0) {
    log("Filtering by company names:", companyName);
    employeeFilter = {
      ...(employeeFilter ?? {}),
      company: { in: companyName, mode: "insensitive" },
    };
  }

  if (employeeName && employeeName.length > 0) {
    log("Filtering by employee names:", employeeName);
    employeeFilter = {
      ...(employeeFilter ?? {}),
      OR: employeeName.map((n) => ({
        name: { contains: n, mode: "insensitive" },
      })),
    };
  }

  return employeeFilter;
}
