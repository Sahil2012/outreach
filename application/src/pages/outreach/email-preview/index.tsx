import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { useOutreach } from "@/hooks/useOutreach";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { EmailEditor } from "./EmailEditor";
import { toast } from "sonner";

const EmailPreviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    draft, 
    isLoadingDraft, 
    draftError, 
    isPolling, 
    startPolling, 
    stopPolling, 
    updateDraft, 
    isUpdating 
  } = useOutreach(id);

  const [localEmail, setLocalEmail] = useState<{ subject: string; body: string } | null>(null);

  // Handle Polling & Initialization
  useEffect(() => {
    if (!draft) return;

    if (!draft.isMailGenerated) {
       if (!isPolling) startPolling();
    } else {
       if (isPolling) stopPolling();
       
       // Initialize local state if not set, or if we just finished generating (transition from null/empty to content)
       if (!localEmail) {
           setLocalEmail({ 
               subject: draft.email?.subject || "", 
               body: draft.email?.body || "" 
           });
       }
    }
  }, [draft, isPolling, startPolling, stopPolling, localEmail]);

  useEffect(() => {
      // Cleanup polling on unmount
      return () => {
          stopPolling();
      };
  }, [stopPolling]);


  const handleContinue = async () => {
    if (!id || !localEmail) return;
    try {
      await updateDraft({
        id,
        payload: {
          subject: localEmail.subject,
          body: localEmail.body,
        }
      });
      navigate(`/outreach/send/${id}`);
    } catch (error) {
      console.error("Failed to update email", error);
      toast.error("Failed to save email. Please try again.");
    }
  };

  if (!id) return <div>Invalid Draft ID</div>;

  if (isLoadingDraft && !draft) {
      return (
          <div className="flex items-center justify-center min-h-[60vh]">
              <Loader size="lg" />
          </div>
      );
  }

  if (draftError) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
              <div className="text-destructive font-medium">Failed to load draft.</div>
               <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
          </div>
      );
  }

  // Still generating
  if (draft && !draft.isMailGenerated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader size="lg" />
        <p className="text-muted-foreground animate-pulse">Generating your email...</p>
      </div>
    );
  }

  if (!localEmail) return null; // Should be initializing

  return (
    <div className="animate-fadeIn space-y-6">
      <EmailEditor
          subject={localEmail.subject}
          body={localEmail.body}
          onSubjectChange={(val) => setLocalEmail(prev => prev ? ({ ...prev, subject: val }) : null)}
          onBodyChange={(val) => setLocalEmail(prev => prev ? ({ ...prev, body: val }) : null)}
      />

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => navigate(`/outreach/recipient-info?templateId=${draft?.templateId}`)}
          disabled={isUpdating}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          size="lg"
          onClick={handleContinue}
          disabled={isUpdating}
        >
          {isUpdating ? <Loader className="mr-2" /> : null}
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default EmailPreviewPage;
