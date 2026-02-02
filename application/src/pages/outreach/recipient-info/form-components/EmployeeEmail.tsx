import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormComponentProps } from "../RecipientForm";

const EmployeeEmail = ({
  value,
  onChange,
  error,
}: FormComponentProps<string | string[]>) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="employee-email">Employee Email</Label>
      <Input
        id="employee-email"
        placeholder="e.g. john.smith@company.com"
        type="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={error ? "border-destructive" : ""}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};

export default EmployeeEmail;
