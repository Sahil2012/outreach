import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Copy, Check } from "lucide-react";
import { useOutreach } from "../context/OutreachContext";
import ProgressBar from "../components/ui/ProgressBar";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import TextField from "../components/ui/TextField";

const EmailPreviewPage: React.FC = () => {
  const {
    step,
    setStep,
    selectedTemplate,
    customTemplate,
    recipientInfo,
    useCustomTemplate,
    generatedEmail,
    setGeneratedEmail,
    emailDistribution,
    setEmailDistribution,
  } = useOutreach();

  const [copied, setCopied] = useState(false);
  const [showEmailList, setShowEmailList] = useState(false);

  useEffect(() => {
    // Generate email content by replacing placeholders
    const templateContent = useCustomTemplate
      ? customTemplate
      : selectedTemplate?.content || "";

    let content = templateContent
      .replace(/{{userName}}/g, recipientInfo.userName)
      .replace(/{{userContact}}/g, recipientInfo.userContact)
      .replace(/{{contactName}}/g, recipientInfo.contactName)
      .replace(/{{companyName}}/g, recipientInfo.companyName)
      .replace(/{{jobIds}}/g, recipientInfo.jobIds.join(", "))
      .replace(/{{jobLinks}}/g, recipientInfo.jobLinks.join("\n"));

    setGeneratedEmail(content);
  }, [
    useCustomTemplate,
    customTemplate,
    selectedTemplate,
    recipientInfo,
    setGeneratedEmail,
  ]);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddEmail = () => {
    setEmailDistribution({
      ...emailDistribution,
      emailList: [...emailDistribution.emailList, ""],
    });
  };

  const handleRemoveEmail = (index: number) => {
    setEmailDistribution({
      ...emailDistribution,
      emailList: emailDistribution.emailList.filter((_, i) => i !== index),
    });
  };

  const handleEmailChange = (value: string, index: number) => {
    const newEmailList = [...emailDistribution.emailList];
    newEmailList[index] = value;
    setEmailDistribution({
      ...emailDistribution,
      emailList: newEmailList,
    });
  };

  const handleContinue = () => {
    if (showEmailList) {
      // Validate emails
      if (emailDistribution.emailList.some((email) => !email)) {
        alert("Please fill in all email addresses or remove empty fields.");
        return;
      }

      if (!emailDistribution.subject) {
        alert("Please enter an email subject.");
        return;
      }
    }

    setStep(4);
  };

  return (
    <div className="animate-fadeIn">
      <ProgressBar currentStep={3} totalSteps={4} />

      <h1 className="text-3xl font-semibold text-gray-900 mb-2">
        Preview Your Email
      </h1>
      <p className="text-gray-600 mb-8">
        Review your email before sending or copying it.
      </p>

      <Card className="p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <h2 className="text-xl font-medium text-gray-800">Email Preview</h2>
          <div className="mt-2 md:mt-0">
            <Button
              variant={copied ? "primary" : "outline"}
              size="sm"
              icon={
                copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )
              }
              onClick={handleCopyToClipboard}
            >
              {copied ? "Copied!" : "Copy to Clipboard"}
            </Button>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap mb-6 text-wrap">
          {generatedEmail}
        </div>

        <div className="flex justify-between">
          <Button
            variant={showEmailList ? "primary" : "outline"}
            onClick={() => setShowEmailList(true)}
          >
            Send via Email
          </Button>
          <Button
            variant={!showEmailList ? "primary" : "outline"}
            onClick={() => setShowEmailList(false)}
          >
            Copy Text
          </Button>
        </div>

        {showEmailList && (
          <div className="mt-6 animate-fadeIn">
            <TextField
              label="Email Subject"
              placeholder="e.g. Application for [Position] at [Company]"
              fullWidth
              value={emailDistribution.subject}
              onChange={(e) =>
                setEmailDistribution({
                  ...emailDistribution,
                  subject: e.target.value,
                })
              }
              required
              className="mb-4"
            />

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipient Email Addresses
            </label>

            {emailDistribution.emailList.map((email, index) => (
              <div key={`email-${index}`} className="flex items-center mb-2">
                <TextField
                  placeholder="e.g. contact@company.com"
                  fullWidth
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value, index)}
                  className="mr-2"
                />
                {emailDistribution.emailList.length > 1 && (
                  <Button
                    variant="text"
                    icon={<span className="text-red-500">×</span>}
                    onClick={() => handleRemoveEmail(index)}
                    aria-label="Remove email"
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}

            <Button
              variant="text"
              size="sm"
              onClick={handleAddEmail}
              className="mt-1"
            >
              + Add another email
            </Button>
          </div>
        )}
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          size="lg"
          onClick={() => setStep(2)}
          icon={<ArrowLeft className="w-5 h-5" />}
        >
          Back
        </Button>
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

export default EmailPreviewPage;
