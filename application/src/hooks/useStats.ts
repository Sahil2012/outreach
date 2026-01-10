import { OutreachStats } from '@/lib/types';
import { useApi } from './useApi';
import { useQuery } from '@tanstack/react-query';

const useStats = () => {
  const api = useApi();

  // Stats Query
  const statsQuery = useQuery({
    queryKey: ["outreach", "stats"],
    queryFn: async (): Promise<OutreachStats> => {
      const response = await api.get<OutreachStats>("/stats");
      return response.data;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  return {
    stats: statsQuery.data,
    isLoadingStats: statsQuery.isLoading,
    statsError: statsQuery.error,
  }
}

export default useStats