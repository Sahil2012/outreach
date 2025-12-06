import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Code2, Plus, X } from 'lucide-react';

interface SkillsSectionProps {
    skills: string[];
    setSkills: (skills: string[]) => void;
}

export function SkillsSection({ skills, setSkills }: SkillsSectionProps) {
    const [currentSkill, setCurrentSkill] = useState('');

    const handleAddSkill = () => {
        if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
            setSkills([...skills, currentSkill.trim()]);
            setCurrentSkill('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddSkill();
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setSkills(skills.filter(skill => skill !== skillToRemove));
    };

    return (
        <Card>
            <CardContent className="py-6 space-y-6">
                <div className="flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-lg">Skills</h3>
                </div>

                <div className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            value={currentSkill}
                            onChange={(e) => setCurrentSkill(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a skill and press Enter..."
                            className="flex-1"
                        />
                        <Button
                            variant="secondary"
                            onClick={handleAddSkill}
                            disabled={!currentSkill.trim()}
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            Add
                        </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="px-3 py-1 text-sm font-medium flex items-center gap-1">
                                {skill}
                                <button
                                    onClick={() => removeSkill(skill)}
                                    className="ml-1 hover:text-destructive focus:outline-none"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </Badge>
                        ))}
                        {skills.length === 0 && (
                            <p className="text-sm text-muted-foreground pl-2">No skills added yet.</p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
