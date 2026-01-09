import { useOutreachDetail } from "@/hooks/useOutreachDetail";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface AutomatedToggleProps {
  threadId: number;
}

const AutomatedToggle = ({ threadId }: AutomatedToggleProps) => {
  const { toggleAutomated, data, isTogglingAutomated, isUpdatingStatus } = useOutreachDetail(threadId);

  const isUpdating = isTogglingAutomated || !data;
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
    <Switch
      checked={data?.isAutomated}
      onCheckedChange={handleToggleAutomated}
      disabled={isUpdating || isUpdatingStatus}
    />
  );
};

export default AutomatedToggle;
