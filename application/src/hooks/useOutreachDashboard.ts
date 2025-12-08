import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from './useApi';
import { OutreachStats, OutreachMetaResponse, OutreachStatus } from '@/lib/types';

export const useOutreachDashboard = (page: number, limit: number, search?: string, status?: string) => {
    const api = useApi();
    const queryClient = useQueryClient();

    // Stats Query
    const statsQuery = useQuery({
        queryKey: ['outreach', 'stats'],
        queryFn: async (): Promise<OutreachStats> => {
            const response = await api.get<OutreachStats>('/outreach/stats');
            return response.data;
        },
    });

    // List Query
    const listQuery = useQuery({
        queryKey: ['outreach', 'list', page, limit, search, status],
        queryFn: async (): Promise<OutreachMetaResponse> => {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
            });
            if (search) params.append('search', search);
            if (status && status !== 'All') params.append('status', status);

            const response = await api.get<OutreachMetaResponse>(`/outreach/meta?${params.toString()}`);
            return response.data;
        },
        placeholderData: (previousData) => previousData, // Keep previous data while fetching new
    });

    // Mutations
    const updateOutreachMutation = useMutation({
        mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
            await api.patch(`/outreach/${id}`, payload);
        },
        onSuccess: () => {
            // Invalidate both list and stats as status change affects both
            queryClient.invalidateQueries({ queryKey: ['outreach'] }); 
        }
    });

    const sendFollowUpMutation = useMutation({
        mutationFn: async (id: string) => {
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

    return {
        stats: statsQuery.data,
        isLoadingStats: statsQuery.isLoading,
        statsError: statsQuery.error,

        data: listQuery.data,
        isLoadingList: listQuery.isLoading,
        listError: listQuery.error,

        updateOutreach: updateOutreachMutation.mutateAsync,
        isUpdating: updateOutreachMutation.isPending,

        sendFollowUp: sendFollowUpMutation.mutateAsync,
        isSendingFollowUp: sendFollowUpMutation.isPending,
    };
};
