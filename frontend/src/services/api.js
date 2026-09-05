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
    // We don't have customer auth in this app (only admin),
    // but if we did, we'd attach the token here.
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data, // Strip axios wrapper, return our API standard response
  (error) => {
    // Format error to match our API standard AppError format
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
};

export const categoryApi = {
  getCategories: () => api.get('/categories'),
};

export const settingsApi = {
  getSettings: () => api.get('/settings'), // Assuming a public settings endpoint exists
};

export default api;
