import { useQuery } from "@tanstack/react-query";
import { threadKeys } from "../queryKeys";
import { useAPIClient } from "@/api/useAPIClient";
import { ThreadClient } from "../client";
import { ThreadsParams } from "../types";

export const useThread = (id: number) => {
  const apiClient = useAPIClient();
  const threadClient = new ThreadClient(apiClient);

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
  const threadClient = new ThreadClient(apiClient);
  params.status = params.status === "ALL" ? undefined : params.status;

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
