import { useAuthActions } from "@/api/auth/hooks/useAuthActions";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { AlertCircle } from "lucide-react";
import React from "react";
import ReverificationOTP from "./ReverificationOTP";

interface ReverificationFormProps {
  code: string;
  onChangeCode: (code: string) => void;
  onComplete: () => void;
  onCancel: () => void;
}

const ReverificationForm = ({
  code,
  onChangeCode,
  onComplete,
  onCancel,
}: ReverificationFormProps) => {
  const { verification } = useAuthActions();

  const handleVerify = async (e?: React.FormEvent) => {
    e?.preventDefault();
    verification.verify(code, () => {
      onChangeCode("");
      onComplete();
    });
  };

  const handleResend = async () => {
    onChangeCode("");
    verification.resendCode();
  };

  return (
    <form onSubmit={handleVerify} className="space-y-6">
      {verification.error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {verification.error.message}
        </div>
      )}

      <div className="flex justify-center py-2">
        <ReverificationOTP
          code={code}
          onChange={(code) => onChangeCode(code)}
        />
      </div>
      <div className="flex flex-col gap-3">
        <Button
          type="submit"
          className="w-full h-10 font-medium"
          disabled={
            verification.isVerifying ||
            verification.isSendingCode ||
            code.length !== 6
          }
        >
          {verification.isVerifying && <Loader className="w-4 h-4 mr-2" />}
          Verify
        </Button>

        <div className="flex items-center justify-between text-sm mt-3">
          <Button
            type="button"
            variant="link"
            onClick={onCancel}
            disabled={verification.isVerifying || verification.isSendingCode}
            className="text-muted-foreground p-0 h-auto"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="link"
            onClick={handleResend}
            disabled={verification.isVerifying || verification.isSendingCode}
            className="text-primary p-0 h-auto font-semibold"
          >
            {verification.isSendingCode && <Loader className="w-3 h-3 mr-1" />}
            Resend code
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ReverificationForm;
