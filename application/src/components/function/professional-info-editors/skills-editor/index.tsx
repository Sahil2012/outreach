import { Skill } from "@/lib/types/profileTypes";
import { Badge } from "@/components/ui/badge";
import { FormControlProps } from "@/lib/types/commonTypes";
import { X } from "lucide-react";
import AddSkill from "./AddSkill";

export function SkillsEditor({
  value,
  onChange,
}: FormControlProps<Skill[]>) {
  const handleAddSkill = (skill: Skill) => {
    if (skill.name.trim() && !value.some((s) => s.name === skill.name.trim())) {
      onChange([...value, { name: skill.name.trim() }]);
    }
  };

  const removeSkill = (skill: Skill) => {
    onChange(value.filter((s) => s.name !== skill.name));
  };

  return (
    <div className="space-y-4">
      <AddSkill onChange={handleAddSkill} />

      <div className="flex flex-wrap gap-2">
        {value.map((s) => (
          <Badge
            key={s.name}
            variant="secondary"
            className="pl-4 pr-3 py-1.5 text-sm font-medium flex items-center gap-1"
          >
            {s.name}
            <button
              onClick={() => removeSkill(s)}
              className="ml-1 hover:text-destructive focus:outline-none cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </Badge>
        ))}
        {value.length === 0 && (
          <p className="text-sm text-muted-foreground pl-2">
            No skills added yet.
          </p>
        )}
      </div>
    </div>
  );
}
