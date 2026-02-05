import { useProfile } from "@/hooks/profile/useProfileData";
import { Coins } from "lucide-react";
import React from "react";

interface CreditInfoProps {
  className?: string;
}

export const CreditInfo: React.FC<CreditInfoProps> = ({ className = "" }) => {
  const { data: profile, isLoading } = useProfile();

  if (isLoading || !profile) {
    return null;
  }

  const credits = profile.credits ?? 0;

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Coins className="w-4 h-4 text-primary" />
      <div className="flex gap-1">
        <span className="text-xs font-semibold text-foreground">{credits}</span>
        <span className="text-xs text-muted-foreground font-medium">
          credits remaining
        </span>
      </div>
    </div>
  );
};
