import axios from 'axios';

// --- Axios Instance ---
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Request Interceptor: Inject JWT ---
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ts_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response Interceptor: Handle 401 ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ts_token');
    }
    return Promise.reject(error.response?.data || error);
  }
);

// ==============================================================
// AUTH API
// ==============================================================
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
};

// ==============================================================
// DESTINATIONS API
// ==============================================================
export const destinationsAPI = {
  getAll: (params) => api.get('/destinations', { params }),
  getById: (id) => api.get(`/destinations/${id}`),
  create: (data) => api.post('/destinations', data),
  update: (id, data) => api.put(`/destinations/${id}`, data),
  delete: (id) => api.delete(`/destinations/${id}`),
};

// ==============================================================
// PACKAGES API
// ==============================================================
export const packagesAPI = {
  getAll: (params) => api.get('/packages', { params }),
  getById: (id) => api.get(`/packages/${id}`),
  getFeatured: () => api.get('/packages/featured'),
  getMyAdminPackages: () => api.get('/packages/admin/my'),
  create: (data) => api.post('/packages', data),
  update: (id, data) => api.put(`/packages/${id}`, data),
  delete: (id) => api.delete(`/packages/${id}`),
};

// ==============================================================
// HOTELS API
// ==============================================================
export const hotelsAPI = {
  getAll: (params) => api.get('/hotels', { params }),
  getById: (id) => api.get(`/hotels/${id}`),
  getByDestination: (destinationId) => api.get(`/hotels?destination=${destinationId}`),
  create: (data) => api.post('/hotels', data),
  update: (id, data) => api.put(`/hotels/${id}`, data),
  delete: (id) => api.delete(`/hotels/${id}`),
};

// ==============================================================
// BOOKINGS API
// ==============================================================
export const bookingsAPI = {
  create: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my'),
  getById: (id) => api.get(`/bookings/${id}`),
  cancel: (id) => api.patch(`/bookings/${id}/cancel`),
  adminGetAll: (params) => api.get('/bookings/admin/all', { params }),
  adminUpdateStatus: (id, status) => api.patch(`/bookings/${id}/status`, { status }),
};

// ==============================================================
// ADMIN API
// ==============================================================
export const adminAPI = {
  getSystemStatus: () => api.get('/admin/status'),
  getDashboardStats: () => api.get('/admin/stats'),
  getRecentBookings: () => api.get('/admin/bookings/recent'),
  getRevenueSummary: () => api.get('/admin/revenue'),
  updateBookingStatus: (id, status) => api.put(`/admin/bookings/${id}/status`, { status }),
};

export default api;
