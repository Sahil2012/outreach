import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormControlProps } from "@/lib/types/commonTypes";

const PasswordInput = ({ value, onChange }: FormControlProps<string>) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="password" className="text-sm font-medium">
        Password
      </Label>
      <Input
        id="password"
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
};

export default PasswordInput;
