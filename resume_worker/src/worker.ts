import { Worker } from 'bullmq';
import { redisConnection } from './utils/redis';
import { supabase } from './apis/supabaseClient';
import extractSkills from './service/extractSkills';
import { log } from 'console';

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
    log(fileBuffer)
    // extractSkills(Buffer.from(fileBuffer));
    const parsedData = await extractSkills(Buffer.from(fileBuffer));
    // const parsedData = await extractSkills();
    log(`Parsed data for user ${userId}:`,parsedData);
    log(parsedData);
    // Update the Supabase table
    // const { error } = await supabase
    //   .from('User')
    //   .update({ parsedData })
    //   .eq('id', userId);

    // if (error) throw error;

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
