import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useOutreach } from "@/hooks/useOutreach";
import { RecipientInfo } from "@/lib/types";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { RecipientForm } from "./RecipientForm";
import { Loader } from "@/components/ui/loader";

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
    if (!recipientInfo.jobDescription)
      newErrors.jobDescription = "Job description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields.");
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

      navigate(`/outreach/preview/${res.messageId}`, { state: res });
    } catch (error) {
      console.error("Error generating mail:", error);
      toast.error("Failed to generate email. Please try again.");
    }
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <RecipientForm
        info={recipientInfo}
        onChange={setRecipientInfo}
        errors={errors}
      />

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => navigate("/outreach/templates")}
          disabled={isGenerating}
        >
          <ArrowLeft className="w-4 h-4 mr-1 -ml-1" />
          Back
        </Button>
        <Button size="lg" onClick={handleGenerate} disabled={isGenerating}>
          {isGenerating ? <Loader className="mr-2" /> : null}
          {isGenerating ? "Generating..." : "Generate Email"}
          {!isGenerating && <ArrowRight className="w-4 h-4 ml-1 -mr-1" />}
        </Button>
      </div>
    </div>
  );
};

export default RecipientInfoPage;
