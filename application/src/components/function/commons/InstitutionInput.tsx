import { Input } from "@/components/ui/input";
import { PropsWithValueOnChange } from "@/lib/types/commonTypes";

const InstitutionInput = ({
  value,
  onChange,
}: PropsWithValueOnChange<string>) => {
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
