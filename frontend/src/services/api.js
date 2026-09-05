import axios from 'axios';

// The backend runs on port 5000 in dev
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and trigger logout if unauthorized
      localStorage.removeItem('token');
      // A full reload or custom event would be better here, but this handles it basically.
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    const formattedError = error.response?.data || {
      status: 'error',
      error: { message: error.message || 'Network Error' }
    };
    return Promise.reject(formattedError);
  }
);

export const productApi = {
  getProducts: (params) => api.get('/products', { params }),
  getProductBySlug: (slug) => api.get(`/products/${slug}`),
  
  // Admin endpoints
  getAdminProducts: (params) => api.get('/products/admin/all', { params }),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.patch(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  uploadImage: (id, file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post(`/products/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteImage: (id, imageId) => api.delete(`/products/${id}/images/${imageId}`),
};

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

export const categoryApi = {
  getCategories: () => api.get('/categories'),
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.patch(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
};

export const mediaApi = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteImage: (publicId) => api.delete('/media', { data: { publicId } }),
};

export const aiApi = {
  processImage: (data) => api.post('/ai/image-process', data),
  generateContent: (data) => api.post('/ai/content-generate', data),
  getJobStatus: (jobId) => api.get(`/ai/jobs/${jobId}`),
  retryJob: (jobId) => api.post(`/ai/jobs/${jobId}/retry`),
  applyContent: (jobId) => api.post(`/ai/jobs/${jobId}/apply`),
};

export const settingsApi = {
  getSettings: () => api.get('/settings'),
  updateSettings: (data) => api.patch('/settings', data),
};

export default api;
