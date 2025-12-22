import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Template } from "@/lib/types";
import { toast } from "sonner";
import { TemplateCard } from "./TemplateCard";

const templates = [
  {
    id: "COLD",
    name: "Cold",
    content: "Reach out to new contacts you haven't connected with before",
  },
  {
    id: "TAILORED",
    name: "Tailored",
    content: "Personalized outreach based on your profile and their background",
  },
  {
    id: "FOLLOW_UP",
    name: "Follow Up",
    content: "Check in with contacts who haven't responded yet",
  },
  {
    id: "THANK_YOU",
    name: "Thank You",
    content: "Express gratitude for referrals or positive responses",
  },
];

const TemplateSelectionPage: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
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
        <Button size="lg" onClick={handleContinue} className="w-full sm:w-auto">
          Continue
          <ArrowRight className="w-4 h-4 ml-1 -mr-1" />
        </Button>
      </div>
    </div>
  );
};

export default TemplateSelectionPage;
