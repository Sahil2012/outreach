import React, { useEffect, useState } from "react";
import { ArrowRight, FileText, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Template } from "@/lib/types";
import { useOutreachActions } from "@/hooks/useOutreachActions";
import { toast } from "sonner";

const TemplateSelectionPage: React.FC = () => {
  const { fetchTemplates } = useOutreachActions();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const data = await fetchTemplates();
        setTemplates(data);
      } catch (error) {
        console.error("Failed to load templates", error);
        toast.error("Failed to load templates. Please try again later.");
      }
    };
    loadTemplates();
  }, []);

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
        {templates.map((template) => (
          <Card
            key={template.id}
            className={cn(
              "cursor-pointer transition-all hover:shadow-md py-6 relative overflow-hidden",
              selectedTemplate?.id === template.id
                ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                : "hover:border-primary/50"
            )}
            onClick={() => handleSelectTemplate(template)}
          >
            {selectedTemplate?.id === template.id && (
              <div className="absolute top-0 right-0 p-2 bg-primary text-primary-foreground rounded-bl-lg">
                <Check className="w-4 h-4" />
              </div>
            )}
            <CardHeader className="mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">{template.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground overflow-hidden italic text-xs w-full line-clamp-3 whitespace-pre-wrap">
                <span>{template.content}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <Button
          size="lg"
          onClick={handleContinue}
          className="w-full sm:w-auto"
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default TemplateSelectionPage;
