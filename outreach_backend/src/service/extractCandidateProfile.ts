import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getCandidateProfile(id: string) {
  try {
    await prisma.$connect();
    if (!id) {
      throw new Error("id is required");
    }

    console.log("Fetching candidate profile for:", id);

    // Fetch user
    const user = await prisma.userTable.findUnique({
      where: { id },
      select: {
        id: true,
        userName: true,
        email: true,
        authUserId: true,
      },
    });

    if (!user || !user.id) {
      console.warn("No user found for authUserId:", id);
      return { success: false, message: "User not found" };
    }

    const profileData = await prisma.userProfileData.findUnique({
      where: { userId: user.authUserId },
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
    const skills = profileData.profileSkills.map((s) => s.Skills.name) || [];

    const experiences =
      profileData.experiences
        ?.map(
          (exp) =>
            `${exp.role} at ${exp.companyName} from ${exp.startDate} to ${exp.endDate} working on ${exp.description}`
        )
        .join(", ") || "No experience listed";

    console.log("Profile fetched successfully for:", id);

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
