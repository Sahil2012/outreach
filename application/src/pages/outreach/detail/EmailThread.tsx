import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EmailItem } from "@/hooks/useOutreachDetail";
import { useUser } from "@clerk/clerk-react";

interface EmailThreadProps {
  thread: EmailItem[];
}

export const EmailThread: React.FC<EmailThreadProps> = ({ thread }) => {
  const { user } = useUser();
  if (!thread || thread.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 rounded-lg border border-dashed">
        <p>No messages in this thread yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full overflow-y-auto">
      {thread.map((email) => {
        const isMe = email.from === user?.emailAddresses[0].emailAddress;
        const avatarFallback = isMe ? user?.firstName?.charAt(0).toUpperCase() : email.from.charAt(0).toUpperCase();

        return (
          <div key={email.id} className="bg-muted/30 p-8 rounded-3xl border">
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="flex items-start justify-between border-b pb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10 border border-background">
                    <AvatarFallback className={isMe ? "bg-primary text-primary-foreground" : ""}>
                      {avatarFallback}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-foreground">
                      {isMe ? user?.firstName : email.from}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      To: {email.to}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap mt-1">
                  {formatDistanceToNow(new Date(email.sentAt), { addSuffix: true })}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="text-lg font-semibold text-foreground">{email.subject}</div>
                </div>

                <div className="space-y-1">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-foreground/90">
                      {email.body}
                    </div>
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
