import DateInput from "@/components/function/DateInput";
import { PropsWithValueOnChange } from "@/lib/types/commonTypes";

const StartDateInput = ({
  value,
  onChange,
}: PropsWithValueOnChange<string | undefined>) => {
  return (
    <DateInput
      value={value}
      onChange={(date) => onChange(date)}
      placeholder="Start Date"
    />
  );
};

export default StartDateInput;
