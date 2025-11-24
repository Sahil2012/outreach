import React, { useEffect } from "react";
import { ArrowRight, FileText, PlusCircle } from "lucide-react";
import { useOutreach } from "../../../context/OutreachContext";
import ProgressBar from "../../../components/ui/ProgressBar";
import { Card, CardContent } from "../../../components/ui/card";
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
    if(templateId != '1') {
      alert("This template option is in progress.")
      return;
    }
    const template = templates.find((t) => t.id === templateId);
    setSelectedTemplate(template || null);
    setUseCustomTemplate(false);
  };

  const handleUseCustomTemplate = () => {
    
    alert("This option is not available yet.")
    // setSelectedTemplate(null);
    // setUseCustomTemplate(true);
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
    <div className="animate-fadeIn">
      <ProgressBar currentStep={1} totalSteps={4} />

      <h1 className="font-serif text-3xl font-medium mb-2">
        Choose Your Template
      </h1>
      <p className="text-gray-600 mb-8">
        Start with a pre-built template or create your own custom message.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-medium text-gray-800 mb-4">
            Pre-built Templates
          </h2>
          <div className="space-y-4">
            {templates.map((template) => (
              <Card
                key={template.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  selectedTemplate?.id === template.id ? "border-blue-500 ring-2 ring-blue-500" : ""
                )}
                onClick={() => handleSelectTemplate(template.id)}
              >
                <CardContent className="p-4 flex items-start">
                  <div className="bg-blue-100 rounded-lg p-2 mr-4">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {template.name}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {template.content.substring(0, 100)}...
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-medium text-gray-800 mb-4">
            Custom Template
          </h2>
          <Card
            className={cn(
              "cursor-pointer transition-all hover:shadow-md mb-4",
              useCustomTemplate ? "border-blue-500 ring-2 ring-blue-500" : ""
            )}
            onClick={handleUseCustomTemplate}
          >
            <CardContent className="p-4 flex items-start">
              <div className="bg-blue-100 rounded-lg p-2 mr-4">
                <PlusCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Create Your Own</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Write a custom message tailored to your specific needs.
                </p>
              </div>
            </CardContent>
          </Card>

          {useCustomTemplate && (
            <div className="animate-fadeIn space-y-2">
              <Label htmlFor="custom-template">Your Custom Template</Label>
              <Textarea
                id="custom-template"
                placeholder="Write your email template here. Use {{contactName}}, {{companyName}}, {{jobIds}}, and {{jobLinks}} as placeholders for dynamic content."
                rows={8}
                value={customTemplate}
                onChange={(e) => setCustomTemplate(e.target.value)}
              />
              <p className="text-sm text-gray-500">
                Use {"{{placeholders}}"} for dynamic content that will be filled in the next step.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          variant="default"
          size="lg"
          onClick={handleContinue}
        >
          Continue
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default TemplateSelectionPage;
