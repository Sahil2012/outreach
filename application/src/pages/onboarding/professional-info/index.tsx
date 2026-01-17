import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { CheckCircle } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { SkillsSection } from './SkillsSection';
import { ExperienceSection } from './ExperienceSection';
import { EducationSection } from './EducationSection';
import { ProjectsSection } from './ProjectsSection';
import { Project, Education, Experience } from '@/lib/types';
import { useNavigate } from 'react-router';

export default function ProfessionalInfoPage() {
  const navigate = useNavigate();
  const { profile, updateProfile, pollProfile, stopPollingProfile, isPollingProfile } = useProfile();

  const [skills, setSkills] = useState<{ name: string }[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!profile) return;

    if (profile.resumeUrl) {
      if (profile.status === "PARTIAL") {
        stopPollingProfile();
        setSkills(profile.skills || []);
        setProjects(profile.projects || []);
        setEducation(profile.education || []);
        setExperiences(profile.experiences || []);
      } else {
        pollProfile();
        return;
      }
    }
  }, [profile]);

  const handleFinish = async () => {
    setLoading(true);
    try {
      await updateProfile({ skills, projects, education, experiences, status: "COMPLETE" });
      navigate('/dashboard');
    } catch (error) {
      console.error("Failed to complete onboarding", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Professional Details</h1>
        <p className="text-muted-foreground">Add your professional background to complete your profile.</p>
      </div>

      {isPollingProfile && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader className="h-8 w-8 animate-spin text-primary" />
            <div className='flex flex-col gap-1 justify-center items-center'>
              <p className="text-lg font-medium">We are processing your resume</p>
              <p className="text-sm text-muted-foreground">Please wait for a while. This may take a few moments</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <SkillsSection skills={skills} setSkills={setSkills} />
        <ExperienceSection experiences={experiences} setExperiences={setExperiences} />
        <ProjectsSection projects={projects} setProjects={setProjects} />
        <EducationSection education={education} setEducation={setEducation} />
      </div>

      <div className="flex gap-4 pt-4">
        <Button variant="outline" className="flex-1 rounded-full" onClick={() => {
          navigate('/onboarding/basic-info')
        }}>
          Back
        </Button>
        <Button onClick={handleFinish} className="flex-1 rounded-full" disabled={loading}>
          {loading ? <Loader className="w-4 h-4 mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
          Complete Setup
        </Button>
      </div>
    </div>
  );
}
