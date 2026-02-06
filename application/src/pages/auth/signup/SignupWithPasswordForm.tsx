import EmailInput from "@/components/function/commons/EmailInput";
import PasswordInput from "@/components/function/commons/PasswordInput";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { useAuthActions } from "@/hooks/auth/useAuthActions";
import React, { useState } from "react";

interface SignupWithPasswordFormProps {
  onChangePendingVerification: (val: boolean) => void;
}

const SignupWithPasswordForm = ({
  onChangePendingVerification,
}: SignupWithPasswordFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { startSignUpWithPassword } = useAuthActions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startSignUpWithPassword.mutate(
      { email, password },
      { onSuccess: () => onChangePendingVerification(true) },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )} */}
      <EmailInput value={email} onChange={(value) => setEmail(value)} />
      <PasswordInput
        value={password}
        onChange={(value) => setPassword(value)}
      />
      <Button
        type="submit"
        className="w-full"
        disabled={startSignUpWithPassword.isPending}
      >
        {startSignUpWithPassword.isPending && (
          <Loader className="w-4 h-4 mr-2" />
        )}
        Sign Up
      </Button>
    </form>
  );
};

export default SignupWithPasswordForm;
