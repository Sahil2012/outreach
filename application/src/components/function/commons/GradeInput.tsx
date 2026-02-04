import { Input } from "@/components/ui/input";
import { PropsWithValueOnChange } from "@/lib/types/commons";

const GradeInput = ({
  value,
  onChange,
}: PropsWithValueOnChange<string | undefined>) => {
  return (
    <Input
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Grade / GPA"
    />
  );
};

export default GradeInput;
