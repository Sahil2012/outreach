import { Experience } from "@/api/profile/types";
import DisplayCard from "./DisplayCard";
import EditingCard from "./EditingCard";

interface ExperienceCardProps {
  experience: Experience;
  onChange: (experience: Experience) => void;
  isEditing: boolean;
  onChangeIsEditing: (isEditing: boolean) => void;
  onDelete: () => void;
}

const ExperienceCard = ({
  experience,
  onChange,
  onDelete,
  isEditing,
  onChangeIsEditing,
}: ExperienceCardProps) => {
  const isValid = () => {
    return experience.company.trim() !== "" && experience.role.trim() !== "";
  };

  if (isEditing) {
    return (
      <EditingCard
        experience={experience}
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
      experience={experience}
      onEdit={() => onChangeIsEditing(true)}
      onDelete={() => onDelete()}
    />
  );
};

export default ExperienceCard;
