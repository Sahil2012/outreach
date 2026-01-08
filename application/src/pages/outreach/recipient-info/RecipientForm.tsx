import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RecipientInfo } from "@/lib/types";
import { Plus, X } from "lucide-react";

interface RecipientFormProps {
  info: RecipientInfo;
  onChange: (info: RecipientInfo) => void;
  errors?: Partial<Record<keyof RecipientInfo, string>>;
  templateId?: string | null;
}

export const RecipientForm: React.FC<RecipientFormProps> = ({
  info,
  onChange,
  errors,
  templateId,
}) => {
  const [currentJobId, setCurrentJobId] = useState("");

  const handleChange = (field: keyof RecipientInfo, value: string) => {
    onChange({ ...info, [field]: value });
  };

  const handleAddJobId = () => {
    if (currentJobId.trim() && !info.jobIds.includes(currentJobId.trim())) {
      onChange({ ...info, jobIds: [...info.jobIds, currentJobId.trim()] });
      setCurrentJobId("");
    }
  };

  const handleRemoveJobId = (jobIdToRemove: string) => {
    onChange({
      ...info,
      jobIds: info.jobIds.filter((id) => id !== jobIdToRemove),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddJobId();
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Employee Name</Label>
          <Input
            id="contact-name"
            placeholder="e.g. John Smith"
            value={info.employeeName}
            onChange={(e) => handleChange("employeeName", e.target.value)}
            className={errors?.employeeName ? "border-destructive" : ""}
          />
          {errors?.employeeName && (
            <p className="text-xs text-destructive">{errors.employeeName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="employee-email">Employee Email</Label>
          <Input
            id="employee-email"
            placeholder="e.g. john.smith@company.com"
            type="email"
            value={info.employeeEmail}
            onChange={(e) => handleChange("employeeEmail", e.target.value)}
            className={errors?.employeeEmail ? "border-destructive" : ""}
          />
          {errors?.employeeEmail && (
            <p className="text-xs text-destructive">{errors.employeeEmail}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="company-name">Company Name</Label>
          <Input
            id="company-name"
            placeholder="e.g. Acme Corporation"
            value={info.companyName}
            onChange={(e) => handleChange("companyName", e.target.value)}
            className={errors?.companyName ? "border-destructive" : ""}
          />
          {errors?.companyName && (
            <p className="text-xs text-destructive">{errors.companyName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Input
            id="role"
            placeholder="e.g. Software Engineer"
            value={info.role || ""}
            onChange={(e) => handleChange("role", e.target.value)}
          />
        </div>
      </div>

      {templateId !== "COLD" && (
        <div className="space-y-2">
          <Label htmlFor="job-ids">Job IDs</Label>
          <div className="flex gap-2">
            <Input
              id="job-ids"
              value={currentJobId}
              onChange={(e) => setCurrentJobId(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a job ID and press Enter..."
              className="flex-1"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddJobId}
              disabled={!currentJobId.trim()}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {info.jobIds.map((jobId, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="px-3 py-1 text-sm font-medium flex items-center gap-1"
              >
                {jobId}
                <button
                  type="button"
                  onClick={() => handleRemoveJobId(jobId)}
                  className="ml-1 hover:text-destructive focus:outline-none"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            {info.jobIds.length === 0 && (
              <p className="text-sm text-muted-foreground pl-2">
                No job IDs added yet.
              </p>
            )}
          </div>
        </div>
      )}

      {templateId !== "COLD" && (
        <div className="space-y-2">
          <Label htmlFor="job-description">Job Description</Label>
          <Textarea
            id="job-description"
            placeholder="Paste the job description here..."
            rows={6}
            value={info.jobDescription || ""}
            onChange={(e) => handleChange("jobDescription", e.target.value)}
            className={`resize-none ${
              errors?.jobDescription ? "border-destructive" : ""
            }`}
          />
          {errors?.jobDescription && (
            <p className="text-xs text-destructive">{errors.jobDescription}</p>
          )}
        </div>
      )}
    </div>
  );
};
