import { useThread } from "@/api/threads/hooks/useThreadData";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { PropsWithId } from "../..";
import { useThreadActions } from "@/api/threads/hooks/useThreadActions";

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
