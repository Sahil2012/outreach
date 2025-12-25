import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { ArrowLeft, Home, Send, Mail, Check, Copy, ArrowRight } from "lucide-react";
import { SiGmail } from "react-icons/si";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface SendOptionsProps {
  isGmailConnected: boolean;
  isGmailAuthLoading: boolean;
  isSending: boolean;
  manageThread: boolean;
  emailBody: string;
  onConnectGmail: () => void;
  onSend: () => void;
  onEdit: () => void;
  onDashboard: () => void;
  setManageThread: (manageThread: boolean) => void;
}

export const SendOptions: React.FC<SendOptionsProps> = ({
  isGmailConnected,
  isGmailAuthLoading,
  isSending,
  manageThread,
  emailBody,
  onConnectGmail,
  onSend,
  onEdit,
  onDashboard,
  setManageThread
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = () => {
    if (emailBody) {
      navigator.clipboard.writeText(emailBody);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 lg:sticky lg:top-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Ready to Send?</h3>
        <p className="text-sm text-muted-foreground">
          Review your email. When you're ready, send it directly or copy to clipboard.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2 py-2">
          <Checkbox
            id="manage-thread"
            checked={manageThread}
            onCheckedChange={(checked) => setManageThread(checked as boolean)}
          />
          <Label htmlFor="manage-thread" className="text-sm font-normal">
            Automatically manage follow-ups
          </Label>
        </div>

        {/* Gmail/Send Button */}
        {!isGmailConnected ? (
          <Button
            size="lg"
            className="w-full text-white border-0"
            onClick={onConnectGmail}
            disabled={isGmailAuthLoading || isSending}
          >
            {isGmailAuthLoading ? (
              <Loader className="mr-2 text-white" />
            ) : (
              <SiGmail className="mr-2 w-5 h-5" />
            )}
            {isGmailAuthLoading ? "Connecting..." : "Connect to Gmail"}
          </Button>
        ) : (
          <Button
            size="lg"
            className="w-full"
            onClick={onSend}
            disabled={isSending}
          >
            {isSending ? <Loader className="mr-2" /> : <Send className="mr-2 w-4 h-4" />}
            {isSending ? "Sending..." : "Send Email Now"}
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

      {/* Helper Text */}
      <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-3xl border border-blue-100 dark:border-blue-900/20">
        <div className="flex items-start">
          <Mail className="w-5 h-5 text-blue-500 mt-0.5 mr-3 shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Tip</p>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Connecting your Gmail allows us to track your email trail, send automated follow-ups and notify you if a response is received.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center gap-1">
        <Button
          variant="ghost"
          onClick={onEdit}
          className="w-full"
        >
          Back to Edit
        </Button>
        <Button
          variant="outline"
          onClick={onDashboard}
          className="w-full"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};
