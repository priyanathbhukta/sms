// API Configuration & Constants
// Use empty string to leverage Vite's proxy (avoids CORS issues)
export const API_BASE_URL = import.meta.env.VITE_API_URL || '';
export const DEBUG_MODE = import.meta.env.VITE_DEBUG === 'true';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'SMS Portal';

// Storage Keys
export const STORAGE_KEYS = {
    TOKEN: 'sms_token',
    USER: 'sms_user',
    THEME: 'sms_theme',
};

// User Roles
export const ROLES = {
    ADMIN: 'ADMIN',
    FACULTY: 'FACULTY',
    STUDENT: 'STUDENT',
    LIBRARIAN: 'LIBRARIAN',
};

// Role Display Names
export const ROLE_LABELS = {
    [ROLES.ADMIN]: 'Administrator',
    [ROLES.FACULTY]: 'Faculty',
    [ROLES.STUDENT]: 'Student',
    [ROLES.LIBRARIAN]: 'Librarian',
};

// Role Colors
export const ROLE_COLORS = {
    [ROLES.ADMIN]: '#dc2626',
    [ROLES.FACULTY]: '#2563eb',
    [ROLES.STUDENT]: '#059669',
    [ROLES.LIBRARIAN]: '#7c3aed',
};

// Route Paths by Role
export const ROLE_HOME_ROUTES = {
    [ROLES.ADMIN]: '/admin',
    [ROLES.FACULTY]: '/faculty',
    [ROLES.STUDENT]: '/student',
    [ROLES.LIBRARIAN]: '/librarian',
};

// Request Status
export const REQUEST_STATUS = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
};

// Pagination Defaults
export const PAGINATION = {
    DEFAULT_PAGE: 0,
    DEFAULT_SIZE: 10,
    PAGE_SIZES: [5, 10, 20, 50],
};

// Debug logger
export const logger = {
    log: (...args) => {
        if (DEBUG_MODE) {
            console.log('[DEBUG]', ...args);
        }
    },
    error: (...args) => {
        if (DEBUG_MODE) {
            console.error('[ERROR]', ...args);
        }
    },
    warn: (...args) => {
        if (DEBUG_MODE) {
            console.warn('[WARN]', ...args);
        }
    },
    info: (...args) => {
        if (DEBUG_MODE) {
            console.info('[INFO]', ...args);
        }
    },
    table: (data) => {
        if (DEBUG_MODE) {
            console.table(data);
        }
    },
};
