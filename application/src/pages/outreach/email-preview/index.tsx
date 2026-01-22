import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router";
import { GenerateEmailResponse } from "@/lib/types";
import { EmailEditor } from "./EmailEditor";
import { toast } from "sonner";
import { useMessage } from "@/api/messages/hooks/useMessageData";
import { useMessageActions } from "@/api/messages/hooks/useMessageActions";

const EmailPreviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // Parse messageId from URL if available
  const parsedId = Number(id);

  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as GenerateEmailResponse | undefined;

  // const {
  //   draft,
  //   isLoadingDraft,
  //   draftError,
  //   isPolling,
  //   startPolling,
  //   stopPolling,
  //   updateDraft,
  //   updateMessage,
  //   isUpdating
  // } = useOutreach(parsedId, { skipFetch: !!state });
  const {
    data: draft,
    isLoading: isLoadingDraft,
    error: draftError,
  } = useMessage(parsedId);
  const { updateDraft } = useMessageActions();

  const [localEmail, setLocalEmail] = useState<{
    subject?: string;
    body?: string;
  }>({
    subject: state?.subject || draft?.subject,
    body: state?.body || draft?.body,
  });
  const [messageId] = useState<number | undefined>(
    state?.messageId || parsedId,
  );

  // Handle Polling & Initialization
  useEffect(() => {
    // If we have state passed from navigation, use it immediately
    console.log(state);
    console.log(localEmail);

    if (state) {
      if (!localEmail) {
        setLocalEmail({
          subject: state.subject,
          body: state.body,
        });
      }
      return; // Skip polling logic if we have state
    }
  }, [state]);

  const handleContinue = async () => {
    if (!id || !localEmail) return;
    try {
      if (messageId) {
        await updateDraft.mutateAsync({
          id: parsedId,
          subject: localEmail.subject || "",
          body: localEmail.body || "",
        });
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
        <div className="text-destructive font-medium">
          Failed to load draft.
        </div>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  // Still generating - TODO: Not required now. Remove
  // if (draft && !draft.isMailGenerated) {
  //   return (
  //     <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
  //       <Loader size="lg" />
  //       <p className="text-muted-foreground animate-pulse">
  //         Generating your email...
  //       </p>
  //     </div>
  //   );
  // }

  return (
    <div className="animate-fadeIn space-y-6">
      <EmailEditor
        subject={localEmail.subject || ""}
        body={localEmail.body || ""}
        onSubjectChange={(val) =>
          setLocalEmail((prev) => ({ ...prev, subject: val }))
        }
        onBodyChange={(val) =>
          setLocalEmail((prev) => ({ ...prev, body: val }))
        }
      />

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() =>
            navigate(`/outreach/recipient-info?templateId=${draft?.type}`)
          }
          disabled={updateDraft.isPending}
        >
          <ArrowLeft className="w-4 h-4 mr-1 -ml-1" />
          Back
        </Button>
        <Button
          size="lg"
          onClick={handleContinue}
          disabled={updateDraft.isPending}
        >
          {updateDraft.isPending ? <Loader className="mr-2" /> : null}
          Continue
          <ArrowRight className="w-4 h-4 ml-1 -mr-1" />
        </Button>
      </div>
    </div>
  );
};

export default EmailPreviewPage;
