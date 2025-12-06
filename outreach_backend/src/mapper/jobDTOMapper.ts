import { JobDTO } from "../dto/reponse/JobDTO.js";

export const toJobDTO = (job: any): JobDTO => {

    return {
        id: job.id,
        title: job.title,
        description: job.description ?? null,
        jobId: job.jobId ?? null,
    };
}