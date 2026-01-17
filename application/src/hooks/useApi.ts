import { useAuth } from '@clerk/clerk-react';
import axios, { AxiosInstance } from 'axios';
import { useMemo } from 'react';
import { useNavigate } from 'react-router';

export const useApi = (): AxiosInstance => {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const api = useMemo(() => {
    const baseURL = import.meta.env.VITE_BACKEND_BASE_URL;

    if (!baseURL) {
      throw new Error('VITE_BACKEND_BASE_URL is not defined');
    }

    const instance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    instance.interceptors.request.use(
      async (config) => {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          navigate('/login');
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        // Example: Handle global 401 Unauthorized errors
        if (error?.response?.status === 401) {
          console.error("Authentication expired or invalid. Prompting re-sign-in...");
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, [getToken]);

  return api;
};
