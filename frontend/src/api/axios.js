import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS, logger } from '../utils/constants';
import { getStorage, removeStorage } from '../utils/helpers';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds
});

// Request interceptor - Add JWT token
api.interceptors.request.use(
    (config) => {
        // Skip adding token for auth endpoints (login, logout, password reset)
        const skipTokenUrls = ['/api/auth/login', '/api/auth/logout', '/api/auth/register', '/api/password/reset'];
        const shouldSkipToken = skipTokenUrls.some(url => config.url?.includes(url));

        if (!shouldSkipToken) {
            const token = getStorage(STORAGE_KEYS.TOKEN);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        // Debug logging
        logger.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
            params: config.params,
            data: config.data,
        });

        return config;
    },
    (error) => {
        logger.error('[API Request Error]', error);
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
    (response) => {
        logger.log(`[API Response] ${response.config.url}`, {
            status: response.status,
            data: response.data,
        });
        return response;
    },
    (error) => {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;

        logger.error('[API Response Error]', {
            status,
            message,
            url: error.config?.url,
        });

        // Handle 401 Unauthorized - Token expired or invalid
        if (status === 401) {
            logger.warn('Unauthorized - Clearing session and redirecting to login');
            removeStorage(STORAGE_KEYS.TOKEN);
            removeStorage(STORAGE_KEYS.USER);

            // Redirect to login page if not already there
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        // Handle 403 Forbidden - Access denied
        if (status === 403) {
            logger.warn('Access Denied - Insufficient permissions');
        }

        return Promise.reject(error);
    }
);

export default api;
