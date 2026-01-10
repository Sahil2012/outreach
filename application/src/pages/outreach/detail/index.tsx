import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader } from "@/components/ui/loader";
import { useOutreachDetail } from "@/hooks/useOutreachDetail";
import { DetailsAndActions } from "./DetailsAndActions";
import { EmailThread } from "./EmailThread";
import { toast } from "sonner";

const OutreachDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    error,
    updateStatus,
    toggleAutomated,
    sendFollowUp,
    isUpdatingStatus,
    isTogglingAutomated,
    isSendingFollowUp
  } = useOutreachDetail(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="text-destructive font-medium">Failed to load outreach details.</div>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-primary hover:underline"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handleSendFollowUp = async () => {
    try {
      await sendFollowUp();
      toast.success("Follow-up sent successfully!");
    } catch {
      toast.error("Failed to send follow-up.");
    }
  };

  const handleMarkAbsconded = async () => {
    try {
      await updateStatus({ status: 'CLOSED' });
      toast.success("Marked as absconded.");
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const handleMarkReferred = async () => {
    try {
      await updateStatus({ status: 'REFFERED' });
      toast.success("Marked as referred!");
    } catch {
      console.error("Failed to update status.");
      toast.error("Failed to update status.");
    }
  };

  const handleToggleAutomated = async (checked: boolean) => {
    try {
      await toggleAutomated(checked);
      toast.success(`Automated follow-ups ${checked ? 'enabled' : 'disabled'}.`);
    } catch {
      console.error("Failed to update settings.");
      toast.error("Failed to update settings.");
    }
  };

  return (
    <div className="animate-fadeIn p-6 h-[calc(100vh-80px)]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
        {/* Left Side: Details & Actions */}
        <div className="lg:col-span-4 h-full overflow-hidden">
          <DetailsAndActions
            data={data}
            isSendingFollowUp={isSendingFollowUp}
            isUpdating={isUpdatingStatus || isTogglingAutomated}
            onSendFollowUp={handleSendFollowUp}
            onMarkAbsconded={handleMarkAbsconded}
            onMarkReferred={handleMarkReferred}
            onToggleAutomated={handleToggleAutomated}
            onBack={() => navigate('/dashboard')}
          />
        </div>
        {/* Right Side: Thread */}
        <div className="lg:col-span-8 h-full overflow-hidden bg-muted/10">
          <EmailThread
            thread={data.messages || []}
          />
        </div>
      </div>
    </div>
  );
};

export default OutreachDetailPage;
