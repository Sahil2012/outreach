import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from './useApi';
import { Profile } from '@/lib/types';
import { useUser } from '@clerk/clerk-react';

export const useProfile = () => {
    const { user } = useUser();
    const api = useApi();
    const queryClient = useQueryClient();

    const fetchProfile = async (): Promise<Profile> => {
        const { data } = await api.get('/profile');
        return data;
    };

    const updateProfile = async (data: Profile) => {
        if (!user) {
            throw new Error('User not found');
        }
        await user.update({
            firstName: data.firstName,
            lastName: data.lastName,
        });
        const response = await api.patch('/profile', data);
        return response.data;
    };

    const profileQuery = useQuery({
        queryKey: ['profile'],
        queryFn: fetchProfile,
        retry: false,
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
        refetch: profileQuery.refetch,
    };
};
