import { Input } from "@/components/ui/input";
import { FormControlProps } from "@/lib/types/commonTypes";

const GradeInput = ({
  value,
  onChange,
}: FormControlProps<string | undefined>) => {
  return (
    <Input
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Grade / GPA"
    />
  );
};

export default GradeInput;
