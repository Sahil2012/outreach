import { Education } from "@/lib/types/profileTypes";
import DegreeInput from "@/components/function/commons/DegreeInput";
import EndDateInput from "@/components/function/commons/EndDateInput";
import FieldOfStudyInput from "@/components/function/commons/FieldOfStudyInput";
import GradeInput from "@/components/function/commons/GradeInput";
import InstitutionInput from "@/components/function/commons/InstitutionInput";
import StartDateInput from "@/components/function/commons/StartDateInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Check, X } from "lucide-react";
import { useState } from "react";

interface EditingCardProps {
  education: Education;
  onSave: (experience: Education) => void;
  onCancel: () => void;
}

const EditingCard = ({ education, onSave, onCancel }: EditingCardProps) => {
  const [newEdu, setNewEdu] = useState(education);
  const [currentlyStudyHere, setCurrentlyStudyHere] = useState(false);

  const handleCancel = () => {
    onCancel();
  };

  const handleSave = () => {
    onSave({
      ...newEdu,
      end_date: currentlyStudyHere ? null : newEdu.end_date,
    });
  };

  const isSaveDisabled = !newEdu.degree.trim() || !newEdu.institution.trim();

  return (
    <div className="p-4 border border-border/40 rounded-3xl space-y-4 bg-muted/5 animate-in fade-in slide-in-from-top-2">
      <InstitutionInput
        value={newEdu.institution}
        onChange={(institution) => setNewEdu({ ...newEdu, institution })}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DegreeInput
          value={newEdu.degree}
          onChange={(degree) => setNewEdu({ ...newEdu, degree })}
        />
        <FieldOfStudyInput
          value={newEdu.field_of_study}
          onChange={(fieldOfStudy) =>
            setNewEdu({ ...newEdu, field_of_study: fieldOfStudy })
          }
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GradeInput
          value={newEdu.grade}
          onChange={(grade) => setNewEdu({ ...newEdu, grade })}
        />
        <StartDateInput
          value={newEdu.start_date}
          onChange={(startDate) =>
            setNewEdu({ ...newEdu, start_date: startDate })
          }
        />
        {!currentlyStudyHere && (
          <EndDateInput
            value={newEdu.end_date || undefined}
            onChange={(endDate) => setNewEdu({ ...newEdu, end_date: endDate })}
          />
        )}
      </div>
      <div className="flex justify-center items-center pl-1 pb-2 space-x-2">
        <Checkbox
          id="currently-study-here"
          name="currently-study-here"
          checked={currentlyStudyHere}
          onCheckedChange={(checked) => setCurrentlyStudyHere(!!checked)}
        />
        <Label htmlFor="currently-study-here" className="text-sm font-normal">
          I currently study here
        </Label>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="icon" onClick={handleCancel}>
          <X className="w-4 h-4" />
        </Button>
        <Button size="icon" onClick={handleSave} disabled={isSaveDisabled}>
          <Check className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default EditingCard;
