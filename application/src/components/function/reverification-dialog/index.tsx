import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";

import { useAuthActions } from "@/hooks/auth/useAuthActions";
import ReverificationForm from "./reverification-form";

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
  const { verification } = useAuthActions();
  const [code, setCode] = useState("");

  // Start verification when dialog opens
  useEffect(() => {
    if (open && !verification.isSendingCode && !verification.isVerifying) {
      verification.start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, verification.isSendingCode, verification.isVerifying]);

  const handleCancel = () => {
    setCode("");
    verification.cancel();
    onCancel();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleCancel()}>
      <DialogContent className="sm:max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle>Verify Your Identity</DialogTitle>
          <DialogDescription>
            {verification.userEmailForCode
              ? `We sent a verification code to ${verification.userEmailForCode}`
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
