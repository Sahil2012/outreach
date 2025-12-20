import { Prisma } from "@prisma/client";
import { log } from "console";

export async function handleTailoredJobs(
  tx: Prisma.TransactionClient,
  threadId: number,
  jobs: string[],
  desc: string
) {

    log("Handling tailored jobs for thread:", threadId);
    for (const jobId of jobs) {
      log("Upserting job with ID:", jobId);
      const job = await tx.job.upsert({
        where: { jobId },
        update: { description: desc },
        create: { jobId, description: desc },
      });
      log("Mapping job to thread:", jobId, "->", threadId);
      await tx.threadJobMapping.create({
        data: {
          threadId,
          jobId: job.id,
        },
      });
    }
}
