import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Plus, Trash2 } from "lucide-react";
import { useOutreach } from "../../../context/OutreachContext";
import { useAuth } from "../../../context/AuthContext";
import ProgressBar from "../../../components/ui/ProgressBar";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Card, CardContent } from "../../../components/ui/card";
import { generateMail } from "../../../service/mailService";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const RecipientInfoPage: React.FC = () => {
  const { setStep, recipientInfo, setRecipientInfo, setGeneratedEmail, setIsLoading, selectedTemplate } =
    useOutreach();
  const { getToken } = useAuth();
  const [jobIdState, setJobIdState] = useState("");
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const { company, employee } = location.state || {};
    if (company) {
      setRecipientInfo({
        ...recipientInfo,
        companyName: company.name,
      });
      setCompanyId(company.id);
    }
    if (employee) {
      setRecipientInfo({
        ...recipientInfo,
        contactName: employee.name,
      });
      setEmployeeId(employee.id);
    }
  }, [location.state]);

  const handleAddJob = () => {
    setRecipientInfo({
      ...recipientInfo,
      jobIds: [...recipientInfo.jobIds, jobIdState],
    });
    setJobIdState("");
  };

  const handleRemoveJob = (index: number) => {
    setRecipientInfo({
      ...recipientInfo,
      jobIds: recipientInfo.jobIds.filter((_, i) => i !== index),
    });
  };

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
        resumeLink: recipientInfo.resumeLink,
        jobId: recipientInfo.jobIds,
        hrName: recipientInfo.contactName,
        companyName: recipientInfo.companyName,
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
      alert("Please enter the contact name.");
      return false;
    }

    if (!recipientInfo.companyName) {
      alert("Please enter the company name.");
      return false;
    }

    let jobs: boolean = true;

    for (let ind = 0; ind < recipientInfo.jobIds.length; ind++) {
      jobs = jobs && !!recipientInfo.jobIds[ind];
    }

    if (!jobs) {
      alert("Please fill in all job IDs or remove empty fields.");
      return false;
    }

    return true;
  };

  const handleContinue = async () => {
    if(!handleSchemaValidation()) {
      return;
    }
    setIsLoading(true);
    await handleGenerate();
    setStep(3);
    setIsLoading(false);
  };

  return (
    <div className="animate-fadeIn">
      <ProgressBar currentStep={2} totalSteps={4} />

      <h1 className="font-serif text-3xl font-medium text-navy-800 mb-2">
        Recipient Information
      </h1>
      <p className="text-gray-600 mb-8">
        Add details about the recipient and the position you're applying for.
      </p>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="contact-name">Contact/HR Person Name *</Label>
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
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name *</Label>
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
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="resume-link">Resume Link (Google Drive)</Label>
            <Input
              id="resume-link"
              placeholder="e.g. https://drive.google.com/file/your-resume"
              value={recipientInfo.resumeLink}
              onChange={(e) =>
                setRecipientInfo({ ...recipientInfo, resumeLink: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="job-id">Job IDs</Label>
            <div className="flex gap-2">
              <Input
                id="job-id"
                placeholder="e.g. JOB-123456"
                value={jobIdState}
                onChange={(e) => setJobIdState(e.target.value)}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddJob}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Job
              </Button>
            </div>
          </div>

          {recipientInfo.jobIds.length > 0 && (
            <div className="space-y-2">
              <Label>Added Job IDs</Label>
              <div className="space-y-2">
                {recipientInfo.jobIds.map((jobId, index) => (
                  <div
                    key={`jobLink-${index}`}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <span className="text-sm font-medium">{jobId}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveJob(index)}
                      aria-label="Remove job link"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          size="lg"
          onClick={() => setStep(1)}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        <Button
          variant="default"
          size="lg"
          onClick={handleContinue}
        >
          Continue
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default RecipientInfoPage;
