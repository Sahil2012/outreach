import { useMutation } from '@tanstack/react-query';
import { useApi } from './useApi';

export const useResume = () => {
    const api = useApi();

    const uploadResumeMutation = useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append('resume', file);

            const response = await api.post('/profile/resume/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        },
    });

    const deleteResumeMutation = useMutation({
        mutationFn: async () => {
            await api.delete('/profile/resume/upload');
        },
    });

    return {
        uploadResume: uploadResumeMutation.mutateAsync,
        deleteResume: deleteResumeMutation.mutateAsync,
        isLoading: uploadResumeMutation.isPending || deleteResumeMutation.isPending,
        uploadError: uploadResumeMutation.error,
        deleteError: deleteResumeMutation.error,
        resetUploadError: uploadResumeMutation.reset,
        resetDeleteError: deleteResumeMutation.reset,
    };
};
