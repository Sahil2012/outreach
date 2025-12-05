import { ProfileDTO } from "../dto/ProfileDTO.js";

export const toProfileDTO = (profile: any): ProfileDTO | null => {
  if (!profile) return null;

  return {
    summary: profile.summary,
    education: profile.education,
    skills: profile.profileSkills.map((ps: any) => (ps.Skills?.name)),
    experiences: profile.experiences.map((exp: any) => ({
      title: exp.role,
      company: exp.companyName,
      startDate: exp.startDate?.toISOString(),
      endDate: exp.endDate ? exp.endDate.toISOString() : null,
      description: exp.description
    })),
    readiness: profile.profileReadiness.completenessStatus || null,
  };
};
