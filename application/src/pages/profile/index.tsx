import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Loader } from '../../components/ui/loader';
import {
  Plus,
  Trash2,
  Save,
  User,
  Camera,
  Briefcase,
  GraduationCap,
  Code2
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Label } from '../../components/ui/label';
import { useApi } from '@/hooks/useApi';

interface Skill {
  id?: string;
  skill_name: string;
  proficiency_level?: string;
}

interface Project {
  id?: string;
  title: string;
  description?: string;
  technologies?: string[];
  start_date?: string;
  end_date?: string;
  project_url?: string;
}

interface Education {
  id?: string;
  institution: string;
  degree: string;
  field_of_study?: string;
  start_date?: string;
  end_date?: string;
  grade?: string;
}

export default function ProfilePage() {
  const api = useApi();
  const { user, isLoaded: isUserLoaded } = useUser();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Personal Info State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (isUserLoaded && user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
    }
  }, [isUserLoaded, user]);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const response = await api.get('/profile/details');

      setSkills(response.data.skills || []);
      setProjects(response.data.projects || []);
      setEducation(response.data.education || []);
    } catch (error) {
      console.error('Failed to load profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update Clerk User Data
      if (user) {
        await user.update({
          firstName: firstName,
          lastName: lastName,
        });
      }

      // Update Backend Data
      await api.put(
        '/profile/details',
        { skills, projects, education }
      );
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      try {
        await user.setProfileImage({ file });
      } catch (error) {
        console.error('Failed to update profile image:', error);
      }
    }
  };

  const deleteItem = async (type: 'skills' | 'projects' | 'education', index: number, id?: string) => {
    if (id) {
      try {
        await api.delete(`/profile/item/${type}/${id}`);
      } catch (error) {
        console.error(`Failed to delete ${type} item:`, error);
        return;
      }
    }

    if (type === 'skills') {
      setSkills(skills.filter((_, i) => i !== index));
    } else if (type === 'projects') {
      setProjects(projects.filter((_, i) => i !== index));
    } else if (type === 'education') {
      setEducation(education.filter((_, i) => i !== index));
    }
  };

  if (loading || !isUserLoaded) {
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
        <Button onClick={handleSave} disabled={saving} className="rounded-full shadow-lg shadow-primary/20">
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
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

        {/* Skills */}
        <Card>
          <CardHeader className="border-b border-border/40 px-6 py-6 flex flex-row items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-primary" />
                <CardTitle>Skills</CardTitle>
              </div>
              <CardDescription>Add your technical skills and proficiency</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSkills([...skills, { skill_name: '', proficiency_level: '' }])}
              className="rounded-full"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Skill
            </Button>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {skills.map((skill, index) => (
              <div key={index} className="flex gap-3 items-start">
                <Input
                  value={skill.skill_name}
                  onChange={(e) => {
                    const newSkills = [...skills];
                    newSkills[index].skill_name = e.target.value;
                    setSkills(newSkills);
                  }}
                  placeholder="Skill name (e.g. React, TypeScript)"
                  className="flex-1"
                />
                <select
                  value={skill.proficiency_level || ''}
                  onChange={(e) => {
                    const newSkills = [...skills];
                    newSkills[index].proficiency_level = e.target.value;
                    setSkills(newSkills);
                  }}
                  className="h-11 px-3 py-2 border border-input bg-muted/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteItem('skills', index, skill.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {skills.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No skills added yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Projects */}
        <Card>
          <CardHeader className="border-b border-border/40 px-6 py-6 flex flex-row items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                <CardTitle>Projects</CardTitle>
              </div>
              <CardDescription>Showcase your best work</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setProjects([...projects, { title: '', description: '' }])}
              className="rounded-full"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Project
            </Button>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {projects.map((project, index) => (
              <div key={index} className="p-4 border border-border/40 rounded-2xl space-y-4 bg-muted/10">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 space-y-4">
                    <Input
                      value={project.title}
                      onChange={(e) => {
                        const newProjects = [...projects];
                        newProjects[index].title = e.target.value;
                        setProjects(newProjects);
                      }}
                      placeholder="Project Title"
                      className="font-medium"
                    />
                    <Textarea
                      value={project.description || ''}
                      onChange={(e) => {
                        const newProjects = [...projects];
                        newProjects[index].description = e.target.value;
                        setProjects(newProjects);
                      }}
                      placeholder="Describe your project..."
                      rows={3}
                      className="resize-none bg-muted/30"
                    />
                    <Input
                      value={project.project_url || ''}
                      onChange={(e) => {
                        const newProjects = [...projects];
                        newProjects[index].project_url = e.target.value;
                        setProjects(newProjects);
                      }}
                      placeholder="Project URL (https://...)"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteItem('projects', index, project.id)}
                    className="text-muted-foreground hover:text-destructive shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">No projects added yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Education */}
        <Card>
          <CardHeader className="border-b border-border/40 px-6 py-6 flex flex-row items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                <CardTitle>Education</CardTitle>
              </div>
              <CardDescription>Your academic background</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEducation([...education, { institution: '', degree: '' }])}
              className="rounded-full"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Education
            </Button>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {education.map((edu, index) => (
              <div key={index} className="p-4 border border-border/40 rounded-2xl space-y-4 bg-muted/10">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 space-y-4">
                    <Input
                      value={edu.institution}
                      onChange={(e) => {
                        const newEducation = [...education];
                        newEducation[index].institution = e.target.value;
                        setEducation(newEducation);
                      }}
                      placeholder="Institution Name"
                      className="font-medium"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        value={edu.degree}
                        onChange={(e) => {
                          const newEducation = [...education];
                          newEducation[index].degree = e.target.value;
                          setEducation(newEducation);
                        }}
                        placeholder="Degree"
                      />
                      <Input
                        value={edu.field_of_study || ''}
                        onChange={(e) => {
                          const newEducation = [...education];
                          newEducation[index].field_of_study = e.target.value;
                          setEducation(newEducation);
                        }}
                        placeholder="Field of Study"
                      />
                    </div>
                    <Input
                      value={edu.grade || ''}
                      onChange={(e) => {
                        const newEducation = [...education];
                        newEducation[index].grade = e.target.value;
                        setEducation(newEducation);
                      }}
                      placeholder="GPA / Grade (Optional)"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteItem('education', index, edu.id)}
                    className="text-muted-foreground hover:text-destructive shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {education.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No education added yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}