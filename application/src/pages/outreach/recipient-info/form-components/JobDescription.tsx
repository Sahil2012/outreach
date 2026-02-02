import { Label } from "@/components/ui/label";
import { FormComponentProps } from "../RecipientForm";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const JobDescription = ({
  value,
  onChange,
  error,
  className,
}: FormComponentProps<string | string[]>) => {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor="job-description">Job Description</Label>
      <Textarea
        id="job-description"
        placeholder="Paste the job description here..."
        rows={6}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className={`resize-none ${error ? "border-destructive" : ""}`}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};

export default JobDescription;
