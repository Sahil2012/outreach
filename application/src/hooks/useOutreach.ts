import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from './useApi';
import { Template, GeneratedEmail } from '@/lib/types';
import { useState, useCallback } from 'react';

export interface GenerateEmailPayload {
    employeeName: string;
    employeeEmail: string;
    companyName: string;
    jobId?: string;
    jobDescription: string;
    templateId: string;
}

export interface UpdateEmailPayload {
    subject?: string;
    body?: string;
    isDraftCompleted?: boolean;
}

export const useOutreach = (draftId?: string) => {
    const api = useApi();
    const queryClient = useQueryClient();
    const [isPolling, setIsPolling] = useState(false);

    // Queries
    const templatesQuery = useQuery({
        queryKey: ['outreach', 'templates'],
        queryFn: async (): Promise<Template[]> => {
            const response = await api.get<Template[]>('/outreach/types');
            return response.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const draftQuery = useQuery({
        queryKey: ['outreach', 'draft', draftId],
        queryFn: async (): Promise<{ id: string } & GenerateEmailPayload & GeneratedEmail> => {
            if (!draftId) throw new Error('Draft ID is required');
            const response = await api.get(`/outreach/drafts/${draftId}`);
            return response.data;
        },
        enabled: !!draftId,
        refetchInterval: isPolling ? 2000 : false,
    });

    // Polling controls
    const startPolling = useCallback(() => setIsPolling(true), []);
    const stopPolling = useCallback(() => setIsPolling(false), []);

    // Mutations
    const generateEmailMutation = useMutation({
        mutationFn: async (payload: GenerateEmailPayload) => {
            const response = await api.post<{ id: string; email: GeneratedEmail }>('/outreach/drafts', payload);
            return response.data;
        }
    });

    const updateDraftMutation = useMutation({
        mutationFn: async ({ id, payload }: { id: string; payload: UpdateEmailPayload }) => {
            // Logic adapted from useOutreachActions
            const updateData: any = {};
            if (payload.subject || payload.body) {
                updateData.email = {
                    subject: payload.subject,
                    body: payload.body
                };
            }
            if (payload.isDraftCompleted !== undefined) {
                updateData.isDraftCompleted = payload.isDraftCompleted;
            }
            await api.patch(`/outreach/drafts/${id}`, updateData);
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['outreach', 'draft', id] });
        }
    });

    const sendEmailMutation = useMutation({
        mutationFn: async ({ id, manageThread }: { id: string; manageThread: boolean }) => {
            await api.post('/outreach/send', { id, manageThread });
        },
        onSuccess: (_, { id }) => {
             // Maybe update draft status locally
             queryClient.invalidateQueries({ queryKey: ['outreach', 'draft', id] });
        }
    });

    return {
        // Data
        templates: templatesQuery.data,
        draft: draftQuery.data,
        
        // Loading States
        isLoadingTemplates: templatesQuery.isLoading,
        isLoadingDraft: draftQuery.isLoading,
        isGenerating: generateEmailMutation.isPending,
        isUpdating: updateDraftMutation.isPending,
        isSending: sendEmailMutation.isPending,
        
        // Errors
        templatesError: templatesQuery.error,
        draftError: draftQuery.error,

        // Actions
        generateEmail: generateEmailMutation.mutateAsync,
        updateDraft: updateDraftMutation.mutateAsync,
        sendEmail: sendEmailMutation.mutateAsync,
        
        // Polling
        isPolling,
        startPolling,
        stopPolling,
    };
};
