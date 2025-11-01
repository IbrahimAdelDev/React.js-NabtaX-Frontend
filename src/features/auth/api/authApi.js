import api from '../../../lib/api';

export const signin = (data) => api.post('auth/register', data);
export const login = (data) => api.post('auth/login', data);
export const verifyToken = () => api.post('auth/verify-token');
export const logout = () => api.post('auth/logout');