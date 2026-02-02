import { Thread, ThreadMetaItem } from "@/api/threads/types";
import { Badge } from "@/components/ui/badge";

const ThreadStatusBadge = ({ thread }: { thread: Thread | ThreadMetaItem }) => {
  const variants: Record<Thread["status"], string> = {
    PENDING: "bg-gray-100 text-gray-700 hover:bg-gray-100",
    SENT: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    FIRST_FOLLOW_UP: "bg-purple-100 text-purple-700 hover:bg-purple-100",
    SECOND_FOLLOW_UP: "bg-purple-100 text-purple-700 hover:bg-purple-100",
    THIRD_FOLLOW_UP: "bg-purple-100 text-purple-700 hover:bg-purple-100",
    CLOSED: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
    REFERRED: "bg-green-100 text-green-700 hover:bg-green-100",
    DELETED: "bg-red-100 text-red-700 hover:bg-red-100",
  };

  return (
    <Badge className={`${variants[thread.status] || "bg-gray-100"} border-0`}>
      {thread.status}
    </Badge>
  );
};

export default ThreadStatusBadge;
