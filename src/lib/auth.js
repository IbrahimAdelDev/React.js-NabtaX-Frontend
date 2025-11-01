import axios from "axios";

export const saveToken = (token, refreshToken = false) => {
  refreshToken ? localStorage.setItem('refreshToken', token) :
    localStorage.setItem('token', token);
};

export const getToken = (refreshToken = false) => {
  return refreshToken ? localStorage.getItem('refreshToken') :
    localStorage.getItem('token');
};

export const deviceUUID = () => localStorage.getItem('deviceUUID');

export const removeTokens = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
};

export const isAuthenticated = async () => {
  const refreshToken = getToken(true);
  const deviceUUID = deviceUUID();

  const res = await axios.post(`${import.meta.env.BACKEND_URL || 'http://localhost:5000/api/v1'}/auth/refresh-token`, {
    headers: {
      "x-refreshToken": refreshToken,
      "x-device-uuid": deviceUUID,
    },
  });

  const { accessToken, newRefreshToken } = res.data.data;
  if (accessToken) saveToken(accessToken);
  if (newRefreshToken) saveToken(newRefreshToken, true);

  return !!accessToken;
};

export const saveUser = (user) => localStorage.setItem('user', JSON.stringify(user));

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const removeUser = () => localStorage.removeItem('user');