import { Input } from "@/components/ui/input";
import { FormControlProps } from "@/lib/types/commonTypes";

const CompanyInput = ({ value, onChange }: FormControlProps<string>) => {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Company Name"
    />
  );
};

export default CompanyInput;
