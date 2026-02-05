import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@clerk/clerk-react";
import { Lock } from "lucide-react";
import ChangePassword from "./change-password";

const Security = () => {
  const { user } = useUser();

  return (
    <Card>
      <CardHeader className="border-b border-border/40 px-6 py-6">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-primary" />
          <CardTitle>Security</CardTitle>
        </div>
        <CardDescription>
          {user?.passwordEnabled
            ? "Change your password"
            : "Set a password for your account"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <ChangePassword />
      </CardContent>
    </Card>
  );
};

export default Security;
