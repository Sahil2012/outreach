import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useOutreachActions } from "@/hooks/useOutreachActions";
import { RecipientInfo } from "@/lib/types";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const RecipientInfoPage: React.FC = () => {
  const { generateEmail } = useOutreachActions();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("templateId");

  const [isLoading, setIsLoading] = useState(false);
  const [recipientInfo, setRecipientInfo] = useState<RecipientInfo>({
    employeeName: "",
    employeeEmail: "",
    companyName: "",
    jobId: "",
    jobDescription: "",
  });

  useEffect(() => {
    const { company, employee } = location.state || {};
    if (company) {
      setRecipientInfo(prev => ({
        ...prev,
        companyName: company.name,
      }));
    }
    if (employee) {
      setRecipientInfo(prev => ({
        ...prev,
        employeeName: employee.name,
        employeeEmail: employee.email || "",
      }));
    }
  }, [location.state]);

  const handleGenerate = async () => {
    try {
      if (!templateId) {
        toast.error("Template ID is missing. Please start over.");
        return;
      }

      const res = await generateEmail({
        employeeName: recipientInfo.contactName,
        employeeEmail: recipientInfo.userContact,
        companyName: recipientInfo.companyName,
        jobId: recipientInfo.jobIds[0],
        jobDescription: recipientInfo.jobDescription || "",
        templateId: templateId,
      });

      navigate(`/outreach/preview/${res.id}`);
    } catch (error) {
      console.error("Error generating mail:", error);
      toast.error("We are unable to reach our servers. Please try again later.");
    }
  };

  const isFormValid = () => {
    if (!recipientInfo.employeeName) {
      toast.error("Please enter the employee name.");
      return false;
    }

    if (!recipientInfo.employeeEmail) {
      toast.error("Please enter the employee email.");
      return false;
    }

    if (!recipientInfo.companyName) {
      toast.error("Please enter the company name.");
      return false;
    }

    if (!recipientInfo.jobDescription) {
      toast.error("Please enter the job description.");
      return false;
    }

    return true;
  };

  const handleContinue = async () => {
    if (!isFormValid()) {
      return;
    }
    setIsLoading(true);
    await handleGenerate();
    setIsLoading(false);
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Employee Name</Label>
          <Input
            id="contact-name"
            placeholder="e.g. John Smith"
            value={recipientInfo.employeeName}
            onChange={(e) =>
              setRecipientInfo({
                ...recipientInfo,
                employeeName: e.target.value,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="employee-email">Employee Email</Label>
          <Input
            id="employee-email"
            placeholder="e.g. john.smith@company.com"
            type="email"
            value={recipientInfo.employeeEmail}
            onChange={(e) =>
              setRecipientInfo({
                ...recipientInfo,
                employeeEmail: e.target.value,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company-name">Company Name</Label>
          <Input
            id="company-name"
            placeholder="e.g. Acme Corporation"
            value={recipientInfo.companyName}
            onChange={(e) =>
              setRecipientInfo({
                ...recipientInfo,
                companyName: e.target.value,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="job-id">Job ID (Optional)</Label>
          <Input
            id="job-id"
            placeholder="e.g. JOB-123456"
            value={recipientInfo.jobId || ""}
            onChange={(e) =>
              setRecipientInfo({
                ...recipientInfo,
                jobId: e.target.value,
              })
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="job-description">Job Description</Label>
        <Textarea
          id="job-description"
          placeholder="Paste the job description here..."
          rows={6}
          value={recipientInfo.jobDescription || ""}
          onChange={(e) =>
            setRecipientInfo({
              ...recipientInfo,
              jobDescription: e.target.value,
            })
          }
          className="resize-none"
        />
      </div>

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => navigate("/outreach/templates")}
          disabled={isLoading}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          size="lg"
          onClick={handleContinue}
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate Email"}
          {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
};

export default RecipientInfoPage;
