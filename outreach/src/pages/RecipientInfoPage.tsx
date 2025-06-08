import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Plus, Trash2 } from "lucide-react";
import { useOutreach } from "../context/OutreachContext";
import ProgressBar from "../components/ui/ProgressBar";
import Button from "../components/ui/Button";
import TextField from "../components/ui/TextField";
import Card from "../components/ui/Card";
import { generateMail } from "../service/mailService";

const RecipientInfoPage: React.FC = () => {
  const { setStep, recipientInfo, setRecipientInfo, setGeneratedEmail, setIsLoading} =
    useOutreach();
  const [jobIdState, setJobIdState] = useState("");

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
      const res = await generateMail({
        resumeLink: recipientInfo.resumeLink,
        jobId: recipientInfo.jobIds,
        hrName: recipientInfo.contactName,
        companyName: recipientInfo.companyName,
      });
      setGeneratedEmail(res);
    } catch (error) {
      console.error("Error sending mail:", error);
    }
  };

  const handleSchmeaValidation = () => {
    if (!recipientInfo.contactName) {
      alert("Please enter the contact name.");
      return;
    }

    if (!recipientInfo.companyName) {
      alert("Please enter the company name.");
      return;
    }

    let jobs: boolean = true;

    for (let ind = 0; ind < recipientInfo.jobIds.length; ind++) {
      jobs = jobs && !!recipientInfo.jobIds[ind];
    }

    if (!jobs) {
      alert("Please fill in all job IDs or remove empty fields.");
      return;
    }
  };

  const handleContinue = async () => {
    handleSchmeaValidation();
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

      <Card className="p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField
            label="Contact/HR Person Name"
            placeholder="e.g. John Smith"
            fullWidth
            value={recipientInfo.contactName}
            onChange={(e) =>
              setRecipientInfo({
                ...recipientInfo,
                contactName: e.target.value,
              })
            }
            required
          />

          <TextField
            label="Company Name"
            placeholder="e.g. Acme Corporation"
            fullWidth
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

        <div className="mt-6">
          <TextField
            label="Resume Link (Google Drive)"
            placeholder="e.g. https://drive.google.com/file/your-resume"
            fullWidth
            value={recipientInfo.resumeLink}
            onChange={(e) =>
              setRecipientInfo({ ...recipientInfo, resumeLink: e.target.value })
            }
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job IDs
            </label>
            <TextField
              placeholder="e.g. JOB-123456"
              fullWidth
              value={jobIdState}
              onChange={(e) => {
                setJobIdState(e.target.value);
              }}
              className="mr-2"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            variant="text"
            size="sm"
            icon={<Plus className="h-4 w-4" />}
            onClick={handleAddJob}
            className="mt-1"
          >
            Add another Job
          </Button>
        </div>

        <div className="mt-6">
          {recipientInfo.jobIds.map((_, index) => (
            <div
              key={`jobLink-${index}`}
              className="flex flex-col w-full md:flex-row pb-4 gap-4"
            >
              <span className=" md:w-1/5 mr-2 text-wrap">
                {recipientInfo.jobIds[index]}
              </span>
              {recipientInfo.jobIds.length > 0 && (
                <Button
                  className="md:w-1/5"
                  variant="text"
                  icon={<Trash2 className="h-4 w-4" />}
                  onClick={() => handleRemoveJob(index)}
                  aria-label="Remove job link"
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          size="lg"
          onClick={() => setStep(1)}
          icon={<ArrowLeft className="w-5 h-5" />}
        >
          Back
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={handleContinue}
          icon={<ArrowRight className="w-5 h-5" />}
          iconPosition="right"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default RecipientInfoPage;
