import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Copy, Check } from "lucide-react";
import { useOutreach } from "../context/OutreachContext";
import ProgressBar from "../components/ui/ProgressBar";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import TextField from "../components/ui/TextField";

const EmailPreviewPage: React.FC = () => {
  const { setStep, generatedEmail, emailDistribution, setEmailDistribution } =
    useOutreach();

  const [copied, setCopied] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedEmail.email.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContinue = async () => {
    if (!emailDistribution) {
      // Validate emails
      alert("Enter email before proceding");
      if (!showEmail) setShowEmail(true);
      return;
    }

    setStep(4);
  };

  const handleOpenGmail = () => {
    const gmailUrl  = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&su=${encodeURIComponent(generatedEmail.email.subject)}&body=${encodeURIComponent(generatedEmail.email.body)}`;
    window.open(gmailUrl, '_blank');
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
          {generatedEmail.email.subject}
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap mb-6 text-wrap">
          {generatedEmail.email.body}
        </div>

        <div className="flex justify-between">
          <Button
            variant={showEmail ? "primary" : "outline"}
            onClick={() => setShowEmail(true)}
          >
            Send via Email
          </Button>
          <Button
            variant={!showEmail ? "primary" : "outline"}
            onClick={() => handleOpenGmail()}
          >
            Open Gmail
          </Button>
        </div>

        {showEmail && (
          <TextField
            placeholder="e.g. hrEmail@company.com"
            fullWidth
            type="email"
            onChange={(e) => setEmailDistribution(e.target.value)}
            className="mr-2 mt-4"
          />
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
