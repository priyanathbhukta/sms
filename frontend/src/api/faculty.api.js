import api from './axios';
import { logger } from '../utils/constants';

/**
 * Faculty API endpoints
 */
export const facultyApi = {
    // Dashboard
    getStats: async () => {
        logger.info('Fetching faculty stats');
        const response = await api.get('/api/faculty/dashboard/stats');
        return response.data;
    },

    getMyProfile: async () => {
        logger.info('Fetching faculty profile');
        const response = await api.get('/api/faculty/dashboard/profile');
        return response.data;
    },

    getMyClasses: async () => {
        logger.info('Fetching faculty classes');
        const response = await api.get('/api/faculty/dashboard/my-classes');
        return response.data;
    },

    getMyStudents: async (page = 0, size = 10) => {
        logger.info('Fetching faculty students');
        const response = await api.get('/api/faculty/dashboard/my-students', {
            params: { page, size }
        });
        return response.data;
    },

    getStudentsInClass: async (classId) => {
        logger.info('Fetching students in class', classId);
        const response = await api.get(`/api/faculty/dashboard/class/${classId}/students`);
        return response.data;
    },

    // Attendance
    markAttendance: async (data) => {
        logger.info('Marking attendance', data);
        const response = await api.post('/api/attendance/mark', data);
        return response.data;
    },

    getStudentAttendance: async (studentId) => {
        logger.info('Fetching student attendance', studentId);
        const response = await api.get(`/api/attendance/student/${studentId}`);
        return response.data;
    },

    // Exams
    createExam: async (data) => {
        logger.info('Creating exam', data);
        const response = await api.post('/api/exams', data);
        return response.data;
    },

    getExams: async () => {
        logger.info('Fetching exams');
        const response = await api.get('/api/exams');
        return response.data;
    },

    getExamsByCourse: async (courseId) => {
        logger.info('Fetching exams by course', courseId);
        const response = await api.get(`/api/exams/course/${courseId}`);
        return response.data;
    },

    // Results
    enterResult: async (data) => {
        logger.info('Entering result', data);
        const response = await api.post('/api/results', data);
        return response.data;
    },

    getResultsByExam: async (examId) => {
        logger.info('Fetching results by exam', examId);
        const response = await api.get(`/api/results/exam/${examId}`);
        return response.data;
    },

    // Announcements
    createAnnouncement: async (data) => {
        logger.info('Creating announcement', data);
        const response = await api.post('/api/announcements', data);
        return response.data;
    },

    getAnnouncements: async () => {
        logger.info('Fetching announcements');
        const response = await api.get('/api/announcements');
        return response.data;
    },

    // Events
    createEvent: async (data) => {
        logger.info('Creating event', data);
        const response = await api.post('/api/events', data);
        return response.data;
    },

    getEvents: async () => {
        logger.info('Fetching events');
        const response = await api.get('/api/events');
        return response.data;
    },

    // Subjects (faculty's assigned subjects)
    getMySubjects: async () => {
        logger.info('Fetching my subjects');
        const response = await api.get('/api/faculty/dashboard/my-subjects');
        return response.data;
    },
};

export default facultyApi;
