import React, { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { useOutreach } from "@/hooks/useOutreach";
import { RecipientInfo } from "@/lib/types";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { RecipientForm } from "./RecipientForm";
import { Loader } from "@/components/ui/loader";
import { templates } from "../template-selection";
import { CreditInfo } from "@/components/function/CreditInfo";

const RecipientInfoPage: React.FC = () => {
  const { generateEmail, isGenerating } = useOutreach();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  // TODO: change templateId to type
  const templateId = searchParams.get("templateId");

  const [recipientInfo, setRecipientInfo] = useState<RecipientInfo>({
    employeeName: "",
    employeeEmail: "",
    companyName: "",
    role: "",
    jobIds: [],
    jobDescription: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof RecipientInfo, string>>
  >({});

  useEffect(() => {
    const { company, employee } = location.state || {};
    if (company) {
      setRecipientInfo((prev) => ({
        ...prev,
        companyName: company.name,
      }));
    }
    if (employee) {
      setRecipientInfo((prev) => ({
        ...prev,
        employeeName: employee.name,
        employeeEmail: employee.email || "",
      }));
    }
  }, [location.state]);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof RecipientInfo, string>> = {};
    if (!recipientInfo.employeeName)
      newErrors.employeeName = "Employee name is required";
    if (!recipientInfo.employeeEmail)
      newErrors.employeeEmail = "Employee email is required";
    if (!recipientInfo.companyName)
      newErrors.companyName = "Company name is required";
    if (templateId !== "COLD" && !recipientInfo.jobIds.length)
      newErrors.jobIds = "At least one job is required for tailored messages";
    // Job description is only required for non-COLD templates
    if (templateId !== "COLD" && !recipientInfo.jobDescription)
      newErrors.jobDescription = "Job description is required";

    setErrors(newErrors);
    return newErrors;
  };

  const handleGenerate = async () => {
    const fnErrors = validateForm();
    if (Object.keys(fnErrors).length > 0) {
      toast.error(Object.values(fnErrors)[0]);
      return;
    }

    if (!templateId) {
      toast.error("Template ID is missing. Please start over.");
      return;
    }

    try {
      const res = await generateEmail({
        companyName: recipientInfo.companyName,
        contactEmail: recipientInfo.employeeEmail,
        contactName: recipientInfo.employeeName,
        role: recipientInfo.role,
        jobs: recipientInfo.jobIds,
        jobDescription: recipientInfo.jobDescription || "",
        type: templateId,
      });

      navigate(`/outreach/preview/${res?.messageId}`, { state: res });
    } catch (error: Error | unknown) {
      if (isAxiosError(error)) {
        if (error.response?.status === 429) {
          toast.error("You have reached the limit. Please try again later.");
          return;
        }
        if (error.response?.status === 500) {
          toast.error("Server error. Please try again in 5 minutes.");
          return;
        }
      }
      console.error("Error generating mail:", error);
      toast.error("Failed to generate email. Please try again.");
    }
  };

  useEffect(() => {
    if (!templateId || !templates.some((t) => t.id === templateId)) {
      toast.error("Template ID is missing. Please start over.");
      navigate("/outreach/templates");
    }
  }, [navigate, templateId]);

  if (!templateId || !templates.some((t) => t.id === templateId)) {
    return null;
  }

  return (
    <div className="animate-fadeIn space-y-6">
      <RecipientForm
        info={recipientInfo}
        onChange={setRecipientInfo}
        errors={errors}
        templateId={templateId}
      />

      <div className="flex items-end justify-between pt-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => navigate("/outreach/templates")}
          disabled={isGenerating}
        >
          <ArrowLeft className="w-4 h-4 mr-1 -ml-1" />
          Back
        </Button>
        <div className="flex flex-col gap-1.5">
          <CreditInfo className="mt-4" />
          <Button size="lg" onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? <Loader className="mr-2" /> : null}
            {isGenerating ? "Generating..." : "Generate Email"}
            {!isGenerating && <ArrowRight className="w-4 h-4 ml-1 -mr-1" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecipientInfoPage;
