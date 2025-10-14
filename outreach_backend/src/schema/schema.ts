import { z } from "zod";

const userDetailsSchema = z.object({
    name: z.string().describe("Full name of the candidate"),
    email: z.string().describe("Email address"),
    phone: z.string().describe("Contact phone number"),
    experience: z.string().describe("Overall professional experience"),
    skills: z.array(z.string()).describe("List of technical skills"),
    noticePeriod: z.string().optional().describe("Availability or notice period"),
    achievements: z.array(z.string()).optional().describe("List of achievements or recognitions"),
});

const emailSchema = z.object({
    subject : z.string().describe('Subject line relevant to the job and candidate'),
    body : z.string().describe('Email body')
})

export {userDetailsSchema, emailSchema};