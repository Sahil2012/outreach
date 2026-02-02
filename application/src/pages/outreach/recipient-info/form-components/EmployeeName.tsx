import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormComponentProps } from "../RecipientForm";

const EmployeeName = ({
  value,
  onChange,
  error,
}: FormComponentProps<string | string[]>) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="contact-name">Employee Name</Label>
      <Input
        id="contact-name"
        placeholder="e.g. John Smith"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={error ? "border-destructive" : ""}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};

export default EmployeeName;
