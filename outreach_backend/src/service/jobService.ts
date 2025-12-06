import { Prisma } from "@prisma/client";

export async function handleTailoredJobs(
  tx: Prisma.TransactionClient,
  threadId: number,
  jobs: string[],
  desc: string
) {
  for (const jobId of jobs) {
    const job = await tx.job.upsert({
      where: { jobId },
      update: { description: desc },
      create: { jobId, description: desc },
    });

    await tx.threadJobMapping.create({
      data: {
        threadId,
        jobId: job.id,
      },
    });
  }
}
