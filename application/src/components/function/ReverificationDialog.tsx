import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { useSession } from "@clerk/clerk-react";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import type {
  EmailCodeFactor,
  SessionVerificationResource,
} from "@clerk/types";

interface ReverificationDialogProps {
  open: boolean;
  onComplete: () => void;
  onCancel: () => void;
}

export const ReverificationDialog: React.FC<ReverificationDialogProps> = ({
  open,
  onComplete,
  onCancel,
}) => {
  const { session } = useSession();
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [error, setError] = useState("");
  const reverificationRef = useRef<SessionVerificationResource | undefined>(undefined);
  const [emailFactor, setEmailFactor] = useState<EmailCodeFactor | undefined>();

  const startVerificationFlow = useCallback(async () => {
    setIsPreparing(true);
    setError("");
    
    try {
      // Start the verification session
      const verificationResource = await session?.startVerification({ 
        level: "first_factor" 
      });

      if (!verificationResource) {
        throw new Error("Failed to start verification");
      }

      reverificationRef.current = verificationResource;

      // Prepare email verification
      if (verificationResource.status === "needs_first_factor") {
        const emailCodeFactor = verificationResource.supportedFirstFactors?.find(
          (factor) => factor.strategy === "email_code"
        ) as EmailCodeFactor | undefined;

        if (emailCodeFactor) {
          setEmailFactor(emailCodeFactor);
          
          // Prepare the first factor verification
          await session?.prepareFirstFactorVerification({
            strategy: "email_code",
            emailAddressId: emailCodeFactor.emailAddressId,
          });

          toast.success("Verification code sent to your email");
        } else {
          throw new Error("Email verification not supported");
        }
      }
    } catch (error: any) {
      console.error("Failed to start verification:", error);
      const errorMessage = error?.errors?.[0]?.message || "Failed to send verification code";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsPreparing(false);
    }
  }, [session]);

  // Start verification when dialog opens
  useEffect(() => {
    if (open && !reverificationRef.current && !isPreparing) {
      startVerificationFlow();
    }
  }, [open, isPreparing, startVerificationFlow]);

  const handleVerify = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (code.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setIsVerifying(true);
    setError("");
    
    try {
      // Attempt to verify the session with the provided code
      await session?.attemptFirstFactorVerification({
        strategy: "email_code",
        code: code,
      });

      toast.success("Verification successful!");
      setCode("");
      reverificationRef.current = undefined;
      onComplete();
    } catch (error: any) {
      console.error("Verification error:", error);
      const errorMessage = error?.errors?.[0]?.message || "Invalid verification code";
      setError(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCancel = () => {
    setCode("");
    setError("");
    reverificationRef.current = undefined;
    onCancel();
  };

  const handleResend = async () => {
    setCode("");
    setError("");
    reverificationRef.current = undefined;
    await startVerificationFlow();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleCancel()}>
      <DialogContent className="sm:max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle>Verify Your Identity</DialogTitle>
          <DialogDescription>
            {emailFactor?.safeIdentifier 
              ? `We sent a verification code to ${emailFactor.safeIdentifier}`
              : "We sent a verification code to your email. Please enter it below to continue."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleVerify} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="flex justify-center py-2">
            <InputOTP 
              maxLength={6} 
              value={code} 
              onChange={(value) => setCode(value)}
              disabled={isVerifying || isPreparing}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              className="w-full h-10 font-medium"
              disabled={isVerifying || isPreparing || code.length !== 6}
            >
              {isVerifying ? <Loader className="w-4 h-4 mr-2" /> : null}
              Verify
            </Button>

            <div className="flex items-center justify-between text-sm mt-3">
              <Button
                type="button"
                variant="link"
                onClick={handleCancel}
                disabled={isVerifying || isPreparing}
                className="text-muted-foreground p-0 h-auto"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="link"
                onClick={handleResend}
                disabled={isVerifying || isPreparing}
                className="text-primary p-0 h-auto font-semibold"
              >
                {isPreparing ? <Loader className="w-3 h-3 mr-1" /> : null}
                Resend code
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
