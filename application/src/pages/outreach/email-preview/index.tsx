import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/ui/loader";
import { Textarea } from "@/components/ui/textarea";
import { useOutreachActions } from "@/hooks/useOutreachActions";
import { GeneratedEmail } from "@/lib/types";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EmailPreviewPage: React.FC = () => {
  const { updateEmail, getDraft } = useOutreachActions();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState<GeneratedEmail>({
    email: {
      subject: "",
      body: "",
    },
    isMailGenerated: false,
  });
  const [templateId, setTemplateId] = useState<string | null>(null);

  const loadDraft = async () => {
    if (!id) return;
    try {
      const data = await getDraft(id);
      if (data) {
        setGeneratedEmail({
          email: data.email || { subject: "", body: "" },
          isMailGenerated: data.isMailGenerated
        });
        setTemplateId(data.templateId);
      }
    } catch (error) {
      console.error("Failed to load draft", error);
    }
  };

  // Initial load
  useEffect(() => {
    loadDraft();
  }, []);

  // Monitor state to toggle polling
  useEffect(() => {
    if (!generatedEmail) return;

    if (generatedEmail.isMailGenerated) {
      setIsPolling(false);
    } else {
      setIsPolling(true);
    }
  }, [generatedEmail]);

  // Polling mechanism
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isPolling) {
      intervalId = setInterval(async () => {
        await loadDraft();
      }, 2000);
    }

    return () => clearInterval(intervalId);
  }, [isPolling]);

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

  const handleContinue = async () => {
    if (id) {
      setIsLoading(true);
      try {
        await updateEmail(id, {
          subject: generatedEmail.email.subject,
          body: generatedEmail.email.body,
        });
        navigate(`/outreach/send/${id}`);
      } catch (error) {
        console.error("Failed to update email", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!id) return <div>Invalid Draft ID</div>;

  if (!generatedEmail.isMailGenerated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader size="lg" />
        <p className="text-muted-foreground animate-pulse">Generating your email...</p>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email-subject">Subject Line</Label>
        <Input
          id="email-subject"
          value={generatedEmail.email.subject}
          onChange={handleSubjectChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email-body">Email Body</Label>
        <Textarea
          id="email-body"
          value={generatedEmail.email.body}
          onChange={handleBodyChange}
          className="min-h-[400px] resize-y"
        />
      </div>

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => navigate(`/outreach/recipient-info?templateId=${templateId}`)}
          disabled={isLoading}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          size="lg"
          onClick={handleContinue}
          disabled={isLoading}
        >
          {isLoading ? <Loader className="mr-2" /> : null}
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default EmailPreviewPage;
