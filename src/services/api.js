import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const employeeAPI = {
  getAll: () => api.get('/employee'),
  getById: (employeeId) => api.get(`/employee/${employeeId}`),
  create: (data) => api.post('/employee', data),
  update: (employeeId, data) => api.put(`/employee/${employeeId}`, data),
  delete: (id) => api.delete(`/employee/${id}`),
};

export const departmentAPI = {
  getAll: () => api.get('/departement'),
  getById: (id) => api.get(`/departement/${id}`),
  create: (data) => api.post('/departement', data),
  update: (id, data) => api.put(`/departement/${id}`, data),
  delete: (id) => api.delete(`/departement/${id}`),
};

export const attendanceAPI = {
  getAll: (params = {}) => api.get('/attendance', { params }),
  attendanceIn: (data) => api.post('/attendance/in', data),
  attendanceOut: (data) => api.put('/attendance/out', data),
};

export default api;
