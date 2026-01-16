import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { adminApi } from '../../api/admin.api';
import { DEBUG_MODE, logger } from '../../utils/constants';
import StatsCard from '../../components/dashboard/StatsCard';
import {
    Users,
    GraduationCap,
    UserCog,
    Library,
    BookOpen,
    School,
    CreditCard,
    ClipboardList,
    Plus,
    AlertCircle,
    Bell,
    Loader2,
} from 'lucide-react';
import styles from './Dashboard.module.css';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [recentRequests, setRecentRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                logger.log('Fetching admin dashboard data...');

                // Fetch dashboard stats
                const dashboardStats = await adminApi.getDashboardStats();
                logger.log('Dashboard stats:', dashboardStats);
                setStats(dashboardStats);

                // Fetch recent requests
                try {
                    const requests = await adminApi.getAdminRequests();
                    logger.log('Admin requests:', requests);
                    setRecentRequests(Array.isArray(requests) ? requests.slice(0, 5) : []);
                } catch (reqErr) {
                    logger.warn('Could not fetch requests:', reqErr);
                }

                setError(null);
            } catch (err) {
                logger.error('Error fetching dashboard:', err);
                setError(err.response?.data?.message || 'Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className={styles.loading}>
                <Loader2 size={32} className="spin" />
                <span style={{ marginLeft: '12px' }}>Loading dashboard...</span>
                <style>{`
          .spin { animation: spin 1s linear infinite; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.error}>
                <AlertCircle size={24} style={{ marginBottom: '8px' }} />
                <div>{error}</div>
            </div>
        );
    }

    return (
        <div className={styles.dashboard}>
            {/* Page Header */}
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>
                    Welcome back, {user?.firstName || 'Admin'}! 👋
                </h1>
                <p className={styles.pageSubtitle}>
                    Here's what's happening in your school today.
                </p>
            </div>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                <StatsCard
                    label="Total Students"
                    value={stats?.totalStudents || 0}
                    icon={GraduationCap}
                    variant="primary"
                />
                <StatsCard
                    label="Total Faculty"
                    value={stats?.totalFaculty || 0}
                    icon={UserCog}
                    variant="info"
                />
                <StatsCard
                    label="Total Librarians"
                    value={stats?.totalLibrarians || 0}
                    icon={Library}
                    variant="warning"
                />
                <StatsCard
                    label="Pending Requests"
                    value={stats?.pendingRequests || 0}
                    icon={ClipboardList}
                    variant="error"
                />
            </div>

            {/* Quick Actions */}
            <div className={styles.card} style={{ marginBottom: 'var(--space-6)' }}>
                <h2 className={styles.sectionTitle}>Quick Actions</h2>
                <div className={styles.quickActions}>
                    <Link to="/admin/students" className={styles.quickActionBtn}>
                        <Users size={24} />
                        <span>Manage Students</span>
                    </Link>
                    <Link to="/admin/faculty" className={styles.quickActionBtn}>
                        <UserCog size={24} />
                        <span>Manage Faculty</span>
                    </Link>
                    <Link to="/admin/classes" className={styles.quickActionBtn}>
                        <School size={24} />
                        <span>Manage Classes</span>
                    </Link>
                    <Link to="/admin/fees" className={styles.quickActionBtn}>
                        <CreditCard size={24} />
                        <span>Fee Structure</span>
                    </Link>
                </div>
            </div>

            {/* Recent Requests */}
            <div className={styles.card}>
                <h2 className={styles.sectionTitle}>
                    Recent Requests
                    <Link to="/admin/requests" className={styles.sectionAction}>
                        View All →
                    </Link>
                </h2>

                {recentRequests.length > 0 ? (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Type</th>
                                <th>Requester</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentRequests.map((req) => (
                                <tr key={req.id}>
                                    <td>#{req.id}</td>
                                    <td>{req.requestType}</td>
                                    <td>{req.requesterName || `User #${req.requesterUserId}`}</td>
                                    <td>
                                        <span className={`${styles.badge} ${styles[req.status?.toLowerCase()]}`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-muted)' }}>
                        <ClipboardList size={48} style={{ marginBottom: '8px', opacity: 0.5 }} />
                        <p>No pending requests</p>
                    </div>
                )}
            </div>

            {/* Debug Panel */}
            {DEBUG_MODE && (
                <div style={{
                    marginTop: 'var(--space-6)',
                    padding: 'var(--space-4)',
                    background: 'rgba(0,0,0,0.9)',
                    color: '#00ff00',
                    borderRadius: 'var(--radius-lg)',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                }}>
                    <strong>🐛 Debug Info:</strong>
                    <pre style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>
                        {JSON.stringify(stats, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
