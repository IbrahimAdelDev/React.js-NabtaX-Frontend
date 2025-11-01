import api from '../../../lib/api';

const user = JSON.parse(localStorage.getItem('user'));

export const getMyGardens = () => api.get(`gardens/owner/${user.id}`);

export const createGarden = (data) => api.post('gardens', data);

export const getGardenById = (gardenId) => api.get(`gardens/${gardenId}`);

export const addEngineer = (gardenId, userId) =>
  api.post(`gardens/${gardenId}/add-engineer`, { gardenId, userId });

export const removeEngineer = (gardenId, userId) =>
  api.post(`gardens/${gardenId}/remove-engineer`, { gardenId, userId });

export const addWorker = (gardenId, userId) =>
  api.post(`gardens/${gardenId}/add-worker`, { gardenId, userId });

export const removeWorker = (gardenId, userId) =>
  api.post(`gardens/${gardenId}/remove-worker`, { gardenId, userId });

export const searchUsers = (query) => api.get(`users/search?query=${query}`);
