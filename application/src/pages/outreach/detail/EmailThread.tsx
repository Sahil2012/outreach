import { formatDistanceToNow } from "date-fns";
import DOMPurify from "dompurify";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@clerk/clerk-react";
import MessageStateBadge from "@/components/function/status-badges/MessageStatusBadge";
import { useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import { useThread } from "@/api/threads/hooks/useThreadData";
import { PropsWithId } from ".";

export const EmailThread = ({ id }: PropsWithId) => {
  const { data: thread } = useThread(id);
  const { user } = useUser();
  const navigate = useNavigate();

  if (!thread || thread.messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 rounded-lg border border-dashed">
        <p>No messages in this thread yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full overflow-y-auto">
      {thread.messages.map((email) => {
        const isMe = email.fromUser;
        const avatarFallback = "";
        const isDraft = email.status === "DRAFT";

        return (
          <div
            key={email.id}
            className={cn("p-8 rounded-3xl border transition-colors", {
              // User message styling
              "bg-primary/5 border-primary/20": isMe,
              // Recipient message styling
              "bg-muted/30 border-muted-foreground/20": !isMe,
              // Draft hover state
              "cursor-pointer hover:bg-primary/10": isDraft && isMe,
              "cursor-pointer hover:bg-muted/70": isDraft && !isMe,
            })}
            onClick={() => {
              if (isDraft) {
                navigate(`/outreach/preview/${email.id}`);
              }
            }}
          >
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="flex items-start justify-between border-b pb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10 border border-background">
                    <AvatarImage src={user?.imageUrl} />
                    <AvatarFallback
                      className={cn({
                        "bg-primary text-primary-foreground": isMe,
                        "bg-muted text-muted-foreground": !isMe,
                      })}
                    >
                      {avatarFallback}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-foreground">
                      {isMe ? user?.firstName : email.fromUser}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      To: {email.fromUser ? "You" : "Replied"}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <MessageStateBadge state={email.status} />
                  <div className="text-xs text-muted-foreground whitespace-nowrap mt-1">
                    {formatDistanceToNow(new Date(email.date), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="text-lg font-semibold text-foreground">
                    {email.subject}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <div
                      className="text-foreground/90 whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(email.body),
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
