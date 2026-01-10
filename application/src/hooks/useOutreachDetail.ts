import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from './useApi';
import { ThreadMetaItem, ThreadStatus } from '@/lib/types';
import { useMail } from './useMail';

export interface Message {
  subject: string;
  body: string;
  dateSent: string;
  fromUser: boolean;
  messageId: string;
  state: "DRAFT" | "SENT"
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  company: string;
  position: string;
}

export interface OutreachDetail extends ThreadMetaItem {
  threadId: number;
  status: ThreadStatus;
  isAutomated: boolean;
  externalThreadId: string;
  createdAt: string;
  lastUpdated: string;
  jobs: any[];
  employee: Employee
  messages: Message[];
}

export const useOutreachDetail = (id?: number) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { generateMail: generateMailApi } = useMail();

  const detailQuery = useQuery({
    queryKey: ['outreach', 'detail', id],
    queryFn: async (): Promise<OutreachDetail> => {
      if (!id) throw new Error('ID is required');
      const response = await api.get<OutreachDetail>(`/thread/${id}`);
      return {
        ...response.data,
        automated: response.data.isAutomated
      };
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ status }: { status: string }) => {
      if (!id) return;
      return await api.patch(`/thread/${id}`, { status });
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
      return await api.patch(`/thread/${id}`, { isAutomated });
    },
    onSuccess: (data: any) => {
      queryClient.setQueryData(['outreach', 'detail', id], (prevData: OutreachDetail | undefined) => {
        if (!prevData) return data;
        return {
          ...prevData,
          isAutomated: data?.data?.automated || !prevData.isAutomated
        };
      });
      queryClient.invalidateQueries({ queryKey: ['outreach', 'detail', id] });
      queryClient.invalidateQueries({ queryKey: ['outreach', 'list'] });
    },
  });

  const generateFollowUpMutation = useMutation({
    mutationFn: async () => {
      if (!id) return;
      return await generateMailApi({ threadId: id, type: "FOLLOWUP" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outreach', 'detail', id] });
      queryClient.invalidateQueries({ queryKey: ['outreach', 'list'] });
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

    generateFollowUp: generateFollowUpMutation.mutateAsync,
    isGeneratingFollowUp: generateFollowUpMutation.isPending
  };
};
