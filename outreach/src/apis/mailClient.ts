import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const mailClient = axios.create({
  baseURL: BASE_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default mailClient;
