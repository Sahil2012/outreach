import React, { useState } from "react";
import { ArrowLeft, Check, Copy, ExternalLink, Mail } from "lucide-react";
import { useOutreach } from "../../../context/OutreachContext";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { useNavigate } from "react-router-dom";

const SendEmailPage: React.FC = () => {
  const { setStep, generatedEmail, resetForm, recipientInfo } = useOutreach();
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleOpenGmail = () => {
    const subject = encodeURIComponent(generatedEmail.email.subject);
    const body = encodeURIComponent(generatedEmail.email.body);
    const to = encodeURIComponent(recipientInfo.userContact); // Use employee email
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`;
    window.open(gmailUrl, "_blank");
    setSent(true);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedEmail.email.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFinish = () => {
    resetForm();
    navigate("/dashboard");
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <Card className="py-6">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <CardTitle>Ready to Send!</CardTitle>
          <CardDescription>
            Your email is ready. Choose how you want to send it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <div className="flex flex-col gap-4">
            <Button
              size="lg"
              className="w-full h-14 text-lg"
              onClick={handleOpenGmail}
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Open in Gmail
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={handleCopyToClipboard}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied to Clipboard
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy to Clipboard
                </>
              )}
            </Button>
          </div>

          {sent && (
            <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center justify-center animate-in fade-in slide-in-from-bottom-2">
              <Check className="w-5 h-5 mr-2" />
              <span className="font-medium">Email opened in Gmail! Don't forget to hit send.</span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button
          variant="ghost"
          onClick={() => setStep(3)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Preview
        </Button>
        <Button
          variant="secondary"
          onClick={handleFinish}
        >
          Done & Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default SendEmailPage;
