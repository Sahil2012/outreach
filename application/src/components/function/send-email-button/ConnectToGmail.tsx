import { Button, ButtonProps } from "@/components/ui/button";
import { useAuthActions } from "@/hooks/auth/useAuthActions";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { SiGmail } from "react-icons/si";
import { useSearchParams } from "react-router";
import { toast } from "sonner";

const ConnectToGmailButton = (buttonProps: ButtonProps) => {
  const [searchParams] = useSearchParams();
  const { authorizeGoogleWithEmailScope } = useAuthActions();

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
        onClick={() => authorizeGoogleWithEmailScope.mutate()}
        disabled={authorizeGoogleWithEmailScope.isPending}
        {...buttonProps}
      >
        {authorizeGoogleWithEmailScope.isPending ? (
          <Loader className="mr-2 text-white" />
        ) : (
          <SiGmail className="mr-2 w-5 h-5" />
        )}
        {authorizeGoogleWithEmailScope.isPending
          ? "Connecting..."
          : "Connect to Gmail"}
      </Button>
    </>
  );
};

export default ConnectToGmailButton;
