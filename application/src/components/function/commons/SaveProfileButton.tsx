import { useProfileActions } from "@/api/profile/hooks/useProfileActions";
import { Profile } from "@/api/profile/types";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Save } from "lucide-react";

interface SaveProfileButtonProps extends ButtonProps {
  profile: Partial<Profile>;
  hasChanges: () => boolean;
}

const SaveProfileButton = ({
  profile,
  hasChanges,
  className,
  ...rest
}: SaveProfileButtonProps) => {
  const { updateProfile } = useProfileActions();

  const handleSave = () => {
    updateProfile.mutate(profile);
  };

  return (
    <Button
      onClick={() => handleSave()}
      disabled={!hasChanges() || updateProfile.isPending}
      className={cn("rounded-full shadow-lg shadow-primary/20", className)}
      {...rest}
    >
      <Save className="w-4 h-4 mr-2" />
      {updateProfile.isPending ? "Saving..." : "Save Changes"}
    </Button>
  );
};

export default SaveProfileButton;
