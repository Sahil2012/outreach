import { Skill } from "@/lib/types/profileTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import React, { useState } from "react";

interface AddSkillProps {
  onChange: (skill: Skill) => void;
}

const AddSkill = ({ onChange }: AddSkillProps) => {
  const [skill, setSkill] = useState<Skill>({ name: "" });

  const handleAddSkill = () => {
    onChange(skill);
    setSkill({ name: "" });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        value={skill.name}
        onChange={(e) => setSkill({ name: e.target.value })}
        onKeyDown={handleKeyDown}
        placeholder="Type a skill and press Enter..."
        className="flex-1"
      />
      <Button
        variant="secondary"
        onClick={handleAddSkill}
        disabled={!skill.name.trim()}
      >
        <Plus className="w-4 h-4 mr-1" />
        Add
      </Button>
    </div>
  );
};

export default AddSkill;
