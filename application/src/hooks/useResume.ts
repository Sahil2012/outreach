import { useMutation } from '@tanstack/react-query';
import { useApi } from './useApi';

export const useResume = () => {
  const api = useApi();

  const uploadResumeMutation = useMutation({
    throwOnError: true,
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('autofill', 'true');

      const response = await api.put('/profile/resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
  });

  return {
    uploadResume: uploadResumeMutation.mutateAsync,
    isLoading: uploadResumeMutation.isPending,
  };
};
