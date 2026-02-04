import { Experience } from "@/api/profile/types";
import CompanyInput from "@/components/function/commons/CompanyInput";
import DescriptionInput from "@/components/function/commons/DescriptionInput";
import EndDateInput from "@/components/function/commons/EndDateInput";
import RoleInput from "@/components/function/commons/RoleInput";
import StartDateInput from "@/components/function/commons/StartDateInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Check, X } from "lucide-react";
import { useState } from "react";

interface EditingCardProps {
  experience: Experience;
  onSave: (experience: Experience) => void;
  onCancel: () => void;
}

const EditingCard = ({ experience, onSave, onCancel }: EditingCardProps) => {
  const [newExp, setNewExp] = useState(experience);
  const [currentlyWorkHere, setCurrentlyWorkHere] = useState(false);

  const handleCancel = () => {
    onCancel();
  };

  const handleSave = () => {
    onSave({
      ...newExp,
      endDate: currentlyWorkHere ? null : newExp.endDate,
    });
  };

  const isSaveDisabled = !newExp.role.trim() || !newExp.company.trim();

  return (
    <div className="p-4 border border-border/40 rounded-3xl space-y-4 bg-muted/5 animate-in fade-in slide-in-from-top-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RoleInput
          value={newExp.role}
          onChange={(role) => setNewExp({ ...newExp, role })}
        />
        <CompanyInput
          value={newExp.company}
          onChange={(company) => setNewExp({ ...newExp, company })}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StartDateInput
          value={newExp.startDate}
          onChange={(startDate) => setNewExp({ ...newExp, startDate })}
        />
        {!currentlyWorkHere && (
          <EndDateInput
            value={newExp.endDate || undefined}
            onChange={(endDate) => setNewExp({ ...newExp, endDate })}
          />
        )}
      </div>
      <div className="flex justify-center items-center space-x-2 pl-1 pb-2">
        <Checkbox
          id="currently-work-here"
          name="currently-work-here"
          checked={currentlyWorkHere}
          onCheckedChange={(checked) => setCurrentlyWorkHere(!!checked)}
        />
        <Label htmlFor="currently-work-here" className="text-sm font-normal">
          I currently work here
        </Label>
      </div>
      <DescriptionInput
        value={newExp.description || ""}
        onChange={(description) => setNewExp({ ...newExp, description })}
      />
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
