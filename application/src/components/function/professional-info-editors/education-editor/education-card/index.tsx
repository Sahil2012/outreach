import { Education } from "@/api/profile/types";
import DisplayCard from "./DisplayCard";
import EditingCard from "./EditingCard";

interface EducationCardProps {
  education: Education;
  onChange: (education: Education) => void;
  isEditing: boolean;
  onChangeIsEditing: (isEditing: boolean) => void;
  onDelete: () => void;
}

const EducationCard = ({
  education,
  onChange,
  onDelete,
  isEditing,
  onChangeIsEditing,
}: EducationCardProps) => {
  const isValid = () => {
    return (
      education.degree.trim() !== "" && education.institution.trim() !== ""
    );
  };

  if (isEditing) {
    return (
      <EditingCard
        education={education}
        onCancel={() => {
          if (!isValid()) {
            onDelete();
          } else {
            onChangeIsEditing(false);
          }
        }}
        onSave={(exp) => {
          onChange(exp);
          onChangeIsEditing(false);
        }}
      />
    );
  }

  return (
    <DisplayCard
      education={education}
      onEdit={() => onChangeIsEditing(true)}
      onDelete={() => onDelete()}
    />
  );
};

export default EducationCard;
