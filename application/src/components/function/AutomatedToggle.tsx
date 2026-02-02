import { Switch } from "@/components/ui/switch";
import { useThreadActions } from "@/api/threads/hooks/useThreadActions";

interface AutomatedToggleProps {
  threadId: number;
  isAutomated: boolean;
}

const AutomatedToggle = ({ isAutomated, threadId }: AutomatedToggleProps) => {
  const { toggleAutomated } = useThreadActions();

  const handleToggleAutomated = async (checked: boolean) => {
    toggleAutomated.mutate({ id: threadId, isAutomated: checked });
  };

  return (
    <Switch
      checked={isAutomated}
      onCheckedChange={handleToggleAutomated}
      disabled={toggleAutomated.isPending}
    />
  );
};

export default AutomatedToggle;
