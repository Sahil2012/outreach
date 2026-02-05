import { useReverification, useUser } from "@clerk/clerk-react";
import { useGoogle } from "@/hooks/google/useGoogleData";
import { useRef, useState } from "react";
import {
  isClerkRuntimeError,
  isReverificationCancelledError,
} from "@clerk/clerk-react/errors";
import { toast } from "sonner";

export const useGoogleActions = () => {
  const { user } = useUser();
  const { account, isConnectedToGoogle } = useGoogle();

  const [isConnectingToGmail, setIsConnectingToGmail] = useState(false);
  const [isVerificationNeeded, setIsVerificationNeeded] = useState(false);
  const complete = useRef<() => void>(() => {});
  const cancel = useRef<() => void>(() => {});

  const [isReauthorizing, setIsReauthorizing] = useState(false);
  const [reauthorizationError, setReauthorizationError] = useState();

  const connectToGmailWithVerification = useReverification(
    async () => {
      const params = {
        redirectUrl: globalThis.location.href,
        additionalScopes: ["https://www.googleapis.com/auth/gmail.modify"],
        oidcPrompt: "consent",
        access_type: "offline",
      };

      let res;
      if (!isConnectedToGoogle) {
        res = await user?.createExternalAccount({
          ...params,
          strategy: "oauth_google",
        });
      } else {
        res = await account?.reauthorize(params);
      }

      if (res?.verification?.externalVerificationRedirectURL) {
        globalThis.location.href =
          res.verification.externalVerificationRedirectURL.href;
      }
    },
    {
      onNeedsReverification: (calls) => {
        setIsVerificationNeeded(true);
        complete.current = () => {
          setIsVerificationNeeded(false);
          calls.complete();
        };
        cancel.current = () => {
          setIsVerificationNeeded(false);
          calls.cancel();
        };
      },
    },
  );

  const connectToGmail = async () => {
    setIsConnectingToGmail(true);
    try {
      await connectToGmailWithVerification();
    } catch (error) {
      if (isClerkRuntimeError(error) && isReverificationCancelledError(error)) {
        console.error("User cancelled reverification");
        toast.error("Please verify to connect to Gmail.");
      } else {
        console.error("Gmail Auth Error:", error);
        console.log("Gmail Auth error details: ", (error as any).errors);
        toast.error("Could not connect to Gmail.");
      }
    } finally {
      setIsConnectingToGmail(false);
    }
  };

  const reauthorize = async () => {
    setIsReauthorizing(true);
    try {
      const res = await account?.reauthorize({
        oidcPrompt: "consent",
        redirectUrl: globalThis.location.href,
        additionalScopes: ["https://www.googleapis.com/auth/gmail.modify"],
      });
      if (res?.verification?.externalVerificationRedirectURL) {
        globalThis.location.href =
          res.verification.externalVerificationRedirectURL.href;
      }
    } catch (err: any) {
      console.error("Could not Reauthorize with google", err);
      setReauthorizationError(err);
    } finally {
      setIsReauthorizing(false);
    }
  };

  return {
    connectToGmail: {
      connect: connectToGmail,
      isLoading: isConnectingToGmail,
      isVerificationNeeded,
      completeReverification: complete.current,
      cancelReverification: cancel.current,
    },
    reauthorizeWithGoogle: {
      reauthorize,
      isLoading: isReauthorizing,
      error: reauthorizationError,
    },
  };
};
