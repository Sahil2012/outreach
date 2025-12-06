import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Check, Copy, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { GeneratedEmail } from "@/lib/types";
import { useOutreachActions } from "@/hooks/useOutreachActions";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useUser } from "@clerk/clerk-react";
import { Loader } from "@/components/ui/loader";
import { SiGmail } from "react-icons/si";

const SendEmailPage: React.FC = () => {
  const { sendEmail, getDraft, updateEmail } = useOutreachActions();
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [manageThread, setManageThread] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAlreadyCompleted, setIsAlreadyCompleted] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();
  const { id } = useParams<{ id: string }>();
  const [generatedEmail, setGeneratedEmail] = useState<GeneratedEmail | null>(null);
  const [isGmailAuthLoading, setIsGmailAuthLoading] = useState(false);

  useEffect(() => {
    const loadDraft = async () => {
      if (id) {
        try {
          const data = await getDraft(id);
          if (data) {
            setGeneratedEmail({
              email: data.email,
              isMailGenerated: data.isMailGenerated,
              isDraftCompleted: data.isDraftCompleted
            });

            if (data.isDraftCompleted) {
              setIsAlreadyCompleted(true);
              // Auto redirect after 3 seconds
              setTimeout(() => {
                navigate("/dashboard");
              }, 3000);
            }
          }
        } catch (error) {
          console.error("Failed to load draft", error);
        }
      }
    };
    loadDraft();
  }, [id]);

  const googleAccount = user?.externalAccounts.find(
    (acc) => acc.provider.includes("google") || acc.verification?.strategy?.includes("oauth_google")
  );
  const GMAIL_SCOPE = "https://www.googleapis.com/auth/gmail.modify";
  const hasScope = googleAccount?.approvedScopes?.includes(GMAIL_SCOPE);

  const handleConnectGmail = async () => {
    if (!user) return;
    try {
      setIsGmailAuthLoading(true);
      if (googleAccount) {
        const res = await googleAccount.reauthorize({
          additionalScopes: [GMAIL_SCOPE],
          redirectUrl: globalThis.location.href
        });
        if (res.verification?.externalVerificationRedirectURL) {
          globalThis.location.href = res.verification.externalVerificationRedirectURL.toString();
        }
      } else {
        const res = await user.createExternalAccount({
          strategy: "oauth_google",
          redirectUrl: globalThis.location.href,
          additionalScopes: [GMAIL_SCOPE],
        });
        if (res.verification?.externalVerificationRedirectURL) {
          globalThis.location.href = res.verification.externalVerificationRedirectURL.toString();
        }
      }
    } catch (error) {
      console.error("Failed to authorize Gmail access:", error);
    } finally {
      setIsGmailAuthLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (id) {
      try {
        setIsLoading(true);
        await sendEmail(id, manageThread);
        await updateEmail(id, { isDraftCompleted: true });
        setSent(true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      } catch (error) {
        console.error("Failed to send email", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCopyToClipboard = () => {
    if (generatedEmail?.email?.body) {
      navigator.clipboard.writeText(generatedEmail.email.body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFinish = () => {
    navigate("/dashboard");
  };

  if (!id) return <div>Invalid Email ID</div>;
  if (!generatedEmail) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader size="lg" />
    </div>
  );

  if (isAlreadyCompleted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-fadeIn">
        <div className="bg-green-100 p-4 rounded-full">
          <Check className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold">Email Already Sent!</h1>
        <p className="text-muted-foreground">Redirecting to dashboard...</p>
        <Button onClick={handleFinish} variant="outline">Go to Dashboard Now</Button>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn min-h-[calc(100vh-200px)]">
      <div className="flex flex-col lg:flex-row gap-8 h-full">
        {/* Left Side: Email Preview */}
        <div className="w-full lg:w-3/5 space-y-4">
          <h3 className="text-xl flex items-center gap-2 font-semibold">
            <Mail className="w-5 h-5" />
            Email Preview
          </h3>
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Subject</Label>
            <div className="">
              {generatedEmail.email.subject}
            </div>
          </div>
          <div className="space-y-1 h-full">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Email Body</Label>
            <div className="wrap-break-word min-h-[400px]">
              {generatedEmail.email.body}
            </div>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="w-full lg:w-2/5 space-y-6 lg:sticky lg:top-8 h-fit">
          <Card className="border-primary/20 shadow-md py-6">
            <CardHeader className="text-center pb-2">
              <CardTitle>Choose an option</CardTitle>
              <CardDescription>
                Your email is ready. Choose an option to proceed further
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">

              {/* Send Email Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-2 py-2">
                  <Checkbox
                    id="manage-thread"
                    checked={manageThread}
                    onCheckedChange={(checked) => setManageThread(checked as boolean)}
                  />
                  <Label htmlFor="manage-thread" className="text-sm font-normal">
                    Automatically manage follow-ups
                  </Label>
                </div>

                {hasScope ? (
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={handleSendEmail}
                    disabled={sent || isLoading}
                  >
                    {isLoading ? <Loader className="mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                    {sent ? "Sent!" : "Send Email Now"}
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={handleConnectGmail}
                    disabled={isGmailAuthLoading}
                  >
                    {isGmailAuthLoading ? <Loader className="mr-2" /> : <SiGmail className="w-4 h-4 mr-2" />}
                    Connect with Gmail
                  </Button>
                )}
                <p className="text-[10px] text-center text-muted-foreground">
                  <Mail className="inline w-3 h-3 mr-1 align-text-bottom" />
                  via your connected Google account
                </p>
              </div>

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

              {/* Copy Section */}
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={handleCopyToClipboard}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy to Clipboard
                  </>
                )}
              </Button>

              {/* Success Message */}
              {sent && (
                <div className="bg-green-50 text-green-700 p-4 rounded-3xl flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-2 text-center">
                  <div className="flex items-center mb-1">
                    <Check className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Email sent!</span>
                  </div>
                  <span className="text-xs">Redirecting to dashboard...</span>
                </div>
              )}

            </CardContent>
          </Card>

          <div className="flex flex-col justify-center items-center gap-1">
            <Button
              variant="ghost"
              onClick={() => navigate(`/outreach/preview/${id}`)}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Edit
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate(`/dashboard`)}
              className="w-full"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendEmailPage;
