import api from './axios';
import { logger } from '../utils/constants';

/**
 * Librarian API endpoints
 */
export const librarianApi = {
    // Dashboard
    getStats: async () => {
        logger.info('Fetching librarian stats');
        const response = await api.get('/api/librarian/dashboard/stats');
        return response.data;
    },

    getMyProfile: async () => {
        logger.info('Fetching librarian profile');
        const response = await api.get('/api/librarian/dashboard/profile');
        return response.data;
    },

    getPendingRequests: async () => {
        logger.info('Fetching pending book requests');
        const response = await api.get('/api/librarian/dashboard/pending-requests');
        return response.data;
    },

    getOverdueIssues: async () => {
        logger.info('Fetching overdue issues');
        const response = await api.get('/api/librarian/dashboard/overdue');
        return response.data;
    },

    getAvailableBooks: async () => {
        logger.info('Fetching available books');
        const response = await api.get('/api/librarian/dashboard/available-books');
        return response.data;
    },

    // Books
    addBook: async (data) => {
        logger.info('Adding book', data);
        const response = await api.post('/api/books', data);
        return response.data;
    },

    getAllBooks: async () => {
        logger.info('Fetching all books');
        const response = await api.get('/api/books');
        return response.data;
    },

    getAvailable: async () => {
        logger.info('Fetching available books');
        const response = await api.get('/api/books/available');
        return response.data;
    },

    searchByTitle: async (title) => {
        logger.info('Searching books by title', title);
        const response = await api.get('/api/books/search/title', { params: { title } });
        return response.data;
    },

    searchByAuthor: async (author) => {
        logger.info('Searching books by author', author);
        const response = await api.get('/api/books/search/author', { params: { author } });
        return response.data;
    },

    deleteBook: async (bookId) => {
        logger.info('Deleting book', bookId);
        const response = await api.delete(`/api/books/${bookId}`);
        return response.data;
    },

    // Book Requests
    processRequest: async (data) => {
        logger.info('Processing book request', data);
        const response = await api.put('/api/book-requests/process', data);
        return response.data;
    },

    getPendingBookRequests: async () => {
        logger.info('Fetching pending book requests');
        const response = await api.get('/api/book-requests/pending');
        return response.data;
    },

    getRequestsByStatus: async (status) => {
        logger.info('Fetching requests by status', status);
        const response = await api.get(`/api/book-requests/status/${status}`);
        return response.data;
    },

    // Library Issues
    issueBook: async (data) => {
        logger.info('Issuing book', data);
        const response = await api.post('/api/library-issues/issue', data);
        return response.data;
    },

    returnBook: async (issueId, fineAmount = 0) => {
        logger.info('Returning book', { issueId, fineAmount });
        const response = await api.put(`/api/library-issues/${issueId}/return`, null, {
            params: { fineAmount }
        });
        return response.data;
    },

    getIssuesByUser: async (userId) => {
        logger.info('Fetching issues by user', userId);
        const response = await api.get(`/api/library-issues/user/${userId}`);
        return response.data;
    },

    getOverdue: async () => {
        logger.info('Fetching overdue issues');
        const response = await api.get('/api/library-issues/overdue');
        return response.data;
    },

    getActiveIssues: async () => {
        logger.info('Fetching active issues');
        const response = await api.get('/api/library-issues/active');
        return response.data;
    },
};

export default librarianApi;
