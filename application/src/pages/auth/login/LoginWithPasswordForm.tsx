import EmailInput from "@/components/function/commons/EmailInput";
import PasswordInput from "@/components/function/commons/PasswordInput";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { useAuthActions } from "@/hooks/auth/useAuthActions";
import { useState } from "react";
import ForgotPassword from "./ForgotPassword";

const LoginWithPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signInWithPassword, signInWithGoogle } = useAuthActions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    signInWithPassword.mutate({ email, password });
  };

  const isLoading = signInWithPassword.isPending || signInWithGoogle.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* {error && (
        <div className="bg-destructive/10 text-destructive text-sm px-5 p-3 rounded-3xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )} */}
      <EmailInput value={email} onChange={(value) => setEmail(value)} />
      <PasswordInput
        value={password}
        onChange={(value) => setPassword(value)}
      />
      <ForgotPassword />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader className="w-4 h-4 mr-2" />}
        Sign In
      </Button>
    </form>
  );
};

export default LoginWithPasswordForm;
