import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { useReverificationActions } from "@/hooks/auth/useReverificationActions";
import { AlertCircle } from "lucide-react";
import React from "react";
import OTPInput from "../../commons/OTPInput";

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
  const { sendCode, verify } = useReverificationActions();

  const handleVerify = async (e?: React.FormEvent) => {
    e?.preventDefault();
    verify.mutate(
      { code },
      {
        onSuccess: () => {
          onChangeCode("");
          onComplete();
        },
      },
    );
  };

  const handleResend = async () => {
    onChangeCode("");
    verify.reset();
    sendCode.mutate();
  };

  const isLoading = sendCode.isPending || verify.isPending;

  return (
    <form onSubmit={handleVerify} className="space-y-6">
      {(sendCode.error || verify.error) && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {sendCode.error?.message || verify.error?.message || ""}
        </div>
      )}

      <div className="flex justify-center py-2">
        <OTPInput
          value={code}
          onChange={(code) => onChangeCode(code)}
          disabled={isLoading}
        />
      </div>
      <div className="flex flex-col gap-3">
        <Button
          type="submit"
          className="w-full h-10 font-medium"
          disabled={isLoading || code.length !== 6}
        >
          {sendCode.isPending && <Loader className="w-4 h-4 mr-2" />}
          Verify
        </Button>

        <div className="flex items-center justify-between text-sm mt-3">
          <Button
            type="button"
            variant="link"
            onClick={onCancel}
            disabled={isLoading}
            className="text-muted-foreground p-0 h-auto"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="link"
            onClick={handleResend}
            disabled={isLoading}
            className="text-primary p-0 h-auto font-semibold"
          >
            {sendCode.isPending && <Loader className="w-3 h-3 mr-1" />}
            Resend code
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ReverificationForm;
