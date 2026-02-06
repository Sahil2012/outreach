import SigninWithGoogle from "@/components/function/signin-with-google-button";
import AuthLayout from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useAuthActions } from "@/hooks/auth/useAuthActions";
import { useState } from "react";
import { Link } from "react-router";
import AuthOptionsDivider from "../AuthOptionsDivider";
import SignupWithPasswordForm from "./SignupWithPasswordForm";
import VerifySignUpCodeForm from "./VerifySignUpCodeForm";

export default function SignupPage() {
  const [pendingVerification, setPendingVerification] = useState(false);
  const { startSignUpWithPassword } = useAuthActions();

  if (pendingVerification) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle={`We sent a verification code to ${startSignUpWithPassword.variables?.email}`}
      >
        <Card>
          <CardContent className="pt-6 pb-6">
            <VerifySignUpCodeForm />
          </CardContent>
          <CardFooter className="flex justify-center border-t border-border !pt-4 pb-4">
            <Button
              variant="link"
              onClick={() => setPendingVerification(false)}
              className="text-sm text-muted-foreground"
            >
              Back to sign up
            </Button>
          </CardFooter>
        </Card>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Enter your email below to create your account"
    >
      <Card>
        <CardContent className="pt-8 px-8">
          <SignupWithPasswordForm
            onChangePendingVerification={(val: boolean) =>
              setPendingVerification(val)
            }
          />
          <AuthOptionsDivider />
          <SigninWithGoogle />
        </CardContent>
        <CardFooter className="flex justify-center border-t border-border/40 pt-6 pb-6 bg-muted/10 rounded-b-3xl">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-semibold hover:underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}
