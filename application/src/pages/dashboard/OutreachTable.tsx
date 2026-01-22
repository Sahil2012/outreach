import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Building2, User, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import ThreadStatusBadge from "@/components/function/ThreadStatusBadge";
import MessageStateBadge from "@/components/function/MessageStateBadge";
import AutomatedToggle from "@/components/function/AutomatedToggle";
import { ThreadsMeta, ThreadStatus } from "@/api/threads/types";

const needsAttention = (lastUpdated: string) => {
  const now = new Date();
  const lastUpdatedDate = new Date(lastUpdated);
  const diffInHours =
    (now.getTime() - lastUpdatedDate.getTime()) / (1000 * 60 * 60);
  return diffInHours > 24 * 4;
};

interface OutreachTableProps {
  threads: ThreadsMeta["threads"];
  isLoading: boolean;
  isGeneratingFollowUp: boolean;
  onAction: (
    id: number,
    action: "follow-up" | "mark-absconded" | "mark-referred" | "mark-sent",
    threadId: number,
  ) => void;
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
}

export const OutreachTable = ({
  threads,
  isLoading,
  onAction,
  isGeneratingFollowUp,
  page,
  pageSize,
  search,
  status,
}: OutreachTableProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const canBeFollowedUp = (status: ThreadStatus) => {
    return ["PENDING", "SENT", "FIRST_FOLLOW_UP", "SECOND_FOLLOW_UP"].includes(
      status,
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent border-border/40">
          <TableHead></TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Automated</TableHead>
          <TableHead>Last Activity</TableHead>
          <TableHead className="text-center pr-6">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {threads.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={7}
              className="h-24 text-center text-muted-foreground"
            >
              No outreach records found.
            </TableCell>
          </TableRow>
        ) : (
          threads.map((thread) => (
            <TableRow
              key={thread.id}
              className={cn(
                "relative group hover:bg-muted/70 border-border/40 cursor-pointer",
                {
                  "bg-green-100 hover:bg-green-200": needsAttention(
                    thread.lastUpdated,
                  ),
                },
              )}
              onClick={() => navigate(`/outreach/view/${thread.id}`)}
            >
              <TableCell className="relative w-min">
                <div
                  className={cn(
                    "absolute ml-0.5 xl:ml-2 top-1/2 -translate-y-1/2 rounded-full h-2 w-2 bg-green-500",
                    {
                      hidden: !needsAttention(thread.lastUpdated),
                    },
                  )}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {thread.employee.name}
                      </span>
                      <MessageStateBadge state={thread.messages?.[0].status} />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {thread.employee.email}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="w-4 h-4" />
                  <span className="text-sm">{thread.jobs?.[0].company}</span>
                </div>
              </TableCell>
              <TableCell>
                <ThreadStatusBadge status={thread.status} />
              </TableCell>
              <TableCell>
                <button
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  tabIndex={0}
                  className="cursor-default"
                >
                  <AutomatedToggle
                    data={thread}
                    threadId={thread.id}
                    page={page}
                    pageSize={pageSize}
                    search={search}
                    status={status}
                  />
                </button>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {thread.lastUpdated
                    ? formatDistanceToNow(new Date(thread.lastUpdated), {
                        addSuffix: true,
                      })
                    : "-"}
                </span>
              </TableCell>
              <TableCell className="text-center pr-6">
                <button
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  tabIndex={0}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {canBeFollowedUp(thread.status) &&
                        thread.messages?.[0]?.status !== "DRAFT" && (
                          <DropdownMenuItem
                            onClick={() =>
                              onAction(thread.id, "follow-up", thread.id)
                            }
                          >
                            {isGeneratingFollowUp ? (
                              <Loader2 className="animate-spin" />
                            ) : (
                              "Generate Follow Up"
                            )}
                          </DropdownMenuItem>
                        )}
                      {thread.messages?.[0]?.status === "DRAFT" && (
                        <DropdownMenuItem
                          onClick={() =>
                            onAction(
                              thread.messages?.[0]?.id,
                              "mark-sent",
                              thread.id,
                            )
                          }
                        >
                          Mark as Sent
                        </DropdownMenuItem>
                      )}
                      {thread.status !== "CLOSED" && (
                        <DropdownMenuItem
                          onClick={() =>
                            onAction(thread.id, "mark-referred", thread.id)
                          }
                        >
                          Mark as Referred
                        </DropdownMenuItem>
                      )}
                      {thread.status !== "CLOSED" && (
                        <DropdownMenuItem
                          onClick={() =>
                            onAction(thread.id, "mark-absconded", thread.id)
                          }
                          className="text-destructive"
                        >
                          Mark as Absconded
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
