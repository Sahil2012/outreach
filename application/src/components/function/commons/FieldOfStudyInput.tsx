import { Input } from "@/components/ui/input";
import { PropsWithValueOnChange } from "@/lib/types/commons";

const FieldOfStudyInput = ({
  value,
  onChange,
}: PropsWithValueOnChange<string | undefined>) => {
  return (
    <Input
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Field of Study"
    />
  );
};

export default FieldOfStudyInput;
