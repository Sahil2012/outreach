import { Prisma } from "@prisma/client";
import { logger } from "../utils/logger.js";
import { NotFoundError } from "../types/HttpError.js";


export async function getCandidateProfile(tx: Prisma.TransactionClient, authUserId: string) {
  try {
    const profileData = await tx.userProfileData.findUnique({
      where: { authUserId: authUserId },
      include: {
        profileSkills: {
          include: {
            Skills: true,
          },
        },
        experiences: true,
      },
    });
    logger.info(`Profile data fetched successfully for user: ${authUserId}`);

    if (!profileData) {
      logger.warn("Profile data is missing");
      throw new NotFoundError("Profile data not found for user");
    }

    // Flatten skills and experiences
    const skills = profileData.profileSkills.map((s) => s.Skills.name) || [];

    const experiences =
      profileData.experiences
        ?.map(
          (exp) =>
            `${exp.role} at ${exp.companyName} from ${exp.startDate} to ${exp.endDate} working on ${exp.description}`
        )
        .join(", ") || "No experience listed";

    logger.info(`Profile fetched successfully for user: ${profileData.authUserId}`);

    return {
      success: true,
      userId: authUserId,
      userName: `${profileData.firstName} ${profileData.lastName}`,
      email: profileData.email,
      summary: profileData.summary,
      education: profileData.education,
      skills,
      experiences,
    };
  } catch (err: any) {
    logger.error(`Error fetching candidate profile for user: ${authUserId}`, err);
    throw err;
  }
}
