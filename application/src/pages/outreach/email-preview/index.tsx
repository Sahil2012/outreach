import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { useOutreach } from "@/hooks/useOutreach";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { GenerateEmailResponse } from "@/lib/types";
import { EmailEditor } from "./EmailEditor";
import { toast } from "sonner";


const EmailPreviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // Parse messageId from URL if available
  const parsedId = id ? parseInt(id, 10) : undefined;

  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as GenerateEmailResponse | undefined;

  const {
    draft,
    isLoadingDraft,
    draftError,
    isPolling,
    startPolling,
    stopPolling,
    updateDraft,
    updateMessage,
    isUpdating
  } = useOutreach(parsedId, { skipFetch: !!state });

  const [localEmail, setLocalEmail] = useState<{ subject: string; body: string } | null>(null);
  const [messageId] = useState<number | undefined>(state?.messageId || parsedId);

  // Handle Polling & Initialization
  useEffect(() => {
    // If we have state passed from navigation, use it immediately
    console.log(state);
    console.log(localEmail);

    if (state) {
      if (!localEmail) {
        setLocalEmail({
          subject: state.subject,
          body: state.body
        });
      }
      return; // Skip polling logic if we have state
    }

    if (!draft) return;

    if (draft.isMailGenerated) {
      if (isPolling) stopPolling();

      // Initialize local state if not set, or if we just finished generating (transition from null/empty to content)
      if (!localEmail) {
        setLocalEmail({
          subject: draft.email?.subject || "",
          body: draft.email?.body || ""
        });
      }
    } else {
      startPolling();
    }
  }, [draft, isPolling, startPolling, stopPolling, localEmail, state]);

  useEffect(() => {
    // Cleanup polling on unmount
    return () => {
      stopPolling();
    };
  }, [stopPolling]);


  const handleContinue = async () => {
    if (!id || !localEmail) return;
    try {
      if (messageId) {
        await updateMessage({
          messageId,
          subject: localEmail.subject,
          body: localEmail.body
        });
      } else {
        // Fallback to updateDraft if we somehow don't have a messageId
        // This path should ideally be unreachable if logic is correct
        if (id) {
          await updateDraft({
            id,
            payload: {
              subject: localEmail.subject,
              body: localEmail.body,
            }
          });
        }
      }

      navigate(`/outreach/send/${id}`);
    } catch (error) {
      console.error("Failed to update email", error);
      toast.error("Failed to save email. Please try again.");
    }
  };

  if (!id) return <div>Invalid Draft ID</div>;

  if (isLoadingDraft && !draft && !localEmail) {
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
          onClick={() => navigate(`/outreach/recipient-info?templateId=${draft?.type}`)}
          disabled={isUpdating}
        >
          <ArrowLeft className="w-4 h-4 mr-1 -ml-1" />
          Back
        </Button>
        <Button
          size="lg"
          onClick={handleContinue}
          disabled={isUpdating}
        >
          {isUpdating ? <Loader className="mr-2" /> : null}
          Continue
          <ArrowRight className="w-4 h-4 ml-1 -mr-1" />
        </Button>
      </div>
    </div>
  );
};

export default EmailPreviewPage;
