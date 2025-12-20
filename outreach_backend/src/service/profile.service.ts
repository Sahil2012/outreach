import prisma from "../apis/prismaClient.js";

export const getUserProfile = async (userId: string) => {
  return await prisma.userProfileData.findUnique({
    where: { userId },
    include: {
      profileSkills: {
        include: {
          Skills: true,
        },
      },
      experiences: true,
      profileReadiness: true,
    },
  });
};
