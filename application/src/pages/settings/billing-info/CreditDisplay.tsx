import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { useProfile } from "@/hooks/profile/useProfileData";
import { AlertTriangle, Coins, Wallet } from "lucide-react";
import { toast } from "sonner";

interface CreditDisplayProps {
  onOpenChange: (open: boolean) => void;
}

const CreditDisplay = ({ onOpenChange }: CreditDisplayProps) => {
  const { data: profile, isLoading } = useProfile();

  return (
    <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
      <div className="flex items-start justify-between">
        <div className="">
          <div className="flex items-center gap-2 mb-3">
            <Wallet className="w-5 h-5 text-primary" />
            <p className="text-sm font-medium text-muted-foreground">
              Credits Available
            </p>
          </div>
          {isLoading ? (
            <Loader size="sm" />
          ) : (
            <div className="flex items-baseline gap-1">
              <h2 className="text-4xl font-bold text-foreground">
                {profile?.credits ?? 0}
              </h2>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-0.5">
            1 credit per email generation
          </p>
        </div>
        <Button
          onClick={() => {
            toast.info(
              "We are sorry. Currently, adding extra credits is not supported. Please contact support for assistance.",
            );
            // onOpenChange(true);
          }}
          className="rounded-full shadow-lg shadow-primary/20"
        >
          <Coins className="w-4 h-4 mr-2" />
          Recharge Credits
        </Button>
      </div>

      {/* Low Credit Warning */}
      {!isLoading && (profile?.credits ?? 0) < 5 && (
        <div className="mt-4 bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 text-sm p-3 rounded-lg flex items-center gap-2 border border-yellow-500/20">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            Your credit balance is low. Recharge now to continue sending emails.
          </span>
        </div>
      )}
    </div>
  );
};

export default CreditDisplay;
