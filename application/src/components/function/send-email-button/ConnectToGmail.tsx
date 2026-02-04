import { Button, ButtonProps } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { SiGmail } from "react-icons/si";
import { useSearchParams } from "react-router";
import { toast } from "sonner";
import {
  isClerkRuntimeError,
  isReverificationCancelledError,
} from "@clerk/clerk-react/errors";
import { useGoogleActions } from "@/api/google/hooks/useGoogleActions";
import { ReverificationDialog } from "../reverification-dialog";

const ConnectToGmailButton = (buttonProps: ButtonProps) => {
  const [searchParams] = useSearchParams();
  const { connectToGmail } = useGoogleActions();
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (connectToGmail.isVerificationNeeded) {
      setShowDialog(true);
    }
  }, [connectToGmail.isVerificationNeeded]);

  // Handle OAuth Redirect processing
  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      toast.error("Failed to connect Gmail. Please try again.");
    }
  }, [searchParams]);

  const handleConnectToGmail = async () => {
    try {
      await connectToGmail.connect();
    } catch (error) {
      if (isClerkRuntimeError(error) && isReverificationCancelledError(error)) {
        console.error("User cancelled reverification");
        toast.error("Please verify to connect to Gmail.");
      } else {
        console.error("Gmail Auth Error:", error);
        console.log("Gmail Auth error details: ", (error as any).errors);
        toast.error("Could not connect to Gmail.");
      }
    }
  };

  return (
    <>
      <Button
        size="lg"
        className="w-full text-white border-0"
        onClick={handleConnectToGmail}
        disabled={connectToGmail.isLoading}
        {...buttonProps}
      >
        {connectToGmail.isLoading ? (
          <Loader className="mr-2 text-white" />
        ) : (
          <SiGmail className="mr-2 w-5 h-5" />
        )}
        {connectToGmail.isLoading ? "Connecting..." : "Connect to Gmail"}
      </Button>

      <ReverificationDialog
        open={showDialog}
        onComplete={() => {
          connectToGmail.complete();
          setShowDialog(false);
        }}
        onCancel={() => {
          connectToGmail.cancel();
          setShowDialog(false);
        }}
      />
    </>
  );
};

export default ConnectToGmailButton;
