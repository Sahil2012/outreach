import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GraduationCap, Plus, Trash2, Check, Pencil } from 'lucide-react';
import { Education } from '@/types/profile';

interface EducationSectionProps {
    education: Education[];
    setEducation: (education: Education[]) => void;
}

export function EducationSection({ education, setEducation }: EducationSectionProps) {
    const [isAddingEducation, setIsAddingEducation] = useState(false);
    const [currentEducation, setCurrentEducation] = useState<Education>({ institution: '', degree: '' });
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const saveEducation = () => {
        if (currentEducation.institution && currentEducation.degree) {
            if (editingIndex !== null) {
                const updatedEducation = [...education];
                updatedEducation[editingIndex] = currentEducation;
                setEducation(updatedEducation);
                setEditingIndex(null);
            } else {
                setEducation([...education, currentEducation]);
            }
            setCurrentEducation({ institution: '', degree: '' });
            setIsAddingEducation(false);
        }
    };

    const handleEdit = (index: number) => {
        setEditingIndex(index);
        setCurrentEducation(education[index]);
        setIsAddingEducation(true);
    };

    const handleDelete = (index: number) => {
        setEducation(education.filter((_, i) => i !== index));
        if (editingIndex === index) {
            setEditingIndex(null);
            setCurrentEducation({ institution: '', degree: '' });
            setIsAddingEducation(false);
        }
    };

    const handleCancel = () => {
        setIsAddingEducation(false);
        setEditingIndex(null);
        setCurrentEducation({ institution: '', degree: '' });
    };

    return (
        <Card>
            <CardContent className="py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-lg">Education</h3>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Saved Education List */}
                    {education.map((edu, index) => (
                        <Card key={index} className="bg-muted/10 border-border/40">
                            <CardContent className="p-4 flex justify-between items-start">
                                <div>
                                    <h4 className="font-semibold">{edu.institution}</h4>
                                    <p className="text-sm text-muted-foreground">{edu.degree} {edu.field_of_study && `in ${edu.field_of_study}`}</p>
                                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                        {edu.year_of_passing && <span>Class of {edu.year_of_passing}</span>}
                                        {edu.grade && <span>Grade: {edu.grade}</span>}
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEdit(index)}
                                        className="text-muted-foreground hover:text-primary"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(index)}
                                        className="text-muted-foreground hover:text-destructive"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Add Education Form */}
                    {isAddingEducation ? (
                        <div className="p-4 border border-border/40 rounded-2xl space-y-4 bg-muted/5 animate-in fade-in slide-in-from-top-2">
                            <Input
                                value={currentEducation.institution}
                                onChange={(e) => setCurrentEducation({ ...currentEducation, institution: e.target.value })}
                                placeholder="Institution Name"
                                className="font-medium"
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    value={currentEducation.degree}
                                    onChange={(e) => setCurrentEducation({ ...currentEducation, degree: e.target.value })}
                                    placeholder="Degree"
                                />
                                <Input
                                    value={currentEducation.field_of_study || ''}
                                    onChange={(e) => setCurrentEducation({ ...currentEducation, field_of_study: e.target.value })}
                                    placeholder="Field of Study"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    value={currentEducation.grade || ''}
                                    onChange={(e) => setCurrentEducation({ ...currentEducation, grade: e.target.value })}
                                    placeholder="Grade / GPA"
                                />
                                <Input
                                    value={currentEducation.year_of_passing || ''}
                                    onChange={(e) => setCurrentEducation({ ...currentEducation, year_of_passing: e.target.value })}
                                    placeholder="Year of Passing"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={handleCancel}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                                <Button size="icon" onClick={saveEducation} disabled={!currentEducation.institution || !currentEducation.degree}>
                                    <Check className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Button
                            variant="outline"
                            className="w-full border-dashed"
                            onClick={() => setIsAddingEducation(true)}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Education
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
