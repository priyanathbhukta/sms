import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/auth.api';
import { STORAGE_KEYS, ROLES, ROLE_HOME_ROUTES, logger } from '../utils/constants';
import { getStorage, setStorage, removeStorage } from '../utils/helpers';

// Create Auth Context
const AuthContext = createContext(null);

/**
 * Parse JWT token to extract user info
 */
const parseJwt = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        logger.error('Error parsing JWT:', error);
        return null;
    }
};

/**
 * Auth Provider Component
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize auth state from storage
    useEffect(() => {
        const initAuth = () => {
            try {
                const storedToken = getStorage(STORAGE_KEYS.TOKEN);
                const storedUser = getStorage(STORAGE_KEYS.USER);

                if (storedToken && storedUser) {
                    // Check if token is expired
                    const decoded = parseJwt(storedToken);
                    if (decoded && decoded.exp * 1000 > Date.now()) {
                        setToken(storedToken);
                        setUser(storedUser);
                        logger.info('Auth restored from storage:', storedUser.email);
                    } else {
                        // Token expired, clear storage
                        logger.warn('Token expired, clearing session');
                        removeStorage(STORAGE_KEYS.TOKEN);
                        removeStorage(STORAGE_KEYS.USER);
                    }
                }
            } catch (err) {
                logger.error('Error initializing auth:', err);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    /**
     * Login user
     */
    const login = useCallback(async (email, password) => {
        setLoading(true);
        setError(null);

        try {
            const response = await authApi.login({ email, password });
            logger.info('Login response:', response);

            const { token: authToken, mustChangePassword, ...userData } = response;

            // Parse token to get additional info if needed
            const decoded = parseJwt(authToken);
            logger.log('Decoded token:', decoded);

            // Build user object
            const userInfo = {
                email: userData.email || email,
                role: userData.role || decoded?.role,
                firstName: userData.firstName,
                lastName: userData.lastName,
                id: userData.id || decoded?.sub,
                mustChangePassword: mustChangePassword || false,
            };

            // Store auth data
            setStorage(STORAGE_KEYS.TOKEN, authToken);
            setStorage(STORAGE_KEYS.USER, userInfo);

            setToken(authToken);
            setUser(userInfo);

            logger.info('Login successful:', userInfo);

            // Check if user must change password (first login)
            if (mustChangePassword) {
                logger.info('User must change password on first login');
                return {
                    success: true,
                    user: userInfo,
                    mustChangePassword: true,
                    redirectTo: '/change-password',
                };
            }

            return {
                success: true,
                user: userInfo,
                mustChangePassword: false,
                redirectTo: ROLE_HOME_ROUTES[userInfo.role] || '/',
            };
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Login failed';
            logger.error('Login error:', errorMessage);
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Register user
     */
    const register = useCallback(async (userData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await authApi.register(userData);
            logger.info('Registration response:', response);

            // If token is returned, auto-login
            if (response.token) {
                const { token: authToken, ...userInfo } = response;

                setStorage(STORAGE_KEYS.TOKEN, authToken);
                setStorage(STORAGE_KEYS.USER, userInfo);

                setToken(authToken);
                setUser(userInfo);

                return {
                    success: true,
                    user: userInfo,
                    redirectTo: ROLE_HOME_ROUTES[userInfo.role] || '/login',
                };
            }

            return { success: true, message: 'Registration successful. Please login.' };
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
            logger.error('Registration error:', errorMessage);
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Logout user
     */
    const logout = useCallback(async () => {
        try {
            await authApi.logout();
        } catch (err) {
            logger.error('Logout API error (continuing logout):', err);
        } finally {
            // Always clear local state
            removeStorage(STORAGE_KEYS.TOKEN);
            removeStorage(STORAGE_KEYS.USER);
            setToken(null);
            setUser(null);
            logger.info('User logged out');
        }
    }, []);

    /**
     * Check if user has specific role
     */
    const hasRole = useCallback((role) => {
        if (!user) return false;
        if (Array.isArray(role)) {
            return role.includes(user.role);
        }
        return user.role === role;
    }, [user]);

    /**
     * Check if user is authenticated
     */
    const isAuthenticated = !!token && !!user;

    const value = {
        user,
        token,
        loading,
        error,
        isAuthenticated,
        login,
        register,
        logout,
        hasRole,
        ROLES,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Custom hook to use auth context
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
