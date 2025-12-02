import React from "react";
import { useOutreach } from "../../context/OutreachContext";
import TemplateSelectionPage from "./template-selection";
import RecipientInfoPage from "./recipient-info";
import EmailPreviewPage from "./email-preview";
import SendEmailPage from "./send-email";
import { Loader } from "../../components/ui/loader";
import { Progress } from "../../components/ui/progress";

const OutreachWizard: React.FC = () => {
    const { step, isLoading } = useOutreach();

    const renderStep = () => {
        switch (step) {
            case 1:
                return <TemplateSelectionPage />;
            case 2:
                return <RecipientInfoPage />;
            case 3:
                return <EmailPreviewPage />;
            case 4:
                return <SendEmailPage />;
            default:
                return <TemplateSelectionPage />;
        }
    };

    const getStepInfo = () => {
        switch (step) {
            case 1:
                return { title: "Choose Your Template", subtitle: "Start with a pre-built template or create your own custom message." };
            case 2:
                return { title: "Recipient Information", subtitle: "Add details about the recipient and the position you're applying for." };
            case 3:
                return { title: "Preview Your Email", subtitle: "Review and edit your email before sending." };
            case 4:
                return { title: "Send Your Email", subtitle: "Finalize and send your outreach email." };
            default:
                return { title: "", subtitle: "" };
        }
    };

    const { title, subtitle } = getStepInfo();
    const progress = (step / 4) * 100;

    return (
        <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
                        <p className="text-muted-foreground text-lg">{subtitle}</p>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader size="lg" text="Generating Email..." />
                    </div>
                ) : (
                    <div className="mt-8">
                        {renderStep()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OutreachWizard;
