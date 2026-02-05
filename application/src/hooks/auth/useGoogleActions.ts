import { useHandleReverification } from "@/providers/ReverificationProvider";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useGoogle } from "./useGoogleData";
import {
  isClerkRuntimeError,
  isReverificationCancelledError,
} from "@clerk/clerk-react/errors";

export const useGoogleActions = () => {
  const { user } = useUser();
  const { account, isConnectedToGoogle } = useGoogle();

  const { func: authorizeWithVerification } = useHandleReverification(
    async () => {
      const params = {
        redirectUrl: globalThis.location.href,
        additionalScopes: ["https://www.googleapis.com/auth/gmail.modify"],
        oidcPrompt: "consent",
        access_type: "offline",
      };

      let res;
      if (isConnectedToGoogle) {
        res = await account?.reauthorize(params);
      } else {
        res = await user?.createExternalAccount({
          ...params,
          strategy: "oauth_google",
        });
      }

      if (res?.verification?.externalVerificationRedirectURL) {
        globalThis.location.href =
          res.verification.externalVerificationRedirectURL.href;
      }
    },
  );

  const authorizeWithEmailScope = useMutation({
    mutationFn: () => {
      return authorizeWithVerification();
    },
    onSuccess: () => {
      toast.success("Authorization successfull");
    },
    onError: (err) => {
      if (isClerkRuntimeError(err) && isReverificationCancelledError(err)) {
        console.error("User cancelled reverification");
        toast.error("Please verify to authorize with google.");
      } else {
        console.error("Reauthorization Error:", err);
        console.log("Reauthorization error details: ", (err as any).errors);
        toast.error("Could not authorize with google. Please try again later.");
      }
    },
  });

  return { authorizeWithEmailScope };
};
