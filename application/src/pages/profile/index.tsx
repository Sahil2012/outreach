import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Loader } from '../../components/ui/loader';
import {
  Save,
  User,
  Camera,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Label } from '../../components/ui/label';
import { useProfile } from '@/hooks/useProfile';
import { Project, Education, Experience } from '@/lib/types';
import { toast } from 'sonner';
import { SkillsSection } from '../onboarding/professional-info/SkillsSection';
import { ExperienceSection } from '../onboarding/professional-info/ExperienceSection';
import { ProjectsSection } from '../onboarding/professional-info/ProjectsSection';
import { EducationSection } from '../onboarding/professional-info/EducationSection';

export default function ProfilePage() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { profile, isLoading, updateProfile, isUpdating } = useProfile();
  const navigate = useNavigate();

  const [skills, setSkills] = useState<{ name: string }[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);

  // Personal Info State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // Track original data for change detection
  const [originalData, setOriginalData] = useState({
    firstName: '',
    lastName: '',
    skills: [] as { name: string }[],
    projects: [] as Project[],
    education: [] as Education[],
    experiences: [] as Experience[],
  });

  // Initialize from Clerk user
  useEffect(() => {
    if (isUserLoaded && user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
    }
  }, [isUserLoaded, user]);

  // Initialize from profile data
  useEffect(() => {
    if (profile) {
      const profileSkills = profile.skills || [];
      const profileProjects = profile.projects || [];
      const profileEducation = profile.education || [];
      const profileExperiences = profile.experiences || [];

      setSkills(profileSkills);
      setProjects(profileProjects);
      setEducation(profileEducation);
      setExperiences(profileExperiences);

      // Store original data for comparison
      setOriginalData({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        skills: JSON.parse(JSON.stringify(profileSkills)),
        projects: JSON.parse(JSON.stringify(profileProjects)),
        education: JSON.parse(JSON.stringify(profileEducation)),
        experiences: JSON.parse(JSON.stringify(profileExperiences)),
      });
    }
  }, [profile, user]);

  // Check if data has changed
  const hasChanges = () => {
    return (
      firstName !== originalData.firstName ||
      lastName !== originalData.lastName ||
      JSON.stringify(skills) !== JSON.stringify(originalData.skills) ||
      JSON.stringify(projects) !== JSON.stringify(originalData.projects) ||
      JSON.stringify(education) !== JSON.stringify(originalData.education) ||
      JSON.stringify(experiences) !== JSON.stringify(originalData.experiences)
    );
  };

  const handleSave = async () => {
    try {
      await updateProfile({
        firstName,
        lastName,
        skills,
        projects,
        education,
        experiences,
      });
      toast.success('Profile updated successfully!');
      
      // Update original data to current state after successful save
      setOriginalData({
        firstName,
        lastName,
        skills: JSON.parse(JSON.stringify(skills)),
        projects: JSON.parse(JSON.stringify(projects)),
        education: JSON.parse(JSON.stringify(education)),
        experiences: JSON.parse(JSON.stringify(experiences)),
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      try {
        await user.setProfileImage({ file });
        toast.success('Profile image updated successfully!');
      } catch (error) {
        console.error('Failed to update profile image:', error);
        toast.error('Failed to update profile image.');
      }
    }
  };

  if (isLoading || !isUserLoaded) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader size="lg" text="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Profile & Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your personal information and professional profile</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={!hasChanges() || isUpdating} 
          className="rounded-full shadow-lg shadow-primary/20"
        >
          <Save className="w-4 h-4 mr-2" />
          {isUpdating ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid gap-8">
        {/* Personal Information */}
        <Card>
          <CardHeader className="border-b border-border/40 px-6 py-6">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <CardTitle>Personal Information</CardTitle>
            </div>
            <CardDescription>Update your photo and personal details</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <Avatar className="w-24 h-24 border-4 border-background shadow-xl">
                  <AvatarImage src={user?.imageUrl} />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    {user?.firstName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer backdrop-blur-sm">
                  <Camera className="w-6 h-6" />
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-lg">{user?.fullName || 'User'}</h3>
                <p className="text-sm text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
                <p className="text-xs text-muted-foreground">Click the avatar to change your photo</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills Section - Using onboarding component */}
        <SkillsSection skills={skills} setSkills={setSkills} />

        {/* Experience Section - Using onboarding component */}
        <ExperienceSection experiences={experiences} setExperiences={setExperiences} />

        {/* Projects Section - Using onboarding component */}
        <ProjectsSection projects={projects} setProjects={setProjects} />

        {/* Education Section - Using onboarding component */}
        <EducationSection education={education} setEducation={setEducation} />
      </div>
    </div>
  );
}