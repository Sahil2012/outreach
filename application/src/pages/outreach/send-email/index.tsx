import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { useUser, useReverification } from "@clerk/clerk-react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { toast } from "sonner";
import { EmailPreviewStatic } from "./EmailPreviewStatic";
import { SendOptions } from "./SendOptions";
import { ReverificationDialog } from "./ReverificationDialog";
import {
  isClerkRuntimeError,
  isReverificationCancelledError,
} from "@clerk/clerk-react/errors";
import { useMessage } from "@/api/messages/hooks/useMessageData";
import { useMessageActions } from "@/api/messages/hooks/useMessageActions";

const SendEmailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useUser();

  const parsedId = Number(id);

  // const { draft, isLoadingDraft, draftError, sendEmail, isSending } =
  //   useOutreach(id);
  const {
    data: draft,
    isLoading: isLoadingDraft,
    error: draftError,
  } = useMessage(parsedId);
  const { sendMessage } = useMessageActions();

  const [isGmailAuthLoading, setIsGmailAuthLoading] = useState(false);
  const [manageThread, setManageThread] = useState(true);
  const [alreadySent, setAlreadySent] = useState(false);
  const [showReverificationDialog, setShowReverificationDialog] =
    useState(false);
  const [reverificationHandlers, setReverificationHandlers] = useState<{
    complete: () => void;
    cancel: () => void;
  } | null>(null);

  // Check if Gmail scope is present
  const isConnectedToGoogle = user?.externalAccounts.some(
    (account) => account.provider === "google",
  );

  const hasGmailScope = user?.externalAccounts.some(
    (account) =>
      account.provider === "google" &&
      account.approvedScopes?.includes(
        "https://www.googleapis.com/auth/gmail.modify",
      ),
  );

  // Auto-redirect if already completed
  useEffect(() => {
    if (draft?.status === "SENT" && !alreadySent) {
      setAlreadySent(true);
      toast.success("Email Already Sent!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    }
  }, [draft, navigate, alreadySent]);

  // Handle OAuth Redirect processing
  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      setIsGmailAuthLoading(false);
      toast.error("Failed to connect Gmail. Please try again.");
    }
  }, [searchParams]);

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
          (acc) => acc.provider === "google",
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
    },
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

  const handleSendEmail = async () => {
    if (!id) return;
    if (!draft || !draft.threadId || !draft.id) {
      toast.error("Missing thread or message ID. Cannot send email.");
      return;
    }
    try {
      await sendMessage.mutateAsync({
        threadId: draft.threadId,
        id: draft.id,
        attachResume: true,
      });
      toast.success("Email sent successfully!");
      setAlreadySent(true);
      setTimeout(() => navigate("/dashboard"), 3000);
    } catch (error: any) {
      if (
        (error?.response?.status === 400 &&
          error?.response.data.error === "User not connected with Google") ||
        (error?.response?.status === 422 &&
          error?.response?.data?.error?.code === "oauth_missing_refresh_token")
      ) {
        const externalAccount = user?.externalAccounts.find(
          (acc) => acc.provider === "google",
        );
        const res = await externalAccount?.reauthorize({
          oidcPrompt: "consent",
          redirectUrl: globalThis.location.href,
          additionalScopes: ["https://www.googleapis.com/auth/gmail.modify"],
        });
        if (res?.verification?.externalVerificationRedirectURL) {
          globalThis.location.href =
            res.verification.externalVerificationRedirectURL.href;
        }
      }
      console.error("Failed to send email", error);
      toast.error("Failed to send email. Please check your connection.");
    }
  };

  if (alreadySent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="p-4 rounded-full bg-green-100 text-green-600">
          <svg
            className="w-12 h-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold">Email Sent!</h2>
        <p className="text-muted-foreground">Redirecting to dashboard...</p>
      </div>
    );
  }

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
        <div className="text-destructive font-medium">
          Failed to load draft.
        </div>
        <Button variant="outline" onClick={() => globalThis.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  if (!draft) return null;

  return (
    <>
      <div className="animate-fadeIn">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Side: Preview */}
          <div className="lg:col-span-3">
            <EmailPreviewStatic subject={draft.subject} body={draft.body} />
          </div>

          {/* Right Side: Actions */}
          <div className="lg:col-span-2">
            <SendOptions
              isGmailConnected={!!hasGmailScope}
              isGmailAuthLoading={isGmailAuthLoading}
              emailBody={draft.body}
              isSending={sendMessage.isPending}
              manageThread={manageThread}
              setManageThread={setManageThread}
              onConnectGmail={handleConnectGmail}
              onSend={handleSendEmail}
              onEdit={() => navigate(`/outreach/preview/${id}`)}
              onDashboard={() => navigate("/dashboard")}
            />
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

export default SendEmailPage;
