import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { logger } from '../../utils/constants';

/**
 * Protected Route Component
 * Wraps routes that require authentication and optionally specific roles
 */
const ProtectedRoute = ({ allowedRoles = [] }) => {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

    // Show loading state while checking auth
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                background: 'var(--bg-secondary)',
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="loading-spinner" />
                    <p style={{ marginTop: 'var(--space-4)', color: 'var(--text-secondary)' }}>
                        Loading...
                    </p>
                </div>
                <style>{`
          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid var(--gray-200);
            border-top-color: var(--primary-500);
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
            </div>
        );
    }

    // Not authenticated - redirect to login
    if (!isAuthenticated) {
        logger.log('Not authenticated, redirecting to login');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check role-based access
    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        logger.warn('Access denied - User role:', user?.role, 'Required:', allowedRoles);
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                background: 'var(--bg-secondary)',
                padding: 'var(--space-4)',
                textAlign: 'center',
            }}>
                <h1 style={{ fontSize: 'var(--text-4xl)', color: 'var(--error-500)', marginBottom: 'var(--space-4)' }}>
                    403
                </h1>
                <h2 style={{ fontSize: 'var(--text-xl)', color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
                    Access Denied
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
                    You don't have permission to access this page.
                </p>
                <a
                    href="/"
                    style={{
                        padding: 'var(--space-2) var(--space-6)',
                        background: 'var(--primary-500)',
                        color: 'white',
                        borderRadius: 'var(--radius-lg)',
                        textDecoration: 'none',
                    }}
                >
                    Go Home
                </a>
            </div>
        );
    }

    // Authorized - render the route
    return <Outlet />;
};

export default ProtectedRoute;
