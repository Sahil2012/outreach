import OTPInput from "@/components/function/commons/OTPInput";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { useAuthActions } from "@/hooks/auth/useAuthActions";
import React, { useState } from "react";

const VerifySignUpCodeForm = () => {
  const [code, setCode] = useState("");
  const { verifySignUpWithCode } = useAuthActions();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    verifySignUpWithCode.mutate({ code });
  };

  return (
    <form onSubmit={handleVerify} className="space-y-6">
      {/* {error && (
        <div className="bg-destructive/10 text-destructive text-sm px-5 p-3 rounded-3xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )} */}
      <div className="flex justify-center">
        <OTPInput
          value={code}
          onChange={(code) => setCode(code)}
          disabled={verifySignUpWithCode.isPending}
        />
      </div>
      <Button
        type="submit"
        className="w-full h-10 font-medium"
        disabled={verifySignUpWithCode.isPending}
      >
        {verifySignUpWithCode.isPending && <Loader className="w-4 h-4 mr-2" />}
        Verify Email
      </Button>
    </form>
  );
};

export default VerifySignUpCodeForm;
