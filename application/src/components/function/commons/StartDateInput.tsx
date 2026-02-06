import DateInput from "@/components/function/DateInput";
import { FormControlProps } from "@/lib/types/commonTypes";

const StartDateInput = ({
  value,
  onChange,
}: FormControlProps<string | undefined>) => {
  return (
    <DateInput
      value={value}
      onChange={(date) => onChange(date)}
      placeholder="Start Date"
    />
  );
};

export default StartDateInput;
