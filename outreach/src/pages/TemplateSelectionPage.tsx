import React from "react";
import { ArrowRight, FileText, PlusCircle } from "lucide-react";
import { useOutreach } from "../context/OutreachContext";
import ProgressBar from "../components/ui/ProgressBar";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import TextArea from "../components/ui/TextArea";
import { templates } from "../data/templates";

const TemplateSelectionPage: React.FC = () => {
  const {
    setStep,
    selectedTemplate,
    setSelectedTemplate,
    customTemplate,
    setCustomTemplate,
    useCustomTemplate,
    setUseCustomTemplate,
  } = useOutreach();

  const handleSelectTemplate = (templateId: string) => {
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
                isActive={template.id == "1"}
                hoverable
                selected={selectedTemplate?.id === template.id}
                onClick={() => handleSelectTemplate(template.id)}
                className="p-4"
              >
                <div className="flex items-start">
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
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-medium text-gray-800 mb-4">
            Custom Template
          </h2>
          <Card
            hoverable
            selected={useCustomTemplate}
            onClick={handleUseCustomTemplate}
            className="p-4 mb-4"
          >
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-lg p-2 mr-4">
                <PlusCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Create Your Own</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Write a custom message tailored to your specific needs.
                </p>
              </div>
            </div>
          </Card>

          {useCustomTemplate && (
            <div className="animate-fadeIn">
              <TextArea
                label="Your Custom Template"
                placeholder="Write your email template here. Use {{contactName}}, {{companyName}}, {{jobIds}}, and {{jobLinks}} as placeholders for dynamic content."
                rows={8}
                fullWidth
                value={customTemplate}
                onChange={(e) => setCustomTemplate(e.target.value)}
                helperText="Use {{placeholders}} for dynamic content that will be filled in the next step."
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          variant="primary"
          size="lg"
          onClick={handleContinue}
          icon={<ArrowRight className="w-5 h-5" />}
          iconPosition="right"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default TemplateSelectionPage;
