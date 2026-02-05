import { useSession } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface VerifyVariables {
  code: string;
}

export const useReverificationActions = () => {
  const { session } = useSession();

  const sendVerificationCode = async () => {
    const resource = await session?.startVerification({
      level: "first_factor",
    });
    if (resource?.status !== "needs_first_factor") {
      throw new Error("Verification not available or not required");
    }

    const emailCodeFactor = resource.supportedFirstFactors?.find(
      (factor) => factor.strategy === "email_code",
    );
    if (!emailCodeFactor) {
      throw new Error("Email verification not supported");
    }

    resource.session.prepareFirstFactorVerification({
      strategy: "email_code",
      emailAddressId: emailCodeFactor.emailAddressId,
    });

    return { emailForCode: emailCodeFactor.safeIdentifier };
  };

  const sendCode = useMutation({
    mutationFn: () => {
      return sendVerificationCode();
    },
    onSuccess: () => {
      toast.success("Verification code sent to your email");
    },
    onError: (err) => {
      console.error("Failed to send verification code", err);
      const errorMessage = err.message || "Failed to send verification code";
      toast.error(errorMessage);
    },
  });

  const verifyAgainstCode = async ({ code }: VerifyVariables) => {
    if (code.length !== 6) {
      throw new Error("Please enter the complete 6-digit code");
    }

    const resource = await session?.attemptFirstFactorVerification({
      strategy: "email_code",
      code,
    });

    if (resource?.status !== "complete") {
      throw new Error("Verification not complete");
    }
  };

  const verify = useMutation({
    mutationFn: (vars: VerifyVariables) => {
      return verifyAgainstCode(vars);
    },
    onSuccess: () => {
      toast.success("Verification successful!");
    },
    onError: (err) => {
      console.error("Verification error:", err);
      const errorMessage = err.message || "Invalid verification code";
      toast.error(errorMessage);
    },
  });

  return {
    sendCode,
    verify,
  };
};
