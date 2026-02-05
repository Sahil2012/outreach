import AutomatedToggle from "@/components/function/commons/AutomatedToggle";
import { Label } from "@/components/ui/label";
import { useThread } from "@/hooks/threads/useThreadData";
import { PropsWithId } from "@/lib/types/commonTypes";

const ManageThreadToggle = ({ id }: PropsWithId) => {
  const { data: thread } = useThread(id);

  if (!thread) return null;

  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label htmlFor="automated" className="text-sm font-medium">
          Automated Follow-ups
        </Label>
        <p className="text-xs text-muted-foreground">AI handles follow-ups</p>
      </div>
      <AutomatedToggle isAutomated={thread?.isAutomated} threadId={thread.id} />
    </div>
  );
};

export default ManageThreadToggle;
