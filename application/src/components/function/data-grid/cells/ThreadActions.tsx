import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Send, Trash2 } from "lucide-react";
import { ThreadMetaItem } from "@/api/threads/types";
import { useMessageActions } from "@/api/messages/hooks/useMessageActions";
import { MessageType } from "@/api/messages/types";
import { useThreadActions } from "@/api/threads/hooks/useThreadActions";
import { cn } from "@/lib/utils";
import { PropsWithThread } from "../types";
import { HugeiconsIcon } from "@hugeicons/react";
import { AiMagicIcon } from "@hugeicons/core-free-icons";
import { Spinner } from "@/components/ui/spinner";

const isFollowUpPossible = (thread: ThreadMetaItem) => {
  return (
    ["PENDING", "SENT", "FIRST_FOLLOW_UP", "SECOND_FOLLOW_UP"].includes(
      thread.status,
    ) && thread.messages?.[0]?.status !== "DRAFT"
  );
};

const ThreadActions = ({ thread }: PropsWithThread) => {
  const { generateMessage, markAsSent, deleteDraft } = useMessageActions();
  const { updateStatus } = useThreadActions();

  const actions = [
    {
      id: "generate-follow-up",
      shouldShow: isFollowUpPossible(thread),
      onClick: () => {
        generateMessage.mutate({
          type: MessageType.FOLLOW_UP,
          threadId: thread.id,
        });
      },
      content: (
        <>
          <HugeiconsIcon icon={AiMagicIcon} size="1rem" />
          Generate Follow Up
        </>
      ),
    },
    {
      id: "mark-as-sent",
      shouldShow: thread.messages?.[0]?.status === "DRAFT",
      onClick: () => {
        markAsSent.mutate({
          id: thread.messages[0].id,
        });
      },
      content: (
        <>
          <Send className="mr-2 h-4 w-4" />
          Mark as Sent
        </>
      ),
    },
    {
      id: "mark-as-referred",
      shouldShow: thread.status === "CLOSED",
      onClick: () => {
        updateStatus.mutate({
          id: thread.id,
          status: "REFERRED",
        });
      },
      content: "Mark as Referred",
    },
    {
      id: "mark-as-absconded",
      shouldShow: thread.status === "CLOSED",
      className: "text-destructive",
      onClick: () => {
        updateStatus.mutate({
          id: thread.id,
          status: "CLOSED",
        });
      },
      content: "Mark as Absconded",
    },
    {
      id: "delete",
      shouldShow: thread.messages[0].status === "DRAFT",
      className:
        "text-destructive focus:text-destructive focus:bg-destructive/10",
      onClick: () => {
        deleteDraft.mutate({
          id: thread.messages[0].id,
        });
      },
      content: (
        <>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </>
      ),
    },
  ];

  const isLoading =
    generateMessage.isPending ||
    markAsSent.isPending ||
    updateStatus.isPending ||
    deleteDraft.isPending;

  return (
    <button
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      tabIndex={0}
      className="cursor-pointer"
      disabled={isLoading}
    >
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full transition-opacity"
            disabled={isLoading}
          >
            {isLoading ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {actions
            .filter((action) => action.shouldShow)
            .map((action) => (
              <DropdownMenuItem
                key={action.id}
                onClick={action.onClick}
                className={cn(action.className)}
              >
                {action.content}
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </button>
  );
};

export default ThreadActions;
