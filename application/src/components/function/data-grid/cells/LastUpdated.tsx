import { formatDistanceToNow } from "date-fns";
import { PropsWithThread } from "../types";

const LastUpdated = ({ thread }: PropsWithThread) => {
  return (
    <span className="text-sm text-muted-foreground">
      {thread.lastUpdated
        ? formatDistanceToNow(new Date(thread.lastUpdated), {
            addSuffix: true,
          })
        : "-"}
    </span>
  );
};

export default LastUpdated;
