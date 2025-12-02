import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useOutreach } from "../../../context/OutreachContext";
import { useAuth } from "../../../context/AuthContext";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Card, CardContent } from "../../../components/ui/card";
import { Textarea } from "../../../components/ui/textarea";
import { generateMail } from "../../../service/mailService";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const RecipientInfoPage: React.FC = () => {
  const { setStep, recipientInfo, setRecipientInfo, setGeneratedEmail, setIsLoading, selectedTemplate } =
    useOutreach();
  const { getToken } = useAuth();
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const { company, employee } = location.state || {};
    if (company) {
      setRecipientInfo((prev) => ({
        ...prev,
        companyName: company.name,
      }));
      setCompanyId(company.id);
    }
    if (employee) {
      setRecipientInfo((prev) => ({
        ...prev,
        contactName: employee.name,
      }));
      setEmployeeId(employee.id);
    }
  }, [location.state, setRecipientInfo]);

  const handleGenerate = async () => {
    try {
      const token = await getToken();
      let finalCompanyId = companyId;
      let finalEmployeeId = employeeId;

      // Get or create company
      if (!companyId) {
        const { data: companyData } = await axios.post(
          'http://localhost:3000/companies/get-or-create',
          { name: recipientInfo.companyName },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        finalCompanyId = companyData.id;
      }

      // Get or create employee
      if (!employeeId && finalCompanyId) {
        const { data: employeeData } = await axios.post(
          `http://localhost:3000/companies/${finalCompanyId}/employees/get-or-create`,
          { name: recipientInfo.contactName },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        finalEmployeeId = employeeData.id;
      }

      // Generate email
      const res = await generateMail({
        jobId: recipientInfo.jobIds.filter(Boolean), // Pass only valid job IDs
        hrName: recipientInfo.contactName,
        companyName: recipientInfo.companyName,
        jobDescription: recipientInfo.jobDescription,
      });
      setGeneratedEmail(res);

      // Create referral record
      if (finalCompanyId) {
        await axios.post(
          'http://localhost:3000/referrals',
          {
            company_id: finalCompanyId,
            employee_id: finalEmployeeId,
            template_type: selectedTemplate?.name || 'Custom',
            email_content: res.email.body,
            status: 'pending',
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (error) {
      console.error("Error generating mail:", error);
      navigate("/error");
    }
  };

  const handleSchemaValidation = () => {
    if (!recipientInfo.contactName) {
      alert("Please enter the employee name.");
      return false;
    }

    if (!recipientInfo.userContact) {
      alert("Please enter the employee email.");
      return false;
    }

    if (!recipientInfo.companyName) {
      alert("Please enter the company name.");
      return false;
    }

    if (!recipientInfo.jobDescription) {
      alert("Please enter the job description.");
      return false;
    }

    return true;
  };

  const handleContinue = async () => {
    if (!handleSchemaValidation()) {
      return;
    }
    setIsLoading(true);
    await handleGenerate();
    setStep(3);
    setIsLoading(false);
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="contact-name">Employee Name</Label>
              <Input
                id="contact-name"
                placeholder="e.g. John Smith"
                value={recipientInfo.contactName}
                onChange={(e) =>
                  setRecipientInfo({
                    ...recipientInfo,
                    contactName: e.target.value,
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
                value={recipientInfo.userContact}
                onChange={(e) =>
                  setRecipientInfo({
                    ...recipientInfo,
                    userContact: e.target.value,
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
                value={recipientInfo.jobIds[0] || ""}
                onChange={(e) =>
                  setRecipientInfo({
                    ...recipientInfo,
                    jobIds: [e.target.value],
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
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => setStep(1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          size="lg"
          onClick={handleContinue}
        >
          Generate Email
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default RecipientInfoPage;
