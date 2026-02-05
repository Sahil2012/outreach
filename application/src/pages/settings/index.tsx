import { Loader } from "@/components/ui/loader";
import { useUser } from "@clerk/clerk-react";
import BillingInfo from "./billing-info";
import Security from "./security";

export default function SettingsPage() {
  const { isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader size="lg" text="Loading settings..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your account security and billing preferences
        </p>
      </div>

      <div className="grid gap-8">
        <Security />
        <BillingInfo />
      </div>
    </div>
  );
}
