import { GeneratedEmail, MessageResponse } from '@/lib/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { useApi } from './useApi';
import { useMail } from './useMail';

export interface GenerateEmailPayload {
  contactName: string;
  contactEmail: string;
  companyName: string;
  role?: string;
  jobDescription: string;
  jobs: string[];
  type: string;
  threadId?: number;
}
export interface UpdateEmailPayload {
  subject?: string;
  body?: string;
  isDraftCompleted?: boolean;
}

export interface UseOutreachOptions {
  skipFetch?: boolean;
}

export const useOutreach = (messageId?: string | number, options?: UseOutreachOptions) => {
  const api = useApi();
  const { sendMail: sendMailApi, generateMail: generateMailApi } = useMail();
  const queryClient = useQueryClient();
  const [isPolling, setIsPolling] = useState(false);

  // Queries
  const draftQuery = useQuery({
    queryKey: ['outreach', 'message', messageId],
    queryFn: async (): Promise<GeneratedEmail> => {
      if (!messageId) throw new Error('Message ID is required');
      const response = await api.get<MessageResponse>(`/message/${messageId}`);
      // Mapping backend response to frontend expected structure
      const data = response.data;
      return {
        threadId: data.threadId,
        messageId: data.messageId,
        email: {
          subject: data.subject,
          body: data.body
        },
        isMailSent: data.state === 'SENT',
        isMailGenerated: true
      };
    },
    // enabled: !!messageId && !options?.skipFetch,
    refetchInterval: isPolling ? 2000 : false,
  });

  // Polling controls
  const startPolling = useCallback(() => setIsPolling(true), []);
  const stopPolling = useCallback(() => setIsPolling(false), []);

  // Mutations
  const generateEmailMutation = useMutation({
    mutationFn: async (payload: GenerateEmailPayload) => {
      const response = await generateMailApi(payload);
      return response;
    },
  });

  const updateMessageMutation = useMutation({
    mutationFn: async ({ messageId, subject, body }: { messageId: string | number, subject: string, body: string }) => {
      const response = await api.patch(`/message/edit/${messageId}`, { subject, body });
      return response.data;
    }
  });

  const updateDraftMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateEmailPayload }) => {
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
    mutationFn: async ({ threadId, messageId }: { threadId: number; messageId: number }) => {
      await sendMailApi({ threadId, messageId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outreach'] });
    }
  });

  return {
    // Data
    // templates: templatesQuery.data,
    draft: draftQuery.data,

    // Loading States
    // isLoadingTemplates: templatesQuery.isLoading,
    isLoadingDraft: draftQuery.isLoading,
    isGenerating: generateEmailMutation.isPending,
    isUpdating: updateDraftMutation.isPending || updateMessageMutation.isPending,
    isSending: sendEmailMutation.isPending,

    // Errors
    // templatesError: templatesQuery.error,
    draftError: draftQuery.error,

    // Actions
    generateEmail: generateEmailMutation.mutateAsync,
    updateDraft: updateDraftMutation.mutateAsync,
    updateMessage: updateMessageMutation.mutateAsync,
    sendEmail: sendEmailMutation.mutateAsync,

    // Polling
    isPolling,
    startPolling,
    stopPolling,
  };
};
