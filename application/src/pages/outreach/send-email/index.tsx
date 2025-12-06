import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { useOutreach } from "@/hooks/useOutreach";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { EmailPreviewStatic } from "./EmailPreviewStatic";
import { SendOptions } from "./SendOptions";

const SendEmailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useUser();
  
  const { 
    draft, 
    isLoadingDraft, 
    draftError, 
    sendEmail, 
    updateDraft, 
    isSending 
  } = useOutreach(id);

  const [isGmailAuthLoading, setIsGmailAuthLoading] = useState(false);
  const [manageThread, setManageThread] = useState(true);
  const [alreadySent, setAlreadySent] = useState(false);

  // Check if Gmail scope is present
  const hasGmailScope = user?.externalAccounts.some(
    (account) =>
      account.provider === "google" &&
      account.approvedScopes?.includes("https://www.googleapis.com/auth/gmail.modify")
  );

  // Auto-redirect if already completed
  useEffect(() => {
    if (draft?.isDraftCompleted && !alreadySent) {
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

  const handleConnectGmail = async () => {
    setIsGmailAuthLoading(true);
    try {
      if (hasGmailScope) {
         // Should not happen as button is hidden, but safe check
        setIsGmailAuthLoading(false);
        return;
      }
      
      const res = await user?.createExternalAccount({
        strategy: "oauth_google",
        redirectUrl: globalThis.location.href,
        additionalScopes: ["https://www.googleapis.com/auth/gmail.modify"],
      });
      
      if (res?.verification?.externalVerificationRedirectURL) {
        globalThis.location.href = res.verification.externalVerificationRedirectURL.href;
      }
    } catch (error) {
      console.error("Gmail Auth Error:", error);
      toast.error("Could not connect to Gmail.");
    } finally {
      setIsGmailAuthLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!id) return;
    try {
      await sendEmail({ id, manageThread });
      toast.success("Email sent successfully!");
      
      // Mark as completed
      await updateDraft({ id, payload: { isDraftCompleted: true } });

      setAlreadySent(true);
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (error) {
      console.error("Failed to send email", error);
      toast.error("Failed to send email. Please check your connection.");
    }
  };

  if (alreadySent) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
              <div className="p-4 rounded-full bg-green-100 text-green-600">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
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
              <div className="text-destructive font-medium">Failed to load draft.</div>
               <Button variant="outline" onClick={() => globalThis.location.reload()}>Retry</Button>
          </div>
      );
  }

  if (!draft) return null;

  return (
    <div className="animate-fadeIn h-[calc(100vh-120px)]">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 h-full">
        {/* Left Side: Preview */}
        <div className="lg:col-span-3 h-full">
            <EmailPreviewStatic
                subject={draft.email.subject}
                body={draft.email.body}
            />
        </div>

        {/* Right Side: Actions */}
        <div className="lg:col-span-2 h-full">
            <SendOptions 
                isGmailConnected={!!hasGmailScope}
                isGmailAuthLoading={isGmailAuthLoading}
                emailBody={draft.email.body}
                isSending={isSending}
                manageThread={manageThread}
                setManageThread={setManageThread}
                onConnectGmail={handleConnectGmail}
                onSend={handleSendEmail}
                onEdit={() => navigate(`/outreach/preview/${id}`)}
                onDashboard={() => navigate('/dashboard')}
            />
        </div>
      </div>
    </div>
  );
};

export default SendEmailPage;
