import { useReverification, useSession, useUser } from "@clerk/clerk-react";
import {
  isClerkRuntimeError,
  isReverificationCancelledError,
} from "@clerk/clerk-react/errors";
import { SessionVerificationResource } from "@clerk/types";
import { useState } from "react";
import { toast } from "sonner";

interface UpdatePasswordProps {
  newPassword: string;
  currentPassword?: string;
  onSuccess?: () => void;
}

interface VerificationState {
  isSendingCode: boolean;
  isVerifying: boolean;
  error?: Error;
  verificationResource?: SessionVerificationResource;
  userEmailForCode?: string;
}

interface UpdatePasswordState {
  isLoading: boolean;
  isVerificationNeeded: boolean;
  error?: Error;
  completeReverification?: () => void;
  cancelReverification?: () => void;
}

export const useAuthActions = () => {
  const { session } = useSession();
  const { user } = useUser();

  const initialVerification: VerificationState = {
    isSendingCode: false,
    isVerifying: false,
  };
  const [verification, setVerification] = useState(initialVerification);
  // const initialUpdatePassword: UpdatePasswordState = {
  //   isLoading: false,
  //   isVerificationNeeded: false,
  // };
  const [updatePasswordState, setUpdatePasswordState] = useState(
    { isLoading: false, isVerificationNeeded: false },
    // initialUpdatePassword,
  );
  const [reverificationNeeded, setReverificationNeeded] = useState(false);

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

  const updatePasswordWithVerification = useReverification(
    async ({
      newPassword,
      currentPassword,
      onSuccess,
    }: UpdatePasswordProps) => {
      if (user?.passwordEnabled) {
        await user.updatePassword({
          currentPassword,
          newPassword,
        });
        toast.success("Password updated successfully");
      } else {
        await user?.updatePassword({
          newPassword,
        });
        toast.success("Password set successfully");
      }

      onSuccess?.();
      console.log("after success");
      setUpdatePasswordState((prev) => ({
        ...prev,
        error: undefined,
      }));
    },
    {
      onNeedsReverification: (calls) => {
        console.log("on need verification");
        setReverificationNeeded(true);
        setUpdatePasswordState((prev) => ({
          ...prev,
          isVerificationNeeded: true,
          completeReverification: () => {
            console.log("completed");
            setUpdatePasswordState((prev) => ({
              ...prev,
              isVerificationNeeded: false,
              completeReverification: undefined,
            }));
            calls.complete();
          },
          cancelReverification: () => {
            console.log("completed");
            setUpdatePasswordState((prev) => ({
              ...prev,
              isVerificationNeeded: false,
              cancelReverification: undefined,
            }));
            calls.cancel();
          },
        }));
      },
    },
  );

  const updatePassword = async ({
    newPassword,
    currentPassword,
    onSuccess,
  }: UpdatePasswordProps) => {
    try {
      setUpdatePasswordState({
        ...updatePasswordState,
        isLoading: true,
        error: undefined,
      });
      await updatePasswordWithVerification({
        newPassword,
        onSuccess,
        currentPassword,
      });
    } catch (error: any) {
      if (isClerkRuntimeError(error) && isReverificationCancelledError(error)) {
        console.error("User cancelled reverification");
        toast.error("Please verify to update your password.");
        console.log("in catch if");
        setUpdatePasswordState((prev) => ({
          ...prev,
          error: new Error("User cancelled reverification"),
        }));
      } else {
        console.error("Update password Error:", error);
        console.log("Update password error details: ", (error as any).errors);
        toast.error("Could not update password.");
        console.log("in catch else");
        setUpdatePasswordState((prev) => ({
          ...prev,
          error: new Error(
            error.errors?.[0]?.longMessage || "Failed to update password",
          ),
        }));
      }
    } finally {
      console.log("in finally");
      setUpdatePasswordState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  };

  console.log("verification needed", reverificationNeeded);

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
    updatePassword: {
      update: updatePassword,
      completeReverification: updatePasswordState.completeReverification,
      cancelReverification: updatePasswordState.cancelReverification,
      error: updatePasswordState.error,
      isLoading: updatePasswordState.isLoading,
      isVerificationNeeded: reverificationNeeded,
    },
  };
};
