import { useApi } from './useApi';

export const useMail = () => {
  const api = useApi();

  const generateMail = async (data: object) => {
    const response = await api.post('/generateMail', data);
    return response.data;
  };

  const sendMail = async (data: object) => {
    const response = await api.post('/sendEmail', data);
    return response.data;
  };

  return {
    generateMail,
    sendMail,
  };
};
