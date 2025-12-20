import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Template } from "@/lib/types";
import { useOutreach } from "@/hooks/useOutreach";
import { toast } from "sonner";
import { TemplateCard } from "./TemplateCard";
import { Loader } from "@/components/ui/loader";

const TemplateSelectionPage: React.FC = () => {
  const { templates, isLoadingTemplates, templatesError } = useOutreach();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const navigate = useNavigate();

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
  };

  const handleContinue = () => {
    if (!selectedTemplate) {
      toast.error("Please select a template.");
      return;
    }
    navigate(`/outreach/recipient-info?templateId=${selectedTemplate.id}`);
  };

  if (isLoadingTemplates) {
      return (
          <div className="flex items-center justify-center min-h-[400px]">
              <Loader size="lg" />
          </div>
      );
  }

  if (templatesError) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
              <div className="text-destructive font-medium">Failed to load templates.</div>
              <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
          </div>
      );
  }

  return (
    <div className="animate-fadeIn space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates?.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={selectedTemplate?.id === template.id}
            onSelect={handleSelectTemplate}
          />
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <Button
          size="lg"
          onClick={handleContinue}
          className="w-full sm:w-auto"
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-1 -mr-1" />
        </Button>
      </div>
    </div>
  );
};

export default TemplateSelectionPage;
