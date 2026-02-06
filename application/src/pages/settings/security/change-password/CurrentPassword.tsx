import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormControlProps } from "@/lib/types/commonTypes";

const CurrentPassword = ({
  value,
  onChange,
}: FormControlProps<string>) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="currentPassword">Current Password</Label>
      <Input
        id="currentPassword"
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter current password"
      />
    </div>
  );
};

export default CurrentPassword;
