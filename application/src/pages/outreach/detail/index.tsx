import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader } from "@/components/ui/loader";
import { useOutreachDetail } from "@/hooks/useOutreachDetail";
import { DetailsAndActions } from "./DetailsAndActions";
import { EmailThread } from "./EmailThread";
import { toast } from "sonner";
import { useReverification, useUser } from "@clerk/clerk-react";
import {
  isClerkRuntimeError,
  isReverificationCancelledError,
} from "@clerk/clerk-react/errors";
import { ReverificationDialog } from "./ReverificationDialog";

const OutreachDetailPage: React.FC = () => {
  const [isGmailAuthLoading, setIsGmailAuthLoading] = useState(false);
  const [showReverificationDialog, setShowReverificationDialog] =
    useState(false);
  const [reverificationHandlers, setReverificationHandlers] = useState<{
    complete: () => void;
    cancel: () => void;
  } | null>(null);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();

  const idNumber = Number(id);
  const {
    data,
    isLoading,
    error,
    updateStatus,
    toggleAutomated,
    isUpdatingStatus,
    isTogglingAutomated,
    generateFollowUp,
    isGeneratingFollowUp,
  } = useOutreachDetail(idNumber);

  const isConnectedToGoogle = user?.externalAccounts.some(
    (account) => account.provider === "google"
  );

  const hasGmailScope = user?.externalAccounts.some(
    (account) =>
      account.provider === "google" &&
      account.approvedScopes?.includes(
        "https://www.googleapis.com/auth/gmail.modify"
      )
  );

  const connectToGmail = useReverification(
    async () => {
      let res;
      if (!isConnectedToGoogle) {
        res = await user?.createExternalAccount({
          strategy: "oauth_google",
          redirectUrl: globalThis.location.href,
          additionalScopes: ["https://www.googleapis.com/auth/gmail.modify"],
          oidcPrompt: "consent",
          // @ts-ignore
          access_type: "offline",
        });
      } else {
        const googleAccount = user?.externalAccounts.find(
          (acc) => acc.provider === "google"
        );
        res = await googleAccount?.reauthorize({
          redirectUrl: globalThis.location.href,
          additionalScopes: ["https://www.googleapis.com/auth/gmail.modify"],
          oidcPrompt: "consent",
          // @ts-ignore
          access_type: "offline",
        });
      }

      if (res?.verification?.externalVerificationRedirectURL) {
        globalThis.location.href =
          res.verification.externalVerificationRedirectURL.href;
      }
    },
    {
      onNeedsReverification: ({ complete, cancel }) => {
        setReverificationHandlers({ complete, cancel });
        setShowReverificationDialog(true);
      },
    }
  );

  const handleConnectGmail = async () => {
    setIsGmailAuthLoading(true);
    try {
      await connectToGmail();
    } catch (error) {
      if (isClerkRuntimeError(error) && isReverificationCancelledError(error)) {
        console.error("User cancelled reverification");
        toast.error("Please verify to connect to Gmail.");
      } else {
        console.error("Gmail Auth Error:", error);
        console.log("Gmail Auth error details: ", (error as any).errors);
        toast.error("Could not connect to Gmail.");
      }
    } finally {
      setIsGmailAuthLoading(false);
    }
  };

  if (!id || isNaN(idNumber)) {
    navigate("/dashboard");
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="text-destructive font-medium">
          Failed to load outreach details.
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="text-primary hover:underline"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handleGenerateFollowUp = async () => {
    try {
      const res = await generateFollowUp();
      toast.success("Follow-up generated successfully!");
      navigate(`/outreach/preview/${res?.messageId}`, { state: res });
    } catch {
      toast.error("Failed to generate follow-up.");
    }
  };

  const handleMarkAbsconded = async () => {
    try {
      await updateStatus({ status: 'CLOSED' });
      toast.success("Marked as absconded.");
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const handleMarkReferred = async () => {
    try {
      await updateStatus({ status: 'REFFERED' });
      toast.success("Marked as referred!");
    } catch {
      console.error("Failed to update status.");
      toast.error("Failed to update status.");
    }
  };

  const handleToggleAutomated = async (checked: boolean) => {
    try {
      await toggleAutomated(checked);
      toast.success(
        `Automated follow-ups ${checked ? "enabled" : "disabled"}.`
      );
    } catch {
      console.error("Failed to update settings.");
      toast.error("Failed to update settings.");
    }
  };

  return (
    <>
      <div className="animate-fadeIn p-6 h-[calc(100vh-80px)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          {/* Left Side: Details & Actions */}
          <div className="lg:col-span-4 h-full overflow-hidden">
            <DetailsAndActions
              data={data}
              isGeneratingFollowUp={isGeneratingFollowUp}
              isUpdating={isUpdatingStatus || isTogglingAutomated}
              onGenerateFollowUp={handleGenerateFollowUp}
              onMarkAbsconded={handleMarkAbsconded}
              onMarkReferred={handleMarkReferred}
              onToggleAutomated={handleToggleAutomated}
              isGmailConnected={(isConnectedToGoogle && hasGmailScope) || false}
              onBack={() => navigate("/dashboard")}
              onConnectGmail={handleConnectGmail}
              isGmailAuthLoading={isGmailAuthLoading}
            />
          </div>
          {/* Right Side: Thread */}
          <div className="lg:col-span-8 h-full overflow-hidden bg-muted/10">
            <EmailThread thread={data.messages || []} />
          </div>
        </div>
      </div>

      {/* Reverification Dialog */}
      <ReverificationDialog
        open={showReverificationDialog}
        onComplete={() => {
          reverificationHandlers?.complete();
          setShowReverificationDialog(false);
        }}
        onCancel={() => {
          reverificationHandlers?.cancel();
          setShowReverificationDialog(false);
        }}
      />
    </>
  );
};

export default OutreachDetailPage;
