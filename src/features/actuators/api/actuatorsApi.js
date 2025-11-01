import api from '../../../lib/api';

export const createActuator = (data) => api.post('actuators', data);

export const getActuatorById = (actuatorId) => api.get(`actuators/${actuatorId}`);

export const updateActuator = (actuatorId, data) => api.put(`actuators/${actuatorId}`, data);

export const deleteActuator = (actuatorId) => api.delete(`actuators/${actuatorId}`);

export const getActuatorsByStage = (stageId) => api.get(`actuators/stage/${stageId}`);

export const getMyActuatorsByDevice = (deviceId) => api.get(`actuators/device/${deviceId}`);