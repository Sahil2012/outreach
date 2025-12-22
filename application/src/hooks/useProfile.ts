import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from './useApi';
import { Profile } from '@/lib/types';
import { useUser } from '@clerk/clerk-react';
import { useState } from 'react';

export const useProfile = () => {
  const { user } = useUser();
  const api = useApi();
  const queryClient = useQueryClient();

  const [isPollingProfile, setIsPollingProfile] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();

  const pollProfile = () => {
    setIsPollingProfile(true);
    const intervalId = setInterval(async () => {
      await profileQuery.refetch();
    }, 2000);
    setIntervalId(intervalId);
  };

  const stopPollingProfile = () => {
    setIsPollingProfile(false);
    clearInterval(intervalId);
  };

  const fetchProfile = async (): Promise<Profile> => {
    const { data } = await api.get('/profile');
    return data;
  };

  const updateProfile = async (data: Profile) => {
    if (!user) {
      throw new Error('User not found');
    }
    await user.update({
      firstName: data.firstName ? data.firstName : user.firstName,
      lastName: data.lastName ? data.lastName : user.lastName,
    });
    const response = await api.patch('/profile', data);
    return response.data;
  };

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    error: profileQuery.error,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
    pollProfile,
    stopPollingProfile,
    isPollingProfile,
  };
};
