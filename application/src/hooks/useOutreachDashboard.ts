import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "./useApi";
import { ThreadMetaItem, ThreadMetaResponse } from "@/lib/types";
import { useMail } from "./useMail";

export const useOutreachDashboard = (
  page: number,
  pageSize: number,
  search?: string,
  status?: string,
  messageState?: string
) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { generateMail: generateMailApi } = useMail();

  // List Query
  const listQuery = useQuery<ThreadMetaResponse>({
    queryKey: ["outreach", "list", page, pageSize, search, status, messageState],
    queryFn: async (): Promise<ThreadMetaResponse> => {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      if (search) params.append("search", search);
      if (status && status !== "All") params.append("status", status);
      if (messageState) params.append("messageState", messageState);

      const response = await api.get<ThreadMetaResponse>(
        `/thread/meta?${params.toString()}`
      );
      return response.data;
    },
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutations
  const updateOutreachMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<ThreadMetaItem>;
    }) => {
      await api.patch(`/outreach/${id}`, payload);
    },
    onSuccess: () => {
      // Invalidate both list and stats as status change affects both
      queryClient.invalidateQueries({ queryKey: ["outreach"] });
    },
  });

  const deleteDraftMutation = useMutation({
    mutationFn: async (messageId: number) => {
      await api.delete(`/message/${messageId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outreach"] });
    },
  });

  const generateFollowUpMutation = useMutation({
    mutationFn: async (id: number) => {
      if (!id) return;
      return await generateMailApi({ threadId: id, type: "FOLLOWUP" });
    },
    onSuccess: ({ id }: { id: number }) => {
      queryClient.invalidateQueries({ queryKey: ["outreach", "detail", id] });
      queryClient.invalidateQueries({ queryKey: ["outreach", "list"] });
      queryClient.invalidateQueries({ queryKey: ["outreach", "stats"] });
    },
  });

  const markAsSentMutation = useMutation({
    mutationFn: async ({ id, threadId }: { id: number; threadId: number }) => {
      await api.patch(`/message/markAsSent/${id}`, { threadId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outreach'] });
    }
  });

  return {
    data: listQuery.data,
    isLoadingList: listQuery.isLoading,
    listError: listQuery.error,
    refreshData: listQuery.refetch,

    updateOutreach: updateOutreachMutation.mutateAsync,
    isUpdating: updateOutreachMutation.isPending,

    deleteDraft: deleteDraftMutation.mutateAsync,
    isDeletingDraft: deleteDraftMutation.isPending,

    generateFollowUp: generateFollowUpMutation.mutateAsync,
    isGeneratingFollowUp: generateFollowUpMutation.isPending,

    markAsSent: markAsSentMutation.mutateAsync,
    isMarkingAsSent: markAsSentMutation.isPending,
  };
};
