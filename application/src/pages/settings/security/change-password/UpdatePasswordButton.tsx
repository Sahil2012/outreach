import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { Save } from "lucide-react";

interface UpdatePasswordButtonProps {
  disabled: boolean;
  isLoading: boolean;
}

const UpdatePasswordButton = ({
  disabled,
  isLoading,
}: UpdatePasswordButtonProps) => {
  return (
    <>
      <Button type="submit" disabled={disabled || isLoading}>
        {isLoading ? (
          <Loader className="mr-2 text-white" />
        ) : (
          <Save className="mr-2 w-5 h-5" />
        )}
        {isLoading ? "Updating..." : "Update Password"}
      </Button>
    </>
  );
};

export default UpdatePasswordButton;
