import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import TextField from '../components/ui/TextField';
import TextArea from '../components/ui/TextArea';
import { Loader } from '../components/ui/loader';
import { Plus, Trash2, Save } from 'lucide-react';

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

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    const [skillsRes, projectsRes, educationRes] = await Promise.all([
      supabase.from('skills').select('*').eq('user_id', user!.id),
      supabase.from('projects').select('*').eq('user_id', user!.id),
      supabase.from('education').select('*').eq('user_id', user!.id),
    ]);

    setSkills(skillsRes.data || []);
    setProjects(projectsRes.data || []);
    setEducation(educationRes.data || []);
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);

    const existingSkills = skills.filter(s => s.id);
    const newSkills = skills.filter(s => !s.id && s.skill_name.trim());

    if (newSkills.length > 0) {
      await supabase.from('skills').insert(
        newSkills.map(s => ({
          user_id: user!.id,
          skill_name: s.skill_name,
          proficiency_level: s.proficiency_level,
        }))
      );
    }

    for (const skill of existingSkills) {
      await supabase
        .from('skills')
        .update({
          skill_name: skill.skill_name,
          proficiency_level: skill.proficiency_level,
        })
        .eq('id', skill.id);
    }

    const existingProjects = projects.filter(p => p.id);
    const newProjects = projects.filter(p => !p.id && p.title.trim());

    if (newProjects.length > 0) {
      await supabase.from('projects').insert(
        newProjects.map(p => ({
          user_id: user!.id,
          ...p,
        }))
      );
    }

    for (const project of existingProjects) {
      await supabase
        .from('projects')
        .update(project)
        .eq('id', project.id);
    }

    const existingEducation = education.filter(e => e.id);
    const newEducation = education.filter(e => !e.id && e.institution.trim());

    if (newEducation.length > 0) {
      await supabase.from('education').insert(
        newEducation.map(e => ({
          user_id: user!.id,
          ...e,
        }))
      );
    }

    for (const edu of existingEducation) {
      await supabase
        .from('education')
        .update(edu)
        .eq('id', edu.id);
    }

    setSaving(false);
    navigate('/dashboard');
  };

  const deleteSkill = async (index: number) => {
    const skill = skills[index];
    if (skill.id) {
      await supabase.from('skills').delete().eq('id', skill.id);
    }
    setSkills(skills.filter((_, i) => i !== index));
  };

  const deleteProject = async (index: number) => {
    const project = projects[index];
    if (project.id) {
      await supabase.from('projects').delete().eq('id', project.id);
    }
    setProjects(projects.filter((_, i) => i !== index));
  };

  const deleteEducation = async (index: number) => {
    const edu = education[index];
    if (edu.id) {
      await supabase.from('education').delete().eq('id', edu.id);
    }
    setEducation(education.filter((_, i) => i !== index));
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
          <Card className="p-6">
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
                  <TextField
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
                    onClick={() => deleteSkill(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
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
                    <TextField
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
                      onClick={() => deleteProject(index)}
                      className="ml-3"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <TextArea
                    value={project.description || ''}
                    onChange={(e) => {
                      const newProjects = [...projects];
                      newProjects[index].description = e.target.value;
                      setProjects(newProjects);
                    }}
                    placeholder="Project description"
                    rows={3}
                  />
                  <TextField
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
          </Card>

          <Card className="p-6">
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
                    <TextField
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
                      onClick={() => deleteEducation(index)}
                      className="ml-3"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <TextField
                      value={edu.degree}
                      onChange={(e) => {
                        const newEducation = [...education];
                        newEducation[index].degree = e.target.value;
                        setEducation(newEducation);
                      }}
                      placeholder="Degree"
                    />
                    <TextField
                      value={edu.field_of_study || ''}
                      onChange={(e) => {
                        const newEducation = [...education];
                        newEducation[index].field_of_study = e.target.value;
                        setEducation(newEducation);
                      }}
                      placeholder="Field of study"
                    />
                  </div>
                  <TextField
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
          </Card>
        </div>
      </div>
    </div>
  );
}
