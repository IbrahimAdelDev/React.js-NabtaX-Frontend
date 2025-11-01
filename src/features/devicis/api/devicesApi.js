import api from '../../../lib/api';

export const createDevice = (data) => api.post('devices', data);

export const getDeviceById = (deviceId) => api.get(`devices/${deviceId}`);

export const getMyDevicesByGarden = (gardenId) => api.get(`devices/garden/${gardenId}`);