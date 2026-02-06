import { Input } from "@/components/ui/input";
import { FormControlProps } from "@/lib/types/commonTypes";

const RoleInput = ({ value, onChange }: FormControlProps<string>) => {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Job Title"
      className="font-medium"
    />
  );
};

export default RoleInput;
