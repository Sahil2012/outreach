import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useOutreach } from "../../../context/OutreachContext";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Card, CardContent } from "../../../components/ui/card";

const EmailPreviewPage: React.FC = () => {
  const { setStep, generatedEmail, setGeneratedEmail } = useOutreach();

  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGeneratedEmail({
      ...generatedEmail,
      email: {
        ...generatedEmail.email,
        subject: e.target.value,
      },
    });
  };

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setGeneratedEmail({
      ...generatedEmail,
      email: {
        ...generatedEmail.email,
        body: e.target.value,
      },
    });
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email-subject">Subject Line</Label>
            <Input
              id="email-subject"
              value={generatedEmail.email.subject}
              onChange={handleSubjectChange}
              className="font-medium"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email-body">Email Body</Label>
            <Textarea
              id="email-body"
              value={generatedEmail.email.body}
              onChange={handleBodyChange}
              className="min-h-[400px] font-mono text-sm resize-y"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => setStep(2)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          size="lg"
          onClick={() => setStep(4)}
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default EmailPreviewPage;
