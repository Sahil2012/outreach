import DateInput from "@/components/function/DateInput";
import { PropsWithValueOnChange } from "@/lib/types/commons";

const EndDateInput = ({
  value,
  onChange,
}: PropsWithValueOnChange<string | undefined>) => {
  return (
    <DateInput
      value={value}
      onChange={(date) => onChange(date)}
      placeholder="End Date"
    />
  );
};

export default EndDateInput;
