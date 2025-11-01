import axios from 'axios';
import { getDeviceUUID } from './deviceUUID';


const api = axios.create({
  baseURL: import.meta.env.BACKEND_URL || 'http://localhost:5000/api/v1',
  // withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const deviceUUID = getDeviceUUID();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (deviceUUID) {
    config.headers['x-device-uuid'] = deviceUUID;
  }
  return config;
});

export default api;