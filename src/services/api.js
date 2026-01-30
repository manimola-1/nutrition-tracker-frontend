import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (refreshToken) {
                    const response = await axios.post(
                        `${process.env.REACT_APP_API_URL}/accounts/token/refresh/`,
                        { refresh: refreshToken }
                    );
                    const { access } = response.data;
                    localStorage.setItem('access_token', access);
                    originalRequest.headers.Authorization = `Bearer ${access}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed, logout user
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Auth API methods
export const authAPI = {
    register: async (userData) => {
        const response = await api.post('/accounts/register/', userData);
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post('/accounts/login/', credentials);
        return response.data;
    },

    logout: async () => {
        try {
            await api.post('/accounts/logout/');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
        }
    },

    getProfile: async () => {
        const response = await api.get('/accounts/profile/');
        return response.data;
    },

    updateProfile: async (userData) => {
        const response = await api.put('/accounts/profile/', userData);
        return response.data;
    },

    changePassword: async (passwordData) => {
        const response = await api.post('/accounts/change-password/', passwordData);
        return response.data;
    },

    requestPasswordReset: async (email) => {
        const response = await api.post('/accounts/password-reset-request/', { email });
        return response.data;
    },

    resetPassword: async (token, newPassword, newPasswordConfirm) => {
        const response = await api.post('/accounts/password-reset/', {
            token,
            new_password: newPassword,
            new_password_confirm: newPasswordConfirm,
        });
        return response.data;
    },
};

// Patients API methods
export const patientsAPI = {
    getAll: async () => {
        const response = await api.get('/patients/');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/patients/${id}/`);
        return response.data;
    },

    create: async (patientData) => {
        const response = await api.post('/patients/', patientData);
        return response.data;
    },

    update: async (id, patientData) => {
        const response = await api.put(`/patients/${id}/`, patientData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/patients/${id}/`);
        return response.data;
    },

    getHistory: async (id) => {
        const response = await api.get(`/patients/${id}/history/`);
        return response.data;
    },

    getDay: async (id, day) => {
        const response = await api.get(`/patients/${id}/day/`, {
            params: { day: day }
        });
        return response.data;
    },
};

// Patient Days API methods
export const patientDaysAPI = {
    getAll: async () => {
        const response = await api.get('/patient-days/');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/patient-days/${id}/`);
        return response.data;
    },

    create: async (dayData) => {
        const response = await api.post('/patient-days/', dayData);
        return response.data;
    },

    update: async (id, dayData) => {
        const response = await api.put(`/patient-days/${id}/`, dayData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/patient-days/${id}/`);
        return response.data;
    },
};

// Preparations API methods
export const preparationsAPI = {
    getAll: async () => {
        const response = await api.get('/preparations/');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/preparations/${id}/`);
        return response.data;
    },

    create: async (preparationData) => {
        const response = await api.post('/preparations/', preparationData);
        return response.data;
    },

    update: async (id, preparationData) => {
        const response = await api.put(`/preparations/${id}/`, preparationData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/preparations/${id}/`);
        return response.data;
    },
};

export default api;
