import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from './useApi';
import { OutreachStats, ThreadMetaItem, ThreadMetaResponse } from '@/lib/types';

export const useOutreachDashboard = (page: number, pageSize: number, search?: string, status?: string) => {
  const api = useApi();
  const queryClient = useQueryClient();

  // Stats Query
  const statsQuery = useQuery({
    queryKey: ['outreach', 'stats'],
    queryFn: async (): Promise<OutreachStats> => {
      const response = await api.get<OutreachStats>('/stats');
      return response.data;
    },
  });

  // List Query
  const listQuery = useQuery<ThreadMetaResponse>({
    queryKey: ['outreach', 'list', page, pageSize, search, status],
    queryFn: async (): Promise<ThreadMetaResponse> => {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      if (search) params.append('search', search);
      if (status && status !== 'All') params.append('status', status);

      const response = await api.get<ThreadMetaResponse>(`/thread/meta?${params.toString()}`);
      return response.data;
    },
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutations
  const updateOutreachMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: Partial<ThreadMetaItem> }) => {
      await api.patch(`/outreach/${id}`, payload);
    },
    onSuccess: () => {
      // Invalidate both list and stats as status change affects both
      queryClient.invalidateQueries({ queryKey: ['outreach'] });
    }
  });

  const deleteDraftMutation = useMutation({
    mutationFn: async (messageId: number) => {
      await api.delete(`/message/${messageId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outreach'] });
    }
  });

  const sendFollowUpMutation = useMutation({
    mutationFn: async (id: number) => {
      // Assuming specific endpoint for manual follow up trigger if different from standard send
      // User said: follow up - /outreach/send/:id
      // Check generic send endpoint: /outreach/send body { id, manageThread }
      // The user instruction says /outreach/send/:id . This might be a different endpoint or a path param style.
      // Given standard REST, it might be POST /outreach/send/:id or POST /outreach/send with body id.
      // I will assume POST /outreach/send/:id based on instruction text literally. 
      // BUT `useOutreach` uses `api.post('/outreach/send', { id, manageThread })`.
      // I will try to follow the instruction blindly first: /outreach/send/:id
      await api.post(`/outreach/send/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outreach'] });
    }
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
    stats: statsQuery.data,
    isLoadingStats: statsQuery.isLoading,
    statsError: statsQuery.error,

    data: listQuery.data,
    isLoadingList: listQuery.isLoading,
    listError: listQuery.error,
    refreshData: listQuery.refetch,

    updateOutreach: updateOutreachMutation.mutateAsync,
    isUpdating: updateOutreachMutation.isPending,

    deleteDraft: deleteDraftMutation.mutateAsync,
    isDeletingDraft: deleteDraftMutation.isPending,

    sendFollowUp: sendFollowUpMutation.mutateAsync,
    isSendingFollowUp: sendFollowUpMutation.isPending,

    markAsSent: markAsSentMutation.mutateAsync,
    isMarkingAsSent: markAsSentMutation.isPending,
  };
};
