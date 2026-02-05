import { Button } from "@/components/ui/button";
import { useThreadActions } from "@/hooks/threads/useThreadActions";
import { useThread } from "@/hooks/threads/useThreadData";
import { PropsWithId } from "@/lib/types/commonTypes";
import { UserX } from "lucide-react";

const MarkAsAbsconded = ({ id }: PropsWithId) => {
  const { data: thread } = useThread(id);
  const { updateStatus } = useThreadActions();

  const handleMarkAbsconded = () => {
    updateStatus.mutate({ id, status: "CLOSED" });
  };

  if (!thread || thread.status === "CLOSED") {
    return null;
  }

  return (
    <Button
      variant="outline"
      className="w-full hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
      onClick={handleMarkAbsconded}
      disabled={updateStatus.isPending}
    >
      <UserX className="mr-2 w-4 h-4" />
      Mark as Absconded
    </Button>
  );
};

export default MarkAsAbsconded;
