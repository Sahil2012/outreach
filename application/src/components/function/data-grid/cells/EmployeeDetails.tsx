import MessageStateBadge from "@/components/function/status-badges/MessageStatusBadge";
import { PropsWithThread } from "@/lib/types/commonTypes";
import { User } from "lucide-react";

const EmployeeDetails = ({ thread }: PropsWithThread) => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
        <User className="w-4 h-4" />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{thread.employee.name}</span>
          <MessageStateBadge state={thread.messages?.[0].status} />
        </div>
        <span className="text-xs text-muted-foreground">
          {thread.employee.email}
        </span>
      </div>
    </div>
  );
};

export default EmployeeDetails;
