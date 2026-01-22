import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Briefcase,
  Plus,
  Trash2,
  Check,
  ChevronDownIcon,
  Pencil,
} from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Experience } from "@/api/profile/types";

interface ExperienceSectionProps {
  experiences: Experience[];
  setExperiences: (experience: Experience[]) => void;
}

function DateInput({
  value,
  onChange,
  placeholder,
}: Readonly<{
  value?: Date;
  onChange: (date?: Date) => void;
  placeholder?: string;
}>) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between font-normal",
            !value && "text-muted-foreground",
          )}
        >
          {value ? (
            format(value, "PPP")
          ) : (
            <span>{placeholder || "Pick a date"}</span>
          )}
          <ChevronDownIcon className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange(date);
            setOpen(false);
          }}
          captionLayout="dropdown"
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export function ExperienceSection({
  experiences,
  setExperiences,
}: Readonly<ExperienceSectionProps>) {
  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<Experience>({
    role: "",
    company: "",
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const saveExperience = () => {
    if (currentExperience.role && currentExperience.company) {
      if (editingIndex !== null) {
        const updatedExperience = [...experiences];
        updatedExperience[editingIndex] = currentExperience;
        setExperiences(updatedExperience);
        setEditingIndex(null);
      } else {
        setExperiences([...experiences, currentExperience]);
      }
      setCurrentExperience({ role: "", company: "" });
      setIsAddingExperience(false);
    }
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setCurrentExperience(experiences[index]);
    setIsAddingExperience(true);
  };

  const handleDelete = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setCurrentExperience({ role: "", company: "" });
      setIsAddingExperience(false);
    }
  };

  const handleCancel = () => {
    setIsAddingExperience(false);
    setEditingIndex(null);
    setCurrentExperience({ role: "", company: "" });
  };

  return (
    <Card>
      <CardContent className="py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-lg">Experience</h3>
          </div>
        </div>

        <div className="space-y-4">
          {/* Saved Experiences List */}
          {experiences.map((exp, index) => (
            <Card key={index} className="bg-muted/10 border-border/40">
              <CardContent className="p-4 flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{exp.role}</h4>
                  <p className="text-sm text-muted-foreground">{exp.company}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    {exp.startDate && (
                      <span>{format(new Date(exp.startDate), "MMM yyyy")}</span>
                    )}
                    {(exp.startDate || exp.endDate) && <span>-</span>}
                    {exp.endDate ? (
                      <span>{format(new Date(exp.endDate), "MMM yyyy")}</span>
                    ) : (
                      exp.startDate && <span>Present</span>
                    )}
                  </div>
                  {exp.description && (
                    <p className="text-sm mt-2">{exp.description}</p>
                  )}
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

          {/* Add Experience Form */}
          {isAddingExperience ? (
            <div className="p-4 border border-border/40 rounded-3xl space-y-4 bg-muted/5 animate-in fade-in slide-in-from-top-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  value={currentExperience.role}
                  onChange={(e) =>
                    setCurrentExperience({
                      ...currentExperience,
                      role: e.target.value,
                    })
                  }
                  placeholder="Job Title"
                  className="font-medium"
                />
                <Input
                  value={currentExperience.company}
                  onChange={(e) =>
                    setCurrentExperience({
                      ...currentExperience,
                      company: e.target.value,
                    })
                  }
                  placeholder="Company Name"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DateInput
                  value={currentExperience.startDate}
                  onChange={(date) =>
                    setCurrentExperience({
                      ...currentExperience,
                      startDate: date?.toLocaleString(),
                    })
                  }
                  placeholder="Start Date"
                />
                <DateInput
                  value={currentExperience.endDate}
                  onChange={(date) =>
                    setCurrentExperience({
                      ...currentExperience,
                      endDate: date?.toLocaleDateString(),
                    })
                  }
                  placeholder="End Date"
                />
              </div>
              <Textarea
                value={currentExperience.description || ""}
                onChange={(e) =>
                  setCurrentExperience({
                    ...currentExperience,
                    description: e.target.value,
                  })
                }
                placeholder="Describe your role and responsibilities..."
                rows={2}
                className="resize-none bg-muted/30"
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="icon" onClick={handleCancel}>
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  onClick={saveExperience}
                  disabled={
                    !currentExperience.role || !currentExperience.company
                  }
                >
                  <Check className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full border-dashed"
              onClick={() => setIsAddingExperience(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Experience
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
