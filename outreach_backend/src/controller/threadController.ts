import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger.js";
import { extractThreadMeta, getThreadById, updateAutomated, updateStatus, syncThreadWithGoogle } from "../service/threadService.js";
import prisma from "../apis/prismaClient.js";
import { getAuth } from "@clerk/express";

import { toThreadDTO } from "../mapper/threadDTOMapper.js";
import { MessageStatus, ThreadStatus } from "@prisma/client";
import { ThreadDetailResponse, ThreadMetaResponse, ThreadMetaParams, UpdateThreadRequest, UpdateThreadResponse } from "../schema/threadSchema.js";

function parseCSVQuery(q?: string | string[] | undefined): string[] | undefined {
  if (!q) return undefined;
  if (Array.isArray(q)) return q.flatMap(s => s.split(",").map(x => x.trim()).filter(Boolean));
  return q.split(",").map(x => x.trim()).filter(Boolean);
}

export const getThread = async (
  req: Request,
  res: Response<ThreadDetailResponse | { error: string }>,
  next: NextFunction
) => {

  const threadId = parseInt(req.params.threadId as string, 10);

  if (isNaN(threadId)) {
    return res.status(400).json({ error: "Invalid thread ID" });
  }

  const { userId: clerkUserId } = getAuth(req) as { userId: string | null };
  logger.info("Fetching single thread", { userId: clerkUserId, threadId });

  try {
    const sync = await syncThreadWithGoogle(prisma, clerkUserId!, threadId);
    const thread = await getThreadById(prisma, clerkUserId!, threadId);

    if (!thread) {
      logger.info("Thread not found", { userId: clerkUserId, threadId });
      return res.status(404).json({ error: "Thread not found" });
    }

    logger.info("Thread fetched successfully", { userId: clerkUserId, threadId });
    // Assuming toThreadDTO returns compatible type, checking if sync needs to be merged
    const threadDTO = toThreadDTO(thread);
    return res.status(200).json({ ...threadDTO, sync });
  } catch (error) {
    logger.error("Error fetching thread", error);
    next(error);
  }
}

export const getThreads = async (
  req: Request<{}, {}, {}, ThreadMetaParams>,
  res: Response<ThreadMetaResponse | { error: string }>,
  next: NextFunction
) => {
  try {

    const { userId: clerkUserId } = getAuth(req) as { userId: string | null };
    logger.info("Fetching threads list", { userId: clerkUserId, query: req.query });

    // parse query params with defaults and limits
    const page = Math.max(1, Number(req.query.page ?? 1));
    const pageSizeRequested = Number(req.query.pageSize ?? 10);
    const MAX_PAGE_SIZE = 100;
    const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, isNaN(pageSizeRequested) ? 10 : pageSizeRequested));

    const search = parseCSVQuery(req.query.search as any); // string[] | undefined
    const threadStatus = parseCSVQuery(req.query.status as any);
    const messageState = parseCSVQuery(req.query.messageState as any)?.map((s) => (s.toUpperCase() as MessageStatus));

    let status: ThreadStatus[] | undefined = undefined;

    if (threadStatus && threadStatus.length > 0) {
      status = [];

      for (const s of threadStatus) {
        const upper = s.toUpperCase();
        if (upper === "FOLLOW_UP") {
          status.push(ThreadStatus.FIRST_FOLLOW_UP, ThreadStatus.SECOND_FOLLOW_UP, ThreadStatus.THIRD_FOLLOW_UP);
        } else if ((Object.keys(ThreadStatus) as string[]).includes(upper)) {
          status.push(upper as ThreadStatus);
        } else {
          // invalid status provided, return empty result immediately
          // Need to conform to ThreadMetaResponse if returning 200
          logger.warn("Invalid thread status provided", { userId: clerkUserId, threadStatus });
          return res.status(200).json({
            threads: [],
            total: 0,
            page,
            pageSize,
          });
        }
      }
    }
    // call service using prisma client (no explicit transaction needed here)
    const meta = await extractThreadMeta(
      prisma,
      clerkUserId!,
      page,
      pageSize,
      search,
      messageState,
      status
    );

    const threads = meta.threads.map(thread => ({
      ...thread,
      lastUpdated: thread.lastUpdated.toISOString(),
      createdAt: thread.createdAt.toISOString(),
      jobs: thread.jobs.map(j => j.job) || []
    }));

    logger.info("Threads list fetched successfully", { userId: clerkUserId, count: meta.threads.length });
    return res.status(200).json({
      ...meta,
      threads
    });
  } catch (err) {
    logger.error("Error fetching thread meta", err);
    next(err);
  }
};

export const updateThread = async (
  req: Request<{ threadId: string }, {}, UpdateThreadRequest>,
  res: Response<UpdateThreadResponse>,
  next: NextFunction
) => {
  try {
    const { status, isAutomated } = req.body;
    let updatedThread;
    const { userId: clerkUserId } = getAuth(req) as { userId: string | null };
    logger.info("Updating thread status", { userId: clerkUserId, threadId: req.params.threadId, status, isAutomated });

    if (status) {
      updatedThread = await updateStatus(prisma, parseInt(req.params.threadId), status, clerkUserId!);
    }
    if (isAutomated !== undefined && isAutomated !== null) {
      updatedThread = await updateAutomated(prisma, parseInt(req.params.threadId), isAutomated);
    }

    logger.info("Thread updated successfully", { userId: clerkUserId, threadId: req.params.threadId });
    return res.status(200).json(toThreadDTO(updatedThread));
  } catch (error) {
    logger.error("Error updating thread status", error);
    next(error);
  }
};