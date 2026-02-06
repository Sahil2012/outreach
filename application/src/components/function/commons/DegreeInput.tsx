import { Input } from "@/components/ui/input";
import { FormControlProps } from "@/lib/types/commonTypes";

const DegreeInput = ({ value, onChange }: FormControlProps<string>) => {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Degree"
    />
  );
};

export default DegreeInput;
