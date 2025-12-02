import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Loader } from '../../../components/ui/loader';
import { useAuth } from '../../../context/AuthContext';
import { Plus, Trash2, CheckCircle, Code2, Briefcase, GraduationCap } from 'lucide-react';

interface Skill {
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

export default function ProfessionalInfoPage() {
    const { user } = useUser();
    const { checkOnboardingStatus } = useAuth();
    const navigate = useNavigate();

    const [skills, setSkills] = useState<Skill[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [education, setEducation] = useState<Education[]>([]);
    const [loading, setLoading] = useState(false);

    const handleFinish = async () => {
        setLoading(true);
        try {
            // 1. Save Data to Backend (Mock)
            // await axios.post('/api/onboarding/professional', { skills, projects, education });

            // 2. Mark Onboarding as Complete in Clerk Metadata
            if (user) {
                await user.update({
                    unsafeMetadata: {
                        ...user.unsafeMetadata,
                        onboardingComplete: true
                    }
                });

                // 3. Refresh Auth Context
                await checkOnboardingStatus();

                // 4. Redirect to Dashboard
                navigate('/dashboard');
            }
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

            <div className="space-y-6">
                {/* Skills */}
                <Card>
                    <CardContent className="py-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Code2 className="w-5 h-5 text-primary" />
                                <h3 className="font-semibold text-lg">Skills</h3>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSkills([...skills, { skill_name: '', proficiency_level: '' }])}
                                className="text-primary hover:text-primary/80"
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Add
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
                                        placeholder="Skill name (e.g. React)"
                                        className="flex-1"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setSkills(skills.filter((_, i) => i !== index))}
                                        className="text-muted-foreground hover:text-destructive"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                            {skills.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-2">No skills added yet.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Projects */}
                <Card>
                    <CardContent className="py-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-primary" />
                                <h3 className="font-semibold text-lg">Projects</h3>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setProjects([...projects, { title: '', description: '' }])}
                                className="text-primary hover:text-primary/80"
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Add
                            </Button>
                        </div>

                        <div className="space-y-6">
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
                                                rows={2}
                                                className="resize-none bg-muted/30"
                                            />
                                            <Input
                                                value={project.project_url || ''}
                                                onChange={(e) => {
                                                    const newProjects = [...projects];
                                                    newProjects[index].project_url = e.target.value;
                                                    setProjects(newProjects);
                                                }}
                                                placeholder="Project URL (Optional)"
                                            />
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setProjects(projects.filter((_, i) => i !== index))}
                                            className="text-muted-foreground hover:text-destructive shrink-0"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {projects.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-2">No projects added yet.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Education */}
                <Card>
                    <CardContent className="py-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <GraduationCap className="w-5 h-5 text-primary" />
                                <h3 className="font-semibold text-lg">Education</h3>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEducation([...education, { institution: '', degree: '' }])}
                                className="text-primary hover:text-primary/80"
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Add
                            </Button>
                        </div>

                        <div className="space-y-6">
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
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setEducation(education.filter((_, i) => i !== index))}
                                            className="text-muted-foreground hover:text-destructive shrink-0"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {education.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-2">No education added yet.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex gap-4 pt-4">
                <Button variant="outline" className="flex-1 rounded-full" onClick={() => navigate('/onboarding/basic-info')}>
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
