import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getCandidateProfile(authUserId: string) {
  try {
    await prisma.$connect();
    
    const profileData = await prisma.userProfileData.findUnique({
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

    if (!profileData) {
      console.warn("Profile data is missing");
      return { success: false, message: "Profile data not found for user" };
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

    console.log("Profile fetched successfully for:", profileData.authUserId);

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
    console.error("Error fetching candidate profile:", err.message);
    return {
      success: false,
      message: "Failed to fetch candidate profile",
      error: err.message,
    };
  } finally {
    // optional for scripts; skip this in long-lived apps (like Express)
    await prisma.$disconnect();
  }
}
