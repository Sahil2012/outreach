import SigninWithGoogle from "@/components/function/signin-with-google-button";
import AuthLayout from "@/components/layout/AuthLayout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "react-router";
import AuthOptionsDivider from "../AuthOptionsDivider";
import LoginWithPasswordForm from "./LoginWithPasswordForm";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Enter your email to sign in to your account"
    >
      <Card>
        <CardContent className="pt-8 px-8">
          <LoginWithPasswordForm />
          <AuthOptionsDivider />
          <SigninWithGoogle />
        </CardContent>
        <CardFooter className="flex justify-center border-border/40 pt-6 pb-6 bg-muted/10 rounded-b-3xl">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-primary font-semibold hover:underline underline-offset-4"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}
