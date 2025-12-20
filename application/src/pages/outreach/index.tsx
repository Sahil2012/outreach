import React from "react";
import { Progress } from "../../components/ui/progress";
import { Outlet, useLocation } from "react-router-dom";

const OutreachWizard: React.FC = () => {
  const location = useLocation();

  const getStep = () => {
    const path = location.pathname;
    if (path.includes("templates")) return 1;
    if (path.includes("recipient-info")) return 2;
    if (path.includes("preview")) return 3;
    if (path.includes("send")) return 4;
    return 1;
  };

  const step = getStep();

  const getStepInfo = () => {
    switch (step) {
      case 1:
        return { title: "Choose Your Template", subtitle: "Start with a pre-built template." };
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

        <div className="mt-12">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default OutreachWizard;
