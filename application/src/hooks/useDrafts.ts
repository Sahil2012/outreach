import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from './useApi';
import { Draft } from '@/lib/types';

export const useDrafts = () => {
    const api = useApi();
    const queryClient = useQueryClient();

    const draftsQuery = useQuery({
        queryKey: ['drafts'],
        queryFn: async (): Promise<Draft[]> => {
            const response = await api.get<Draft[]>('/outreach/drafts');
            // Sort by createdAt desc locally since mock server might not
            return response.data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        },
    });

    const deleteDraftMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/outreach/drafts/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['drafts'] });
        },
    });

    const markAsSentMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.patch(`/outreach/drafts/${id}`, { status: 'Sent' });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['drafts'] });
        },
    });

    return {
        drafts: draftsQuery.data || [],
        isLoading: draftsQuery.isLoading,
        error: draftsQuery.error,
        deleteDraft: deleteDraftMutation.mutateAsync,
        markAsSent: markAsSentMutation.mutateAsync,
        isDeleting: deleteDraftMutation.isPending,
        isMarkingSent: markAsSentMutation.isPending,
    };
};
