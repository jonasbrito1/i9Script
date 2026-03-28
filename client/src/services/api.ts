import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: any) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me')
};

// Projects
export const projectsAPI = {
  getAll: (status?: string) =>
    api.get('/projects', { params: { status } }),
  getById: (id: number) => api.get(`/projects/${id}`),
  create: (data: any) => api.post('/projects', data),
  update: (id: number, data: any) => api.patch(`/projects/${id}`, data),
  addUpdate: (id: number, data: any) =>
    api.post(`/projects/${id}/updates`, data),
  getStats: () => api.get('/projects/stats')
};

// Tickets
export const ticketsAPI = {
  getAll: (filters?: any) => api.get('/tickets', { params: filters }),
  getById: (id: number) => api.get(`/tickets/${id}`),
  create: (data: any) => api.post('/tickets', data),
  update: (id: number, data: any) => api.patch(`/tickets/${id}`, data),
  addComment: (id: number, comment: string, is_internal: boolean = false) =>
    api.post(`/tickets/${id}/comments`, { comment, is_internal }),
  getStats: () => api.get('/tickets/stats')
};
