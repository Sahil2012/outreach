import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PropsWithValueOnChange } from "@/lib/types/commonTypes";

const NewPassword = ({ value, onChange }: PropsWithValueOnChange<string>) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="newPassword">New Password</Label>
      <Input
        id="newPassword"
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter new password"
      />
    </div>
  );
};

export default NewPassword;
