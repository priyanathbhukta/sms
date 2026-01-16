import api from './axios';
import { logger } from '../utils/constants';

/**
 * Student API endpoints
 */
export const studentApi = {
    // Attendance
    getMyAttendance: async (studentId) => {
        logger.info('Fetching my attendance');
        const response = await api.get(`/api/attendance/student/${studentId}`);
        return response.data;
    },

    // Results
    getMyResults: async (studentId) => {
        logger.info('Fetching my results');
        const response = await api.get(`/api/results/student/${studentId}`);
        return response.data;
    },

    // Payments
    makePayment: async (data) => {
        logger.info('Making payment', data);
        const response = await api.post('/api/payments', data);
        return response.data;
    },

    getMyPayments: async (studentId) => {
        logger.info('Fetching my payments');
        const response = await api.get(`/api/payments/student/${studentId}`);
        return response.data;
    },

    // Book Requests
    requestBook: async (data) => {
        logger.info('Requesting book', data);
        const response = await api.post('/api/book-requests', data);
        return response.data;
    },

    getMyBookRequests: async (page = 0, size = 10) => {
        logger.info('Fetching my book requests');
        const response = await api.get('/api/book-requests/my-requests', {
            params: { page, size }
        });
        return response.data;
    },

    cancelBookRequest: async (requestId) => {
        logger.info('Cancelling book request', requestId);
        const response = await api.put(`/api/book-requests/${requestId}/cancel`);
        return response.data;
    },

    // Admin Requests
    submitRequest: async (data) => {
        logger.info('Submitting admin request', data);
        const response = await api.post('/api/admin-requests', data);
        return response.data;
    },

    getMyRequests: async (userId) => {
        logger.info('Fetching my requests');
        const response = await api.get(`/api/admin-requests/user/${userId}`);
        return response.data;
    },

    // Events
    getEvents: async () => {
        logger.info('Fetching events');
        const response = await api.get('/api/events');
        return response.data;
    },

    getUpcomingEvents: async () => {
        logger.info('Fetching upcoming events');
        const response = await api.get('/api/events/upcoming');
        return response.data;
    },

    registerForEvent: async (data) => {
        logger.info('Registering for event', data);
        const response = await api.post('/api/event-participants', data);
        return response.data;
    },

    getMyEventParticipations: async (userId) => {
        logger.info('Fetching my event registrations');
        const response = await api.get(`/api/event-participants/user/${userId}`);
        return response.data;
    },

    // Announcements
    getAnnouncements: async () => {
        logger.info('Fetching general announcements');
        const response = await api.get('/api/announcements/general');
        return response.data;
    },

    // Profile
    getMyProfile: async () => {
        logger.info('Fetching my profile');
        const response = await api.get('/api/student/profile');
        return response.data;
    },

    updateMyProfile: async (data) => {
        logger.info('Updating my profile', data);
        const response = await api.put('/api/student/profile', data);
        return response.data;
    },

    uploadProfileImage: async (file) => {
        logger.info('Uploading profile image');
        const formData = new FormData();
        formData.append('image', file);
        const response = await api.post('/api/student/profile/image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Class-specific announcements
    getMyAnnouncements: async (studentId) => {
        logger.info('Fetching my announcements (general + class-specific)');
        const response = await api.get(`/api/student/${studentId}/announcements`);
        return response.data;
    },
};

export default studentApi;
