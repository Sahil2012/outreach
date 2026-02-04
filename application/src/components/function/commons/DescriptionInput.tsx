import { Textarea } from "@/components/ui/textarea";
import { PropsWithValueOnChange } from "@/lib/types/commons";

const DescriptionInput = ({
  value,
  onChange,
}: PropsWithValueOnChange<string>) => {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Describe your role and responsibilities..."
      rows={2}
      className="resize-none bg-muted/30"
    />
  );
};

export default DescriptionInput;
