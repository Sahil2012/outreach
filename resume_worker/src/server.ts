import { Worker } from 'bullmq';
import { redisConnection } from './utils/redis';
import { supabase } from './apis/supabaseClient';
import { log } from 'console';
import { processResume } from './service/processResume';
import extractDataFromResume from './service/extractDataFromResume';

// Define the interface for the job data
interface ResumeJob {
  userId: string;
  resumePath: string;
}

// Create a BullMQ Worker for the "resume-processing" queue
const worker = new Worker<ResumeJob>(
  'resume-processing',
  async (job) => {
    log('Processing job:', job.id);
    log('Job data:', job.data);
    const { userId, resumePath } = job.data;


    // Extract skills and data using your LLM service
    const res = await supabase.storage.from('resumes').download(resumePath);
    if (res.error || !res.data) {
      throw new Error(`Failed to download resume from path: ${resumePath}`);
    }

    const fileBuffer = await res.data.arrayBuffer();
    const parsedData = await extractDataFromResume(Buffer.from(fileBuffer));

    log('Extracted data:', parsedData);
    
    await processResume(userId, parsedData);
    log('Finished processing job:', job.id);
    return { success: true };

  },
  {
    connection: redisConnection,
    concurrency: 3,
    // Retry configuration are in job options (added when enqueuing)
  }
);

// Handle failed jobs
worker.on('failed', async (job, err) => {

  if (job?.attemptsMade && job.attemptsMade >= 3) {
    await redisConnection.lpush('resume-processing-dlq', JSON.stringify(job.data));
  }
});

export default worker;
