import React, { createContext, useContext, useState } from "react";
import { RecipientInfo, Template, GeneratedEmail } from "../types";

interface OutreachContextType {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  selectedTemplate: Template | null;
  setSelectedTemplate: React.Dispatch<React.SetStateAction<Template | null>>;
  customTemplate: string;
  setCustomTemplate: React.Dispatch<React.SetStateAction<string>>;
  recipientInfo: RecipientInfo;
  setRecipientInfo: React.Dispatch<React.SetStateAction<RecipientInfo>>;
  emailDistribution: string;
  setEmailDistribution: React.Dispatch<React.SetStateAction<string>>;
  generatedEmail: GeneratedEmail;
  setGeneratedEmail: React.Dispatch<React.SetStateAction<GeneratedEmail>>;
  useCustomTemplate: boolean;
  setUseCustomTemplate: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  resetForm: () => void;
}

const OutreachContext = createContext<OutreachContextType | undefined>(
  undefined
);

export const OutreachProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [customTemplate, setCustomTemplate] = useState("");
  const [useCustomTemplate, setUseCustomTemplate] = useState(false);
  const [recipientInfo, setRecipientInfo] = useState<RecipientInfo>({
    userName: "",
    userContact: "",
    contactName: "",
    companyName: "",
    jobIds: [],
    jobLinks: [],
    jobDescription: "",
    resumeLink: "",
  });
  const [emailDistribution, setEmailDistribution] = useState<string>("");
  const [generatedEmail, setGeneratedEmail] = useState<GeneratedEmail>({
    email: {
      subject: "",
      body: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const resetForm = () => {
    setSelectedTemplate(null);
    setCustomTemplate("");
    setUseCustomTemplate(false);
    setRecipientInfo({
      userName: "",
      userContact: "",
      contactName: "",
      companyName: "",
      jobIds: [],
      jobLinks: [],
      jobDescription: "",
      resumeLink: "",
    });
    setGeneratedEmail({
      email: {
        subject: "",
        body: "",
      },
    });
    setIsLoading(false);
  };

  return (
    <OutreachContext.Provider
      value={{
        step,
        setStep,
        selectedTemplate,
        setSelectedTemplate,
        customTemplate,
        setCustomTemplate,
        recipientInfo,
        setRecipientInfo,
        emailDistribution,
        setEmailDistribution,
        generatedEmail,
        setGeneratedEmail,
        useCustomTemplate,
        setUseCustomTemplate,
        isLoading,
        setIsLoading,
        resetForm,
      }}
    >
      {children}
    </OutreachContext.Provider>
  );
};

export const useOutreach = (): OutreachContextType => {
  const context = useContext(OutreachContext);
  if (!context) {
    throw new Error("useOutreach must be used within an OutreachProvider");
  }
  return context;
};
