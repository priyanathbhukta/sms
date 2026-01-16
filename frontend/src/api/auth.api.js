import api from './axios';
import { logger } from '../utils/constants';

/**
 * Authentication API endpoints
 */
export const authApi = {
    /**
     * Login user
     * @param {Object} credentials - { email, password }
     */
    login: async (credentials) => {
        logger.info('Attempting login for:', credentials.email);
        const response = await api.post('/api/auth/login', credentials);
        return response.data;
    },

    /**
     * Register user
     * @param {Object} userData - Registration data
     */
    register: async (userData) => {
        logger.info('Registering user:', userData.email);
        const response = await api.post('/api/auth/register', userData);
        return response.data;
    },

    /**
     * Logout user
     */
    logout: async () => {
        logger.info('Logging out user');
        const response = await api.post('/api/auth/logout');
        return response.data;
    },
};

export default authApi;
