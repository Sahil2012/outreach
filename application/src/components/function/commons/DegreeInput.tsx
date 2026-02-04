import { Input } from "@/components/ui/input";
import { PropsWithValueOnChange } from "@/lib/types/commons";

const DegreeInput = ({ value, onChange }: PropsWithValueOnChange<string>) => {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Degree"
    />
  );
};

export default DegreeInput;
