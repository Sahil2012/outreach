import { useMutation } from "@tanstack/react-query";
import { useApi } from "./useApi";
import { useQueryClient } from "@tanstack/react-query";
import { OutreachDetail } from "./useOutreachDetail";
import { ThreadMetaResponse } from "@/lib/types";

const useAutomatedToggle = (
  id?: number,
  page?: number,
  pageSize?: number,
  search?: string,
  status?: string
) => {
  const api = useApi();
  const queryClient = useQueryClient();

  const toggleAutomatedMutation = useMutation({
    mutationFn: async (isAutomated: boolean) => {
      if (!id) return;
      return await api.patch(`/thread/${id}`, { isAutomated });
    },
    onSuccess: (data: any) => {
      queryClient.setQueryData(
        ["outreach", "detail", id],
        (prevData: OutreachDetail | undefined) => {
          if (!prevData) return prevData;
          return {
            ...prevData,
            automated: data?.data?.automated || !prevData.isAutomated,
            isAutomated: data?.data?.automated || !prevData.isAutomated,
          };
        }
      );
      queryClient.setQueryData(
        ["outreach", "list", page, pageSize, search, status, undefined],
        (prevData: ThreadMetaResponse | undefined) => {
          if (!prevData) return prevData;
          return {
            ...prevData,
            threads: prevData.threads.map((thread) => {
              if (thread.id === id) {
                thread.automated = data?.data?.automated || !thread.automated;
              }
              return thread;
            }),
          };
        }
      );
      queryClient.invalidateQueries({ queryKey: ["outreach", "detail", id] });
      queryClient.invalidateQueries({
        queryKey: [
          "outreach",
          "list",
          page,
          pageSize,
          search,
          status,
          undefined,
        ],
      });
    },
  });

  return {
    toggleAutomated: toggleAutomatedMutation.mutateAsync,
    isTogglingAutomated: toggleAutomatedMutation.isPending,
  };
};

export default useAutomatedToggle;
