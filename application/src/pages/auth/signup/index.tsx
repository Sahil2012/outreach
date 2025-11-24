import { SignUp } from "@clerk/clerk-react";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <SignUp />
    </div>
  );
}
