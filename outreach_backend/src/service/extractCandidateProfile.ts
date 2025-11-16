import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getCandidateProfile(authUserId: string) {
  try {
    await prisma.$connect();
    if (!authUserId) {
      throw new Error("authUserId is required");
    }

    console.log("Fetching candidate profile for:", authUserId);

    // Fetch user
    const user = await prisma.userTable.findUnique({
      where: { authUserId },
      select: {
        id: true,
        userName: true,
        email: true,
      }
    });

    if (!user || !user.id) {
      console.warn("No user found for authUserId:", authUserId);
      return { success: false, message: "User not found" };
    }

    const profileData = await prisma.userProfileData.findUnique({
      where: { userId: user.id },
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
      console.warn("User found but profile data is missing:", user.id);
      return { success: false, message: "Profile data not found for user" };
    }

    // Flatten skills and experiences
    const skills =
      profileData.profileSkills.map((s) => s.Skills) || [];

    const experiences = profileData.experiences || [];

    console.log("Profile fetched successfully for:", authUserId);

    return {
      success: true,
      userId: user.id,
      userName: user.userName,
      email: user.email,
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
