import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";

import ReverificationForm from "./reverification-form";
import { useReverificationActions } from "@/hooks/auth/useReverificationActions";

interface ReverificationDialogProps {
  open: boolean;
  onComplete: () => void;
  onCancel: () => void;
}

export const ReverificationDialog = ({
  open,
  onComplete,
  onCancel,
}: ReverificationDialogProps) => {
  const { sendCode, verify } = useReverificationActions();
  const [code, setCode] = useState("");
  const [emailForCode, setEmailForCode] = useState("");

  // Start verification when dialog opens
  useEffect(() => {
    if (open && !sendCode.isPending && !verify.isPending) {
      sendCode.mutate(undefined, {
        onSuccess: ({ emailForCode }) => setEmailForCode(emailForCode),
      });
    }
  }, [open, sendCode, verify]);

  const handleCancel = () => {
    setCode("");
    sendCode.reset();
    onCancel();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleCancel()}>
      <DialogContent className="sm:max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle>Verify Your Identity</DialogTitle>
          <DialogDescription>
            {emailForCode
              ? `We sent a verification code to ${emailForCode}`
              : "We sent a verification code to your email. Please enter it below to continue."}
          </DialogDescription>
        </DialogHeader>
        <ReverificationForm
          code={code}
          onChangeCode={(code) => setCode(code)}
          onComplete={onComplete}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};
