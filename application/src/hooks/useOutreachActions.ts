import { useApi } from './useApi';
import { Template, GeneratedEmail } from '@/lib/types';

interface GenerateEmailPayload {
    employeeName: string;
    employeeEmail: string;
    companyName: string;
    jobId?: string;
    jobDescription: string;
    templateId: string;
}

interface UpdateEmailPayload {
    subject?: string;
    body?: string;
    isDraftCompleted?: boolean;
}

export const useOutreachActions = () => {
    const api = useApi();

    const fetchTemplates = async (): Promise<Template[]> => {
        const response = await api.get<Template[]>('/outreach/types');
        return response.data;
    };

    const getDraft = async (id: string): Promise<{ id: string } & GenerateEmailPayload & GeneratedEmail> => {
        const response = await api.get(`/outreach/drafts/${id}`);
        return response.data;
    };

    const generateEmail = async (payload: GenerateEmailPayload): Promise<{ id: string; email: GeneratedEmail }> => {
        const draft = payload;
        const response = await api.post<any>('/outreach/drafts', draft);
        return response.data;
    };

    const updateEmail = async (id: string, payload: UpdateEmailPayload): Promise<void> => {
        // If payload has subject/body, wrap in email object
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
    };

    const sendEmail = async (id: string, manageThread: boolean): Promise<void> => {
        await api.post('/outreach/send', { id, manageThread });
    };

    return {
        fetchTemplates,
        getDraft,
        generateEmail,
        updateEmail,
        sendEmail,
    };
};
