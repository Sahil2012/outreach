import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from './useApi';
import { useUser } from '@clerk/clerk-react';

export type OnboardingStep = 'checking' | 'basic-info' | 'professional-info' | 'completed';

export const useOnboarding = () => {
  const api = useApi();
  const { user, isLoaded: isUserLoaded } = useUser();
  const queryClient = useQueryClient();

  const fetchOnboardingStatus = async (): Promise<{ isOnboarded: boolean; step: OnboardingStep }> => {
    if (!user) {
      return { isOnboarded: false, step: 'checking' };
    }

    try {
      // 1. Check readiness
      const readinessResponse = await api.get('/profile/readiness');

      if (readinessResponse.data.status === 'completed') {
        return { isOnboarded: true, step: 'completed' };
      }
    } catch (err) {
      console.error("Readiness check failed:", err);
      const error = new Error("We were unable to verify account readiness. Please check your internet connection and try again.");
      error.name = "Unable to reach servers"
      throw error;
    }

    // 2. Check profile for basic info
    try {
      const profileResponse = await api.get('/profile');
      const { firstName, lastName } = profileResponse.data;

      if (firstName && lastName) {
        return { isOnboarded: false, step: 'professional-info' };
      } else {
        return { isOnboarded: false, step: 'basic-info' };
      }
    } catch (profileError) {
      console.error("Profile check failed:", profileError);
      const error = new Error("Unable to retrieve profile information. Please verify your connection.");
      error.name = "Unable to reach servers"
      throw error;
    }
  };

  const updateOnboardingStatus = async (status: string) => {
    const response = await api.put('/onboarding/readiness', { status });
    return response.data;
  }

  const onboardingQuery = useQuery({
    queryKey: ['onboardingStatus', user?.id],
    queryFn: fetchOnboardingStatus,
    enabled: !!user && isUserLoaded,
    retry: false,
    throwOnError: true,
  });

  const updateOnboardingMutation = useMutation({
    mutationFn: updateOnboardingStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboardingStatus'] });
    }
  })

  return {
    isOnboarded: onboardingQuery.data?.isOnboarded ?? false,
    onboardingStep: onboardingQuery.data?.step ?? 'checking',
    isLoading: onboardingQuery.isLoading || !isUserLoaded,
    checkOnboardingStatus: onboardingQuery.refetch,
    completeOnboarding: updateOnboardingMutation.mutateAsync,
  };
};
