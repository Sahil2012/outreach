import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormControlProps } from "@/lib/types/commonTypes";

const EmailInput = ({ value, onChange }: FormControlProps<string>) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="email" className="text-sm font-medium">
        Email
      </Label>
      <Input
        id="email"
        type="email"
        placeholder="john@example.com"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
};

export default EmailInput;
