import { Experience } from "@/api/profile/types";
import ExperienceEditor from "@/components/function/professional-info-editors/experience-editor";
import { Card, CardContent } from "@/components/ui/card";
import {
  Briefcase
} from "lucide-react";

interface ExperienceSectionProps {
  experiences: Experience[];
  setExperiences: (experience: Experience[]) => void;
}

export function ExperienceSection({
  experiences,
  setExperiences,
}: ExperienceSectionProps) {
  return (
    <Card>
      <CardContent className="py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-lg">Experience</h3>
          </div>
        </div>

        <ExperienceEditor
          value={experiences}
          onChange={(exp) => setExperiences(exp)}
        />
      </CardContent>
    </Card>
  );
}
