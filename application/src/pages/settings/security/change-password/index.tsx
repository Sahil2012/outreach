import { useAuthActions } from "@/hooks/auth/useAuthActions";
import { useUser } from "@clerk/clerk-react";
import { AlertCircle } from "lucide-react";
import { FormEvent, useState } from "react";
import ConfirmNewPassword from "./ConfirmNewPassword";
import CurrentPassword from "./CurrentPassword";
import NewPassword from "./NewPassword";
import UpdatePasswordButton from "./UpdatePasswordButton";

const ChangePassword = () => {
  const { user } = useUser();
  const { updatePassword } = useAuthActions();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleFormSubmission = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updatePassword.update({
      newPassword,
      currentPassword,
      onSuccess: () => {
        setNewPassword("");
        setConfirmNewPassword("");
        setCurrentPassword("");
      },
    });
  };

  return (
    <>
      {updatePassword.error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {updatePassword.error.message}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleFormSubmission}>
        <div className="space-y-6 max-w-md">
          {user?.passwordEnabled && (
            <CurrentPassword
              value={currentPassword}
              onChange={(val) => setCurrentPassword(val)}
            />
          )}
          <NewPassword
            value={newPassword}
            onChange={(val) => setNewPassword(val)}
          />
          <ConfirmNewPassword
            value={confirmNewPassword}
            onChange={(val) => setConfirmNewPassword(val)}
          />
        </div>
        <div className="flex justify-end">
          <UpdatePasswordButton disabled={newPassword !== confirmNewPassword} />
        </div>
      </form>
    </>
  );
};

export default ChangePassword;
