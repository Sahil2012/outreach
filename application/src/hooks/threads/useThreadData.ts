import { useQuery } from "@tanstack/react-query";
import { threadKeys } from "./threadsQueryKeys";
import { useAPIClient } from "@/hooks/useAPIClient";
import { ThreadService } from "@/services/threadService";
import { ThreadsParams } from "@/lib/types/threadsTypes";

export const useThread = (id: number) => {
  const apiClient = useAPIClient();
  const threadClient = new ThreadService(apiClient);

  return useQuery({
    queryKey: threadKeys.detail(id),
    queryFn: () => {
      return threadClient.getThread(id);
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useThreads = (params: ThreadsParams) => {
  const apiClient = useAPIClient();
  const threadClient = new ThreadService(apiClient);

  if (params.status === "ALL") {
    delete params.status;
  }

  return useQuery({
    queryKey: threadKeys.list(params),
    queryFn: () => {
      return threadClient.getThreads(params);
    },
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
  });
};
