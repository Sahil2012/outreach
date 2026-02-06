import { Button, ButtonProps } from "@/components/ui/button";
import GoogleIcon from "./GoogleIcon";
import { Loader } from "@/components/ui/loader";
import { cn } from "@/lib/utils";
import { useAuthActions } from "@/hooks/auth/useAuthActions";

const SigninWithGoogle = ({ className, ...buttonProps }: ButtonProps) => {
  const { signInWithGoogle, startSignUpWithPassword, signInWithPassword } =
    useAuthActions();

  const handleGoogleSignIn = () => {
    signInWithGoogle.mutate();
  };

  const isLoading =
    signInWithGoogle.isPending ||
    signInWithPassword.isPending ||
    startSignUpWithPassword.isPending;

  return (
    <Button
      variant="outline"
      type="button"
      className={cn("w-full", className)}
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      {...buttonProps}
    >
      {signInWithGoogle.isPending ? (
        <Loader className="w-4 h-4 mr-2" />
      ) : (
        <GoogleIcon />
      )}
      Sign in with Google
    </Button>
  );
};

export default SigninWithGoogle;
