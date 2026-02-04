import { useSession } from "@clerk/clerk-react";
import { SessionVerificationResource } from "@clerk/types";
import { useState } from "react";
import { toast } from "sonner";

interface VerificationState {
  isSendingCode: boolean;
  isVerifying: boolean;
  error?: Error;
  verificationResource?: SessionVerificationResource;
  userEmailForCode?: string;
}

export const useAuthActions = () => {
  const { session } = useSession();

  const initialVerification: VerificationState = {
    isSendingCode: false,
    isVerifying: false,
  };
  const [verification, setVerification] = useState(initialVerification);

  const getVerificationResource = async () => {
    if (verification.verificationResource) {
      return verification.verificationResource;
    }

    const resource = await session?.startVerification({
      level: "first_factor",
    });

    if (resource) {
      setVerification({
        ...verification,
        verificationResource: resource,
      });
    }
    return resource;
  };

  const startVerification = async () => {
    setVerification({
      ...verification,
      isSendingCode: true,
      error: undefined,
    });

    try {
      const verificationResource = await getVerificationResource();
      if (!verificationResource) {
        setVerification({
          ...verification,
          error: new Error("Failed to start verification"),
        });
        return;
      }

      if (verificationResource.status === "needs_first_factor") {
        const emailCodeFactor =
          verificationResource.supportedFirstFactors?.find(
            (factor) => factor.strategy === "email_code",
          );

        if (!emailCodeFactor) {
          setVerification({
            ...verification,
            error: new Error("Email verification not supported"),
          });
          return;
        }

        await session?.prepareFirstFactorVerification({
          strategy: "email_code",
          emailAddressId: emailCodeFactor.emailAddressId,
        });
        setVerification({
          ...verification,
          userEmailForCode: emailCodeFactor.safeIdentifier,
        });
        toast.success("Verification code sent to your email");
      }
    } catch (error: any) {
      console.error("Failed to send verification code", error);
      const errorMessage =
        error?.errors?.[0]?.message || "Failed to send verification code";
      setVerification({
        ...verification,
        error: new Error(errorMessage),
      });
      toast.error(errorMessage);
    } finally {
      setVerification({
        ...verification,
        isSendingCode: false,
      });
    }
  };

  const verifyAgainstCode = async (code: string, onSuccess?: () => void) => {
    if (code.length !== 6) {
      setVerification({
        ...verification,
        error: new Error("Please enter the complete 6-digit code"),
      });
      return;
    }

    setVerification({
      ...verification,
      isVerifying: true,
      error: undefined,
    });

    try {
      await session?.attemptFirstFactorVerification({
        strategy: "email_code",
        code: code,
      });

      toast.success("Verification successful!");
      setVerification({
        ...verification,
        verificationResource: undefined,
      });
      onSuccess?.();
    } catch (error: any) {
      console.error("Verification error:", error);
      const errorMessage =
        error?.errors?.[0]?.message || "Invalid verification code";
      setVerification({
        ...verification,
        error: new Error(errorMessage),
      });
      toast.error(errorMessage);
    } finally {
      setVerification({
        ...verification,
        isVerifying: false,
      });
    }
  };

  const cancelVerification = () => {
    setVerification({
      ...verification,
      error: undefined,
      verificationResource: undefined,
      isSendingCode: false,
      userEmailForCode: undefined,
    });
  };

  const resendCode = () => {
    setVerification({
      ...verification,
      error: undefined,
      verificationResource: undefined,
    });
    startVerification();
  };

  return {
    verification: {
      start: startVerification,
      verify: verifyAgainstCode,
      cancel: cancelVerification,
      resendCode,
      isSendingCode: verification.isSendingCode,
      isVerifying: verification.isVerifying,
      error: verification.error,
      userEmailForCode: verification.userEmailForCode,
    },
  };
};
