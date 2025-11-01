export const formatDate = (date) => new Date(date).toLocaleDateString();

export const formatTime = (date) => new Date(date).toLocaleTimeString();

export const formatDateTime = (date) => new Date(date).toLocaleString();

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);