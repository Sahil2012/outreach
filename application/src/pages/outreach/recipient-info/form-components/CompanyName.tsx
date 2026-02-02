import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormComponentProps } from "../RecipientForm";

const CompanyName = ({
  value,
  onChange,
  error,
}: FormComponentProps<string | string[]>) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="company-name">Company Name</Label>
      <Input
        id="company-name"
        placeholder="e.g. Acme Corporation"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={error ? "border-destructive" : ""}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};

export default CompanyName;
