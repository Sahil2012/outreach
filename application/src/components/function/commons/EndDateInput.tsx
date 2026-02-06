import DateInput from "@/components/function/DateInput";
import { FormControlProps } from "@/lib/types/commonTypes";

const EndDateInput = ({
  value,
  onChange,
}: FormControlProps<string | undefined>) => {
  return (
    <DateInput
      value={value}
      onChange={(date) => onChange(date)}
      placeholder="End Date"
    />
  );
};

export default EndDateInput;
