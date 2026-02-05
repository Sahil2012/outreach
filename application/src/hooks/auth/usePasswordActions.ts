import { useHandleReverification } from "@/providers/ReverificationProvider";
import { useUser } from "@clerk/clerk-react";
import {
  isClerkRuntimeError,
  isReverificationCancelledError,
} from "@clerk/clerk-react/errors";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface UpdatePasswordVariables {
  newPassword: string;
  currentPassword?: string;
}

export const usePasswordActions = () => {
  const { user } = useUser();

  const { func: updatePasswordWithVerification } = useHandleReverification(
    async ({ newPassword, currentPassword }: UpdatePasswordVariables) => {
      if (user?.passwordEnabled) {
        await user.updatePassword({ currentPassword, newPassword });
      } else {
        await user?.updatePassword({ newPassword });
      }
    },
  );

  const updatePassword = useMutation({
    mutationFn: (vars: UpdatePasswordVariables) => {
      return updatePasswordWithVerification(vars);
    },
    onMutate: () => {
      return user?.passwordEnabled;
    },
    onSuccess: (_, __, userHadPassword) => {
      if (userHadPassword) {
        toast.success("Password updated successfully");
      } else {
        toast.success("Password set successfully");
      }
    },
    onError: (err) => {
      if (isClerkRuntimeError(err) && isReverificationCancelledError(err)) {
        console.error("User cancelled reverification");
        toast.error("Please verify to update your password.");
      } else {
        console.error("Update password Error:", err);
        console.log("Update password error details: ", (err as any).errors);
        toast.error("Could not update password.");
      }
    },
  });

  return {
    updatePassword,
  };
};
