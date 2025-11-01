import api from '../../../lib/api';

export const createSensor = (data) => api.post('sensors', data);

export const getSensorById = (sensorId) => api.get(`sensors/${sensorId}`);

export const updateSensor = (sensorId, data) => api.put(`sensors/${sensorId}`, data);

export const deleteSensor = (sensorId) => api.delete(`sensors/${sensorId}`);

export const getSensorsByStage = (stageId) => api.get(`sensors/stage/${stageId}`);

export const getMySensorsByDevice = (deviceId) => api.get(`sensors/device/${deviceId}`);