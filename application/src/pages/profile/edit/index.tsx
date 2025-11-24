import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Loader } from '../../../components/ui/loader';
import { Plus, Trash2, Save } from 'lucide-react';
import axios from 'axios';

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

export default function ProfileEditPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { getToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const token = await getToken();
      const response = await axios.get('http://localhost:3000/profile/details', {
        headers: { Authorization: `Bearer ${token}` },
      });

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
      const token = await getToken();
      await axios.put(
        'http://localhost:3000/profile/details',
        { skills, projects, education },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (type: 'skills' | 'projects' | 'education', index: number, id?: string) => {
    if (id) {
      try {
        const token = await getToken();
        await axios.delete(`http://localhost:3000/profile/item/${type}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error(`Failed to delete ${type} item:`, error);
        return; // Don't remove from state if delete failed
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Loader size="lg" text="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Edit Profile</h1>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-slate-800">Skills</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSkills([...skills, { skill_name: '', proficiency_level: '' }])}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Skill
                </Button>
              </div>
              <div className="space-y-3">
                {skills.map((skill, index) => (
                  <div key={index} className="flex gap-3">
                    <Input
                      value={skill.skill_name}
                      onChange={(e) => {
                        const newSkills = [...skills];
                        newSkills[index].skill_name = e.target.value;
                        setSkills(newSkills);
                      }}
                      placeholder="Skill name"
                      className="flex-1"
                    />
                    <select
                      value={skill.proficiency_level || ''}
                      onChange={(e) => {
                        const newSkills = [...skills];
                        newSkills[index].proficiency_level = e.target.value;
                        setSkills(newSkills);
                      }}
                      className="px-3 py-2 border border-slate-300 rounded-lg"
                    >
                      <option value="">Level</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteItem('skills', index, skill.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-slate-800">Projects</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setProjects([...projects, { title: '', description: '' }])}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Project
                </Button>
              </div>
              <div className="space-y-4">
                {projects.map((project, index) => (
                  <div key={index} className="p-4 border border-slate-200 rounded-lg space-y-3">
                    <div className="flex justify-between">
                      <Input
                        value={project.title}
                        onChange={(e) => {
                          const newProjects = [...projects];
                          newProjects[index].title = e.target.value;
                          setProjects(newProjects);
                        }}
                        placeholder="Project title"
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteItem('projects', index, project.id)}
                        className="ml-3"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <Textarea
                      value={project.description || ''}
                      onChange={(e) => {
                        const newProjects = [...projects];
                        newProjects[index].description = e.target.value;
                        setProjects(newProjects);
                      }}
                      placeholder="Project description"
                      rows={3}
                    />
                    <Input
                      value={project.project_url || ''}
                      onChange={(e) => {
                        const newProjects = [...projects];
                        newProjects[index].project_url = e.target.value;
                        setProjects(newProjects);
                      }}
                      placeholder="Project URL (optional)"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-slate-800">Education</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEducation([...education, { institution: '', degree: '' }])}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Education
                </Button>
              </div>
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <div key={index} className="p-4 border border-slate-200 rounded-lg space-y-3">
                    <div className="flex justify-between">
                      <Input
                        value={edu.institution}
                        onChange={(e) => {
                          const newEducation = [...education];
                          newEducation[index].institution = e.target.value;
                          setEducation(newEducation);
                        }}
                        placeholder="Institution name"
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteItem('education', index, edu.id)}
                        className="ml-3"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
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
                        placeholder="Field of study"
                      />
                    </div>
                    <Input
                      value={edu.grade || ''}
                      onChange={(e) => {
                        const newEducation = [...education];
                        newEducation[index].grade = e.target.value;
                        setEducation(newEducation);
                      }}
                      placeholder="GPA/Grade (optional)"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
