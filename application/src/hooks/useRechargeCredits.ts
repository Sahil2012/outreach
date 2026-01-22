// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { useApi } from './useApi';

// export const useRechargeCredits = () => {
//   const api = useApi();
//   const queryClient = useQueryClient();

//   const rechargeCredits = async (amount: number): Promise<void> => {
//     await api.patch('/profile/rechargeCredits', { amount });
//   };

//   const mutation = useMutation({
//     mutationFn: rechargeCredits,
//     onSuccess: () => {
//       // Invalidate and refetch profile to get updated credits
//       queryClient.invalidateQueries({ queryKey: ['profile'] });
//     },
//   });

//   return {
//     rechargeCredits: mutation.mutateAsync,
//     isRecharging: mutation.isPending,
//     error: mutation.error,
//   };
// };
