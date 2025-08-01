import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

// Task API
export const taskAPI = {
  getTasks: (filters = {}) => api.get('/tasks', { params: filters }),
  getTaskById: (id) => api.get(`/tasks/${id}`),
  createTask: (taskData) => {
    const formData = new FormData();
    
    // Add task data
    Object.keys(taskData).forEach(key => {
      if (key === 'documents') {
        // Handle documents separately
        if (taskData[key] && taskData[key].length > 0) {
          taskData[key].forEach((file, index) => {
            formData.append('documents', file);
          });
        }
      } else {
        formData.append(key, taskData[key]);
      }
    });
    
    return api.post('/tasks', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  updateTask: (id, taskData) => {
    const formData = new FormData();
    
    // Add task data
    Object.keys(taskData).forEach(key => {
      if (key === 'documents') {
        // Handle documents separately
        if (taskData[key] && taskData[key].length > 0) {
          taskData[key].forEach((file, index) => {
            formData.append('documents', file);
          });
        }
      } else {
        formData.append(key, taskData[key]);
      }
    });
    
    return api.put(`/tasks/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  downloadDocument: (taskId, documentId) => 
    api.get(`/tasks/${taskId}/documents/${documentId}`, {
      responseType: 'blob',
    }),
};

// User API
export const userAPI = {
  getUsers: (filters = {}) => api.get('/users', { params: filters }),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api; 