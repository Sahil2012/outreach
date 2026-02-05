import { useAuthActions } from "@/api/auth/hooks/useAuthActions";
import { ReverificationDialog } from "@/components/function/reverification-dialog";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";

interface UpdatePasswordButtonProps {
  disabled: boolean;
}

const UpdatePasswordButton = ({ disabled }: UpdatePasswordButtonProps) => {
  const { updatePassword } = useAuthActions();
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (updatePassword.isVerificationNeeded) {
      setShowDialog(true);
    }
  }, [updatePassword.isVerificationNeeded]);

  return (
    <>
      <Button type="submit" disabled={disabled || updatePassword.isLoading}>
        {updatePassword.isLoading ? (
          <Loader className="mr-2 text-white" />
        ) : (
          <Save className="mr-2 w-5 h-5" />
        )}
        {updatePassword.isLoading ? "Updating..." : "Update Password"}
      </Button>

      <ReverificationDialog
        open={showDialog}
        onComplete={() => {
          updatePassword.completeReverification?.();
          setShowDialog(false);
        }}
        onCancel={() => {
          updatePassword.cancelReverification?.();
          setShowDialog(false);
        }}
      />
    </>
  );
};

export default UpdatePasswordButton;
