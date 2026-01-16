import api from './axios';
import { logger } from '../utils/constants';

/**
 * Admin API endpoints
 */
export const adminApi = {
    // Dashboard
    getDashboardStats: async () => {
        logger.info('Fetching admin dashboard stats');
        const response = await api.get('/api/admin/users/dashboard');
        return response.data;
    },

    // Students
    getStudents: async (page = 0, size = 10, sortBy = 'firstName') => {
        logger.info('Fetching students', { page, size, sortBy });
        const response = await api.get('/api/admin/users/students', {
            params: { page, size, sortBy }
        });
        return response.data;
    },

    searchStudents: async (name, page = 0, size = 10) => {
        logger.info('Searching students', { name, page, size });
        const response = await api.get('/api/admin/users/students/search', {
            params: { name, page, size }
        });
        return response.data;
    },

    // Faculty
    getFaculty: async (page = 0, size = 10, sortBy = 'firstName') => {
        logger.info('Fetching faculty', { page, size, sortBy });
        const response = await api.get('/api/admin/users/faculty', {
            params: { page, size, sortBy }
        });
        return response.data;
    },

    searchFaculty: async (name, page = 0, size = 10) => {
        logger.info('Searching faculty', { name, page, size });
        const response = await api.get('/api/admin/users/faculty/search', {
            params: { name, page, size }
        });
        return response.data;
    },

    // Librarians
    getLibrarians: async (page = 0, size = 10) => {
        logger.info('Fetching librarians', { page, size });
        const response = await api.get('/api/admin/users/librarians', {
            params: { page, size }
        });
        return response.data;
    },

    createLibrarian: async (data) => {
        logger.info('Creating librarian', data);
        const response = await api.post('/api/admin/librarians/create', data);
        return response.data;
    },

    // Admin Registration (New Flow)
    registerStudent: async (data) => {
        logger.info('Registering student', data);
        const response = await api.post('/api/admin/register/student', data);
        return response.data;
    },

    registerFaculty: async (data) => {
        logger.info('Registering faculty', data);
        const response = await api.post('/api/admin/register/faculty', data);
        return response.data;
    },

    registerLibrarian: async (data) => {
        logger.info('Registering librarian', data);
        const response = await api.post('/api/admin/register/librarian', data);
        return response.data;
    },

    // Classes
    getClasses: async () => {
        logger.info('Fetching classes');
        const response = await api.get('/api/classes');
        return response.data;
    },

    createClass: async (data) => {
        logger.info('Creating class', data);
        const response = await api.post('/api/classes', data);
        return response.data;
    },

    assignStudentToClass: async (studentId, classId) => {
        logger.info('Assigning student to class', { studentId, classId });
        const response = await api.put(`/api/classes/${classId}/students/${studentId}`);
        return response.data;
    },

    // Subjects
    getSubjects: async () => {
        logger.info('Fetching subjects');
        const response = await api.get('/api/subjects');
        return response.data;
    },

    createSubject: async (data) => {
        logger.info('Creating subject', data);
        const response = await api.post('/api/subjects', data);
        return response.data;
    },

    // Courses
    getCourses: async () => {
        logger.info('Fetching courses');
        const response = await api.get('/api/courses');
        return response.data;
    },

    createCourse: async (data) => {
        logger.info('Creating course', data);
        const response = await api.post('/api/courses', data);
        return response.data;
    },

    // Fee Structure
    getFees: async () => {
        logger.info('Fetching fee structures');
        const response = await api.get('/api/fees');
        return response.data;
    },

    createFee: async (data) => {
        logger.info('Creating fee structure', data);
        const response = await api.post('/api/fees', data);
        return response.data;
    },

    deleteFee: async (id) => {
        logger.info('Deleting fee structure', id);
        const response = await api.delete(`/api/fees/${id}`);
        return response.data;
    },

    // Admin Requests
    getAdminRequests: async () => {
        logger.info('Fetching admin requests');
        const response = await api.get('/api/admin-requests');
        return response.data;
    },

    getRequestsByStatus: async (status) => {
        logger.info('Fetching requests by status', status);
        const response = await api.get(`/api/admin-requests/status/${status}`);
        return response.data;
    },

    updateRequestStatus: async (requestId, status, adminComments) => {
        logger.info('Updating request status', { requestId, status, adminComments });
        const response = await api.put(`/api/admin-requests/${requestId}/status`, null, {
            params: { status, adminComments }
        });
        return response.data;
    },

    // Student CRUD
    getStudentById: async (id) => {
        logger.info('Fetching student by ID', { id });
        const response = await api.get(`/api/students/${id}`);
        return response.data;
    },

    updateStudent: async (id, data) => {
        logger.info('Updating student', { id, data });
        const response = await api.put(`/api/students/${id}`, data);
        return response.data;
    },

    deleteStudent: async (id) => {
        logger.info('Deleting student', { id });
        const response = await api.delete(`/api/students/${id}`);
        return response.data;
    },

    // Faculty CRUD
    getFacultyById: async (id) => {
        logger.info('Fetching faculty by ID', { id });
        const response = await api.get(`/api/faculty/${id}`);
        return response.data;
    },

    updateFaculty: async (id, data) => {
        logger.info('Updating faculty', { id, data });
        const response = await api.put(`/api/faculty/${id}`, data);
        return response.data;
    },

    deleteFaculty: async (id) => {
        logger.info('Deleting faculty', { id });
        const response = await api.delete(`/api/faculty/${id}`);
        return response.data;
    },

    // Librarian CRUD
    getLibrarianById: async (id) => {
        logger.info('Fetching librarian by ID', { id });
        const response = await api.get(`/api/admin/librarians/${id}`);
        return response.data;
    },

    updateLibrarian: async (id, data) => {
        logger.info('Updating librarian', { id, data });
        const response = await api.put(`/api/admin/librarians/${id}`, data);
        return response.data;
    },

    deleteLibrarian: async (id) => {
        logger.info('Deleting librarian', { id });
        const response = await api.delete(`/api/admin/librarians/${id}`);
        return response.data;
    },
};

export default adminApi;
