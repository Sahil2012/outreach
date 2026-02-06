import { Input } from "@/components/ui/input";
import { FormControlProps } from "@/lib/types/commonTypes";

const FieldOfStudyInput = ({
  value,
  onChange,
}: FormControlProps<string | undefined>) => {
  return (
    <Input
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Field of Study"
    />
  );
};

export default FieldOfStudyInput;
