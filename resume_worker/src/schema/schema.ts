import { z } from "zod";

const userDetailsSchema = z.object({
  name: z.string().nullable().describe("Full name of the candidate"),
  email: z.string().nullable().describe("Email address of the candidate"),
  phone: z.string().nullable().describe("Contact phone number"),
  experiences: z
    .array(
      z.object({
        startdate: z
          .string()
          .optional()
          .describe("Start date of the experience"),
        enddate: z.string().optional().describe("End date of the experience"),
        role: z.string().optional().describe("Role or position held"),
        companyName: z
          .string()
          .optional()
          .describe("Name of the company or organization"),
        description: z
          .string()
          .optional()
          .describe("Detailed experience description"),
      })
    )
    .nullable(),
  projects: z
    .array(z.string())
    .optional()
    .default([])
    .describe(
      "Notable projects, applications, or initiatives mentioned in the resume"
    ),
  skills: z
    .array(
      z.object({
        name: z.string().describe("Name of the skill or technology"),
        category: z.string().optional().describe("Category of the skill"),
      })
    )
    .optional()
    .default([])
    .describe(
      "List of technical skills, languages, frameworks, tools, or technologies"
    ),
  noticePeriod: z
    .string()
    .nullable()
    .describe(
      "Notice period or availability (default to 90 days if not provided)"
    ),
  achievements: z
    .array(z.string())
    .optional()
    .default([])
    .describe("Coding achievements, contests, awards, or recognitions"),
});

export { userDetailsSchema };
