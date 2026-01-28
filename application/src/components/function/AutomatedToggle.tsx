import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ThreadMetaItem } from "@/api/threads/types";
import { useThreadActions } from "@/api/threads/hooks/useThreadActions";

interface AutomatedToggleProps {
  threadId: number;
  data: ThreadMetaItem;
}

const AutomatedToggle = ({ data, threadId }: AutomatedToggleProps) => {
  const { toggleAutomated } = useThreadActions();

  const handleToggleAutomated = async (checked: boolean) => {
    try {
      await toggleAutomated.mutateAsync({ id: threadId, isAutomated: checked });
      toast.success(
        `Automated follow-ups ${checked ? "enabled" : "disabled"}.`,
      );
    } catch {
      console.error("Failed to update settings.");
      toast.error("Failed to update settings.");
    }
  };

  return (
    <Switch
      checked={data?.isAutomated}
      onCheckedChange={handleToggleAutomated}
      disabled={toggleAutomated.isPending}
    />
  );
};

export default AutomatedToggle;
