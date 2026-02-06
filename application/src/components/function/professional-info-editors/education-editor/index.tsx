import { Education } from "@/lib/types/profileTypes";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import EducationCard from "./education-card";
import { FormControlProps } from "@/lib/types/commonTypes";

const EducationEditor = ({
  value,
  onChange,
}: FormControlProps<Education[]>) => {
  const [isEditing, setIsEditing] = useState<boolean[]>(
    new Array(value.length).fill(false),
  );

  const handleChange = (edu: Education, index: number) => {
    const newEducations = value.map((v, i) => (i === index ? edu : v));
    onChange(newEducations);
  };

  const handleChangeIsEditing = (val: boolean, index: number) => {
    const newIsEditing = isEditing.map((v, i) => (i === index ? val : v));
    setIsEditing(newIsEditing);
  };

  const handleDelete = (index: number) => {
    const newEducations = value.filter((_, i) => i !== index);
    const newIsEditing = isEditing.filter((_, i) => i !== index);

    onChange(newEducations);
    setIsEditing(newIsEditing);
  };

  const handleAddEducation = () => {
    const newEducations = [...value, { degree: "", institution: "" }];
    const newIsEditing = [...isEditing, true];

    onChange(newEducations);
    setIsEditing(newIsEditing);
  };

  return (
    <div className="space-y-4">
      {value.map((edu, index) => (
        <EducationCard
          key={index}
          education={edu}
          onChange={(edu) => handleChange(edu, index)}
          isEditing={isEditing[index]}
          onChangeIsEditing={(val) => handleChangeIsEditing(val, index)}
          onDelete={() => handleDelete(index)}
        />
      ))}
      <Button
        variant="outline"
        className="w-full border-dashed"
        onClick={handleAddEducation}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Education
      </Button>
    </div>
  );
};

export default EducationEditor;
