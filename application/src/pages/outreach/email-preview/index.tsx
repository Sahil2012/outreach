import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Copy, Check } from "lucide-react";
import { useOutreach } from "../../../context/OutreachContext";
import ProgressBar from "../../../components/ui/ProgressBar";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

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
      alert("Enter email before proceeding");
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

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <h2 className="text-xl font-medium text-gray-800">Email Preview</h2>
            <div className="mt-2 md:mt-0">
              <Button
                variant={copied ? "default" : "outline"}
                size="sm"
                onClick={handleCopyToClipboard}
              >
                {copied ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                {copied ? "Copied!" : "Copy to Clipboard"}
              </Button>
            </div>
          </div>

          <div>
            <Label>Subject</Label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap mt-2">
              {generatedEmail.email.subject}
            </div>
          </div>

          <div>
            <Label>Message</Label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap mt-2 max-h-96 overflow-y-auto">
              {generatedEmail.email.body}
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              variant={showEmail ? "default" : "outline"}
              onClick={() => setShowEmail(true)}
              className="flex-1"
            >
              Send via Email
            </Button>
            <Button
              variant={!showEmail ? "default" : "outline"}
              onClick={() => handleOpenGmail()}
              className="flex-1"
            >
              Open Gmail
            </Button>
          </div>

          {showEmail && (
            <div className="space-y-2">
              <Label htmlFor="recipient-email">Recipient Email</Label>
              <Input
                id="recipient-email"
                placeholder="e.g. hrEmail@company.com"
                type="email"
                value={emailDistribution}
                onChange={(e) => setEmailDistribution(e.target.value)}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          size="lg"
          onClick={() => setStep(2)}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
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

export default EmailPreviewPage;
