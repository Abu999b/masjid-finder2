import axios from 'axios';

const API_URL = 'http://localhost:5000/api'|| process.env.REACT_APP_API_URL ;

console.log('🔗 API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('API Error Response:', error.response.data);
    } else if (error.request) {
      console.error('API No Response:', error.request);
    } else {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  getAllUsers: () => api.get('/auth/users'),
  updateUserRole: (userId, role) => api.put(`/auth/users/${userId}/role`, { role })
};

// Masjid API
export const masjidAPI = {
  getAll: () => api.get('/masjids'),
  getNearby: (longitude, latitude, maxDistance = 5000) => 
    api.get(`/masjids/nearby?longitude=${longitude}&latitude=${latitude}&maxDistance=${maxDistance}`),
  getById: (id) => api.get(`/masjids/${id}`),
  create: (data) => api.post('/masjids', data),
  update: (id, data) => api.put(`/masjids/${id}`, data),
  delete: (id) => api.delete(`/masjids/${id}`)
};

// Request API
export const requestAPI = {
  create: (data) => api.post('/requests', data),
  getAll: (params) => api.get('/requests', { params }),
  getMyRequests: () => api.get('/requests/my-requests'),
  process: (id, data) => api.put(`/requests/${id}/process`, data),
  delete: (id) => api.delete(`/requests/${id}`)
};

export default api;