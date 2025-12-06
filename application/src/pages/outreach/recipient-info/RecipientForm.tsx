import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RecipientInfo } from "@/lib/types";

interface RecipientFormProps {
    info: RecipientInfo;
    onChange: (info: RecipientInfo) => void;
    errors?: Partial<Record<keyof RecipientInfo, string>>;
}

export const RecipientForm: React.FC<RecipientFormProps> = ({ info, onChange, errors }) => {
    const handleChange = (field: keyof RecipientInfo, value: string) => {
        onChange({ ...info, [field]: value });
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
                    {errors?.employeeName && <p className="text-xs text-destructive">{errors.employeeName}</p>}
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
                    {errors?.employeeEmail && <p className="text-xs text-destructive">{errors.employeeEmail}</p>}
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
                    {errors?.companyName && <p className="text-xs text-destructive">{errors.companyName}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="job-id">Job ID (Optional)</Label>
                    <Input
                        id="job-id"
                        placeholder="e.g. JOB-123456"
                        value={info.jobId || ""}
                        onChange={(e) => handleChange("jobId", e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="job-description">Job Description</Label>
                <Textarea
                    id="job-description"
                    placeholder="Paste the job description here..."
                    rows={6}
                    value={info.jobDescription || ""}
                    onChange={(e) => handleChange("jobDescription", e.target.value)}
                    className={`resize-none ${errors?.jobDescription ? "border-destructive" : ""}`}
                />
                 {errors?.jobDescription && <p className="text-xs text-destructive">{errors.jobDescription}</p>}
            </div>
        </div>
    );
};
