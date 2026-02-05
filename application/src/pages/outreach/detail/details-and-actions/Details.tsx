import ThreadStatusBadge from "@/components/function/status-badges/ThreadStatusBadge";
import { useThread } from "@/hooks/threads/useThreadData";
import { PropsWithId } from "@/lib/types/commonTypes";
import { formatDistanceToNow } from "date-fns";

const Details = ({ id }: PropsWithId) => {
  const { data: thread } = useThread(id);

  const timeInfo = [
    {
      label: "Created",
      time: thread?.createdAt,
    },
    {
      label: "Last Activity",
      time: thread?.lastUpdated,
    },
  ];

  if (!thread) return null;

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-2xl font-semibold tracking-tight">
          {thread.employee.name}
        </h3>
        <div className="-mt-1.5 flex items-center gap-2 text-muted-foreground/70">
          <p className="text-sm">{thread.employee.email}</p>
        </div>
        {thread.employee.position && (
          <div className="mt-2 flex items-center gap-2 text-muted-foreground">
            <p className="text-sm font-medium">{thread.employee.position}</p>
            <span>•</span>
            <p className="text-sm font-medium">{thread.employee.company}</p>
          </div>
        )}
        {!thread.employee.position && (
          <div className="mt-2 flex items-center gap-2 text-muted-foreground">
            <p className="text-sm font-medium">{thread.employee.company}</p>
          </div>
        )}
      </div>

      <div className="-mt-1.5 flex items-center justify-between gap-2">
        <div className="flex gap-4">
          {timeInfo
            .filter((info) => info.time)
            .map((info) => (
              <div key={info.label} className="flex flex-col">
                <span className="text-xs text-muted-foreground font-semibold">
                  {info.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(thread.lastUpdated), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            ))}
        </div>
        <ThreadStatusBadge thread={thread} />
      </div>
    </div>
  );
};

export default Details;
