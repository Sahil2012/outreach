import { PropsWithThread } from "@/lib/types/commonTypes";
import { Thread, ThreadMetaItem } from "@/lib/types/threadsTypes";
import { cn } from "@/lib/utils";

export const needsAttention = (thread: Thread | ThreadMetaItem) => {
  const now = new Date();
  const lastUpdatedDate = new Date(thread.lastUpdated);

  const diffInHours =
    (now.getTime() - lastUpdatedDate.getTime()) / (1000 * 60 * 60);
  return diffInHours > 24 * 4;
};

const NeedsAttention = ({ thread }: PropsWithThread) => {
  const shouldShow = needsAttention(thread);

  return (
    <div
      className={cn(
        "absolute ml-0.5 xl:ml-2 top-1/2 -translate-y-1/2 rounded-full h-2 w-2 bg-green-500",
        shouldShow ? "" : "hidden",
      )}
    />
  );
};

export default NeedsAttention;
