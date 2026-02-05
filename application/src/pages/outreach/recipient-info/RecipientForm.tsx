import React, { FC } from "react";
import { FormData, FormDataErrors } from ".";
import CompanyName from "./form-components/CompanyName";
import EmployeeEmail from "./form-components/EmployeeEmail";
import EmployeeName from "./form-components/EmployeeName";
import JobDescription from "./form-components/JobDescription";
import JobIds from "./form-components/JobIds";
import Role from "./form-components/Role";

export interface RecipientInfo {
  employeeName: string;
  employeeEmail: string;
  companyName: string;
  role: string;
  jobIds: string[];
  jobDescription: string;
}

export interface FormComponentProps<T> {
  value?: T;
  onChange: (value: T) => void;
  error?: string;
  className?: string;
}

interface FormControl<T> extends FormComponentProps<T> {
  comp: FC<FormComponentProps<T>>;
  hidden?: boolean;
}

interface RecipientFormProps {
  formData: FormData;
  onChange: (formData: FormData) => void;
  templateType: string;
  errors: FormDataErrors;
}

export const RecipientForm: React.FC<RecipientFormProps> = ({
  formData,
  onChange,
  templateType,
  errors,
}) => {
  const formControls: FormControl<string | string[]>[] = [
    {
      comp: EmployeeName,
      value: formData.employeeName,
      onChange: (employeeName) => handleChange("employeeName", employeeName),
      error: errors?.employeeName,
    },
    {
      comp: EmployeeEmail,
      value: formData.employeeEmail,
      onChange: (employeeEmail) => handleChange("employeeEmail", employeeEmail),
      error: errors?.employeeEmail,
    },
    {
      comp: CompanyName,
      value: formData.companyName,
      onChange: (companyName) => handleChange("companyName", companyName),
      error: errors?.companyName,
    },
    {
      comp: Role,
      value: formData.role,
      onChange: (role) => handleChange("role", role),
    },
    {
      comp: JobIds,
      value: formData.jobIds,
      onChange: (jobIds) => handleChange("jobIds", jobIds),
      className: "col-span-1 md:col-span-2",
      hidden: templateType === "COLD",
    },
    {
      comp: JobDescription,
      value: formData.jobDescription,
      onChange: (jobDescription) =>
        handleChange("jobDescription", jobDescription),
      className: "col-span-1 md:col-span-2",
      hidden: templateType === "COLD",
    },
  ];

  const handleChange = (
    field: keyof RecipientInfo,
    value: string | string[],
  ) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {formControls
          .filter(({ hidden }) => !hidden)
          .map((formControl) => (
            <formControl.comp
              value={formControl.value}
              onChange={formControl.onChange}
              className={formControl.className}
            />
          ))}
      </div>
    </div>
  );
};
