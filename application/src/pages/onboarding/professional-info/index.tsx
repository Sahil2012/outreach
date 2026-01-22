import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { CheckCircle } from "lucide-react";
import { SkillsSection } from "./SkillsSection";
import { ExperienceSection } from "./ExperienceSection";
import { EducationSection } from "./EducationSection";
import { ProjectsSection } from "./ProjectsSection";
import { useNavigate } from "react-router";
import { useProfile } from "@/api/profile/hooks/useProfileData";
import { useProfileActions } from "@/api/profile/hooks/useProfileActions";
import { Experience, Skill } from "@/api/profile/types";

export default function ProfessionalInfoPage() {
  const navigate = useNavigate();
  // const { profile, updateProfile, pollProfile, stopPollingProfile, isPollingProfile } = useProfile();
  const { data: profile, isLoading, refetch } = useProfile();
  const { updateProfile } = useProfileActions();

  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);

  const [loading, setLoading] = useState(false);

  const [isPollingProfile, setIsPollingProfile] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();

  const pollCount = useRef(0);
  const MAX_POLL_COUNT = 1;
  const POLL_INTERVAL = 10 * 1000;

  const startPollingProfile = () => {
    setIsPollingProfile(true);
    const intervalId = setInterval(async () => {
      if (pollCount.current >= MAX_POLL_COUNT) {
        stopPollingProfile();
        return;
      }
      await refetch();
      pollCount.current++;
    }, POLL_INTERVAL);
    setIntervalId(intervalId);
  };

  const stopPollingProfile = () => {
    pollCount.current = 0;
    setIsPollingProfile(false);
    clearInterval(intervalId);
  };

  useEffect(() => {
    if (!profile) return;

    if (profile.status === "PROCESSING") {
      startPollingProfile();
    }

    if (profile.status === "PARTIAL" || profile.status === "INCOMPLETE") {
      stopPollingProfile();
      setSkills(profile.skills || []);
      // setProjects(profile.projects || []);
      setEducation(profile.education || []);
      setExperiences(profile.experiences || []);
    }
  }, [profile]);

  const handleFinish = async () => {
    setLoading(true);
    try {
      await updateProfile.mutateAsync({
        skills,
        // projects,
        education,
        experiences,
        status: "COMPLETE",
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to complete onboarding", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Professional Details
        </h1>
        <p className="text-muted-foreground">
          Add your professional background to complete your profile.
        </p>
      </div>

      {isPollingProfile && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader className="h-8 w-8 animate-spin text-primary" />
            <div className="flex flex-col gap-1 justify-center items-center">
              <p className="text-lg font-medium">
                We are processing your resume
              </p>
              <p className="text-sm text-muted-foreground">
                Please wait for a while. This may take a few moments
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <SkillsSection skills={skills} setSkills={setSkills} />
        <ExperienceSection
          experiences={experiences}
          setExperiences={setExperiences}
        />
        <ProjectsSection projects={projects} setProjects={setProjects} />
        <EducationSection education={education} setEducation={setEducation} />
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          variant="outline"
          className="flex-1 rounded-full"
          onClick={() => {
            navigate("/onboarding/basic-info");
          }}
        >
          Back
        </Button>
        <Button
          onClick={handleFinish}
          className="flex-1 rounded-full"
          disabled={loading}
        >
          {loading ? (
            <Loader className="w-4 h-4 mr-2" />
          ) : (
            <CheckCircle className="w-4 h-4 mr-2" />
          )}
          Complete Setup
        </Button>
      </div>
    </div>
  );
}
