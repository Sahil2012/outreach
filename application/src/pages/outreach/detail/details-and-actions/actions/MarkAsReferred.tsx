import { Button } from "@/components/ui/button";
import { useThreadActions } from "@/hooks/threads/useThreadActions";
import { useThread } from "@/hooks/threads/useThreadData";
import { PropsWithId } from "@/lib/types/commonTypes";
import { MessageCircle } from "lucide-react";

const MarkAsReferred = ({ id }: PropsWithId) => {
  const { data: thread } = useThread(id);
  const { updateStatus } = useThreadActions();

  if (!thread || thread.isAutomated || thread.status === "CLOSED") {
    return null;
  }

  const handleMarkReferred = () => {
    updateStatus.mutate({ id: thread.id, status: "REFERRED" });
  };

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={handleMarkReferred}
      disabled={updateStatus.isPending}
    >
      <MessageCircle className="mr-2 w-4 h-4" />
      Mark as Referred
    </Button>
  );
};

export default MarkAsReferred;
