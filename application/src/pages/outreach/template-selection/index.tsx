import React, { useEffect } from "react";
import { ArrowRight, FileText, PlusCircle, Check } from "lucide-react";
import { useOutreach } from "../../../context/OutreachContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { Label } from "../../../components/ui/label";
import { templates } from "../../../data/templates";
import { useLocation } from "react-router-dom";
import { RecipientInfo } from "../../../types";
import { cn } from "../../../lib/utils";

const TemplateSelectionPage: React.FC = () => {
  const {
    setStep,
    selectedTemplate,
    setSelectedTemplate,
    customTemplate,
    setCustomTemplate,
    useCustomTemplate,
    setUseCustomTemplate,
    setRecipientInfo,
  } = useOutreach();

  const location = useLocation();

  useEffect(() => {
    if (location.state?.company && location.state?.employee) {
      const { company, employee } = location.state;
      setRecipientInfo((prev: RecipientInfo) => ({
        ...prev,
        companyName: company.name,
        contactName: employee.name,
        userContact: employee.email || "",
      }));
    }
  }, [location.state, setRecipientInfo]);

  const handleSelectTemplate = (templateId: string) => {
    if (templateId != '1') {
      // alert("This template option is in progress.")
      // return;
    }
    const template = templates.find((t) => t.id === templateId);
    setSelectedTemplate(template || null);
    setUseCustomTemplate(false);
  };

  const handleUseCustomTemplate = () => {
    setSelectedTemplate(null);
    setUseCustomTemplate(true);
  };

  const handleContinue = () => {
    if (useCustomTemplate && !customTemplate) {
      alert("Please enter your custom template or select a pre-built one.");
      return;
    }

    if (!useCustomTemplate && !selectedTemplate) {
      alert("Please select a template or create your own.");
      return;
    }

    setStep(2);
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
            onClick={() => handleSelectTemplate(template.id)}
          >
            {selectedTemplate?.id === template.id && (
              <div className="absolute top-0 right-0 p-2 bg-primary text-primary-foreground rounded-bl-lg">
                <Check className="w-4 h-4" />
              </div>
            )}
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">{template.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm line-clamp-3">
                {template.content}
              </p>
            </CardContent>
          </Card>
        ))}

        <Card
          className={cn(
            "cursor-pointer transition-all hover:shadow-md py-6 relative overflow-hidden",
            useCustomTemplate
              ? "border-primary ring-2 ring-primary/20 bg-primary/5"
              : "hover:border-primary/50"
          )}
          onClick={handleUseCustomTemplate}
        >
          {useCustomTemplate && (
            <div className="absolute top-0 right-0 p-2 bg-primary text-primary-foreground rounded-bl-lg">
              <Check className="w-4 h-4" />
            </div>
          )}
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <PlusCircle className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">Create Your Own</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Write a custom message tailored to your specific needs.
            </p>
          </CardContent>
        </Card>
      </div>

      {useCustomTemplate && (
        <Card className="animate-fadeIn py-6 gap-6">
          <CardHeader>
            <CardTitle>Custom Template</CardTitle>
            <CardDescription className="">
              Use {"{{placeholders}}"} for dynamic content that will be filled in the next step.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Write your email template here. Use {{contactName}}, {{companyName}}, {{jobIds}}, and {{jobLinks}} as placeholders."
              rows={5}
              value={customTemplate}
              onChange={(e) => setCustomTemplate(e.target.value)}
              className="font-mono text-sm field-sizing-content"
            />
          </CardContent>
        </Card>
      )}

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
