import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from './useApi';
import { OutreachListItem } from '@/lib/types';

export interface Message {

    subject: string;
    body: string;
    dateSent: string;
    fromUser: boolean;
    messageId: string;
}

export interface Employee {
    id: string;
    name: string;
    email: string;
    company: string;
    position: string;
}

export interface OutreachDetail extends OutreachListItem {
    threadId: string;
    status: string;
    type: string;
    isAutomated: boolean;
    externalThreadId: string;
    createdAt: string;
    lastUpdated: string;
    jobs: any[];
    employee: Employee
    messages: Message[];
}

export const useOutreachDetail = (id?: string) => {
    const api = useApi();
    const queryClient = useQueryClient();

    const detailQuery = useQuery({
        queryKey: ['outreach', 'detail', id],
        queryFn: async (): Promise<OutreachDetail> => {
            if (!id) throw new Error('ID is required');
            const response = await api.get<OutreachDetail>(`/thread/${id}`);
            return response.data;
        },
        enabled: !!id,
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ status }: { status: string }) => {
            if (!id) return;
            await api.patch(`/outreach/${id}`, { status });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['outreach', 'detail', id] });
            queryClient.invalidateQueries({ queryKey: ['outreach', 'list'] });
            queryClient.invalidateQueries({ queryKey: ['outreach', 'stats'] });
        }
    });

    const toggleAutomatedMutation = useMutation({
        mutationFn: async (isAutomated: boolean) => {
            if (!id) return;
            await api.patch(`/thread/${id}`, { isAutomated });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['outreach', 'detail', id] });
            queryClient.invalidateQueries({ queryKey: ['outreach', 'list'] });
        }
    });

    const sendFollowUpMutation = useMutation({
        mutationFn: async () => {
            if (!id) return;
            await api.post(`/outreach/send/${id}`, {});
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['outreach', 'detail', id] });
            queryClient.invalidateQueries({ queryKey: ['outreach', 'stats'] });
        }
    });

    return {
        data: detailQuery.data,
        isLoading: detailQuery.isLoading,
        error: detailQuery.error,

        updateStatus: updateStatusMutation.mutateAsync,
        isUpdatingStatus: updateStatusMutation.isPending,

        toggleAutomated: toggleAutomatedMutation.mutateAsync,
        isTogglingAutomated: toggleAutomatedMutation.isPending,

        sendFollowUp: sendFollowUpMutation.mutateAsync,
        isSendingFollowUp: sendFollowUpMutation.isPending,
    };
};
