import { Input } from "@/components/ui/input";
import { PropsWithValueOnChange } from "@/lib/types/commonTypes";

const CompanyInput = ({ value, onChange }: PropsWithValueOnChange<string>) => {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Company Name"
    />
  );
};

export default CompanyInput;
