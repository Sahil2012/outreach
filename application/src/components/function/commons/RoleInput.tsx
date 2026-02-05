import { Input } from "@/components/ui/input";
import { PropsWithValueOnChange } from "@/lib/types/commonTypes";

const RoleInput = ({ value, onChange }: PropsWithValueOnChange<string>) => {
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
