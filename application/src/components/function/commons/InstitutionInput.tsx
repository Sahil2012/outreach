import { Input } from "@/components/ui/input";
import { FormControlProps } from "@/lib/types/commonTypes";

const InstitutionInput = ({
  value,
  onChange,
}: FormControlProps<string>) => {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Institution Name"
      className="font-medium"
    />
  );
};

export default InstitutionInput;
