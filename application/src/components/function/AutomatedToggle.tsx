import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import useAutomatedToggle from "@/hooks/useAutomatedToggle";
import { ThreadMetaItem } from "@/lib/types";

interface AutomatedToggleProps {
  threadId: number;
  data: ThreadMetaItem;
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}

const AutomatedToggle = ({ data, threadId, page, pageSize, search, status }: AutomatedToggleProps) => {
  const { toggleAutomated, isTogglingAutomated } = useAutomatedToggle(threadId, page, pageSize, search, status);

  const isUpdating = isTogglingAutomated;
  const handleToggleAutomated = async (checked: boolean) => {
    try {
      await toggleAutomated(checked);
      toast.success(
        `Automated follow-ups ${checked ? "enabled" : "disabled"}.`
      );
    } catch {
      console.error("Failed to update settings.");
      toast.error("Failed to update settings.");
    }
  };

  return (
    <Switch
      checked={data?.automated}
      onCheckedChange={handleToggleAutomated}
      disabled={isUpdating || isTogglingAutomated}
    />
  );
};

export default AutomatedToggle;
