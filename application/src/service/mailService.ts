import mailClient from '../apis/mailClient';

export const generateMail = async (data : object) => {
  const response = await mailClient.post('/generateMail', data);
  return response.data;
};

export const sendMail = async (data : object) => {
  const response = await mailClient.post('/sendEmail', data);
  return response.data;
};
