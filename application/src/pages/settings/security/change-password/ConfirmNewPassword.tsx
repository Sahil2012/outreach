import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PropsWithValueOnChange } from "@/lib/types/commonTypes";

const ConfirmNewPassword = ({
  value,
  onChange,
}: PropsWithValueOnChange<string>) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="confirmPassword">Confirm Password</Label>
      <Input
        id="confirmPassword"
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Confirm new password"
      />
    </div>
  );
};

export default ConfirmNewPassword;
