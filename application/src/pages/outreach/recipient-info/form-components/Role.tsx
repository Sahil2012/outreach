import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormComponentProps } from "../RecipientForm";

const Role = ({ value, onChange }: FormComponentProps<string | string[]>) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="role">Role</Label>
      <Input
        id="role"
        placeholder="e.g. Software Engineer"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default Role;
