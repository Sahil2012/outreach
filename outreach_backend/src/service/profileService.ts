import prisma from "../apis/prismaClient.js";
import { ProfileDTO } from "../dto/response/ProfileDTO.js";
import { ProfileCompletenessStatus } from "@prisma/client";
import { ProfileRequest } from "../schema/profileSchema.js";

export const getUserProfile = async (userId: string) => {
  return await prisma.userProfileData.findUnique({
    where: { authUserId: userId },
    include: {
      profileSkills: {
        include: {
          Skills: true,
        },
      },
      experiences: true,
    },
  });
};

export const updateProfile = async (authUserId: string, profile: ProfileRequest) => {
  const {
    summary,
    education,
    skills,
    experiences,
    status,
    firstName,
    lastName,
  } = profile;

  return await prisma.userProfileData.update({
    where: { authUserId },
    data: {
      summary,
      education: education ?? undefined,
      firstName,
      lastName,
      status: status ? (status as ProfileCompletenessStatus) : undefined,
      experiences: experiences
        ? {
          deleteMany: {},
          create: experiences.map((exp) => ({
            companyName: exp.company,
            role: exp.title,
            startDate: exp.startDate ? new Date(exp.startDate) : undefined,
            endDate: exp.endDate ? new Date(exp.endDate) : undefined,
            description: exp.description,
          })),
        }
        : undefined,
      profileSkills: skills
        ? {
          deleteMany: {},
          create: skills.map((skill) => ({
            Skills: {
              connectOrCreate: {
                where: { name: skill.name },
                create: {
                  name: skill.name,
                  category: "Uncategorized", // Default category as per plan
                },
              },
            },
          })),
        }
        : undefined,
    },
    include: {
      profileSkills: {
        include: {
          Skills: true,
        },
      },
      experiences: true,
    },
  });
};

export const updateCredits = async (authUserId: string, deltaCredits: number) => {
  return await prisma.userProfileData.update({
    where: { authUserId },
    data: {
      credits: {
        decrement: deltaCredits,
      },
    },
  });
};

export const getUserCredits = async (authUserId: string) => {
  return await prisma.userProfileData.findUnique({
    where: { authUserId },
    select: { credits: true },
  });
};
