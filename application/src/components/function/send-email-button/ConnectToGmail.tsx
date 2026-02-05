import { useGoogleActions } from "@/api/google/hooks/useGoogleActions";
import { Button, ButtonProps } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { SiGmail } from "react-icons/si";
import { useSearchParams } from "react-router";
import { toast } from "sonner";
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

  return (
    <>
      <Button
        size="lg"
        className="w-full text-white border-0"
        onClick={() => connectToGmail.connect()}
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
          connectToGmail.completeReverification();
          setShowDialog(false);
        }}
        onCancel={() => {
          connectToGmail.cancelReverification();
          setShowDialog(false);
        }}
      />
    </>
  );
};

export default ConnectToGmailButton;
