import { Experience } from "@/lib/types/profileTypes";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import ExperienceCard from "./experience-card";
import { FormControlProps } from "@/lib/types/commonTypes";

const ExperienceEditor = ({
  value,
  onChange,
}: FormControlProps<Experience[]>) => {
  const [isEditing, setIsEditing] = useState<boolean[]>(
    new Array(value.length).fill(false),
  );

  const handleChange = (exp: Experience, index: number) => {
    const newExperiences = value.map((v, i) => (i === index ? exp : v));
    onChange(newExperiences);
  };

  const handleChangeIsEditing = (val: boolean, index: number) => {
    const newIsEditing = isEditing.map((v, i) => (i === index ? val : v));
    setIsEditing(newIsEditing);
  };

  const handleDelete = (index: number) => {
    const newExperiences = value.filter((_, i) => i !== index);
    const newIsEditing = isEditing.filter((_, i) => i !== index);

    onChange(newExperiences);
    setIsEditing(newIsEditing);
  };

  const handleAddExperience = () => {
    const newExperiences = [...value, { role: "", company: "" }];
    const newIsEditing = [...isEditing, true];

    onChange(newExperiences);
    setIsEditing(newIsEditing);
  };

  console.log("experience", value, isEditing);

  return (
    <div className="space-y-4">
      {value.map((exp, index) => (
        <ExperienceCard
          key={index}
          experience={exp}
          onChange={(exp) => handleChange(exp, index)}
          isEditing={isEditing[index]}
          onChangeIsEditing={(val) => handleChangeIsEditing(val, index)}
          onDelete={() => handleDelete(index)}
        />
      ))}
      <Button
        variant="outline"
        className="w-full border-dashed"
        onClick={handleAddExperience}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Experience
      </Button>
    </div>
  );
};

export default ExperienceEditor;
