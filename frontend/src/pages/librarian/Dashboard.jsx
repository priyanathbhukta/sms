import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { librarianApi } from '../../api/librarian.api';
import { DEBUG_MODE, logger } from '../../utils/constants';
import StatsCard from '../../components/dashboard/StatsCard';
import {
    BookOpen,
    BookCheck,
    Clock,
    ClipboardList,
    Plus,
    Loader2,
} from 'lucide-react';
import styles from '../admin/Dashboard.module.css';

const LibrarianDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [overdueIssues, setOverdueIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                logger.log('Fetching librarian dashboard data...');

                const [statsData, pendingData, overdueData] = await Promise.all([
                    librarianApi.getStats().catch(() => null),
                    librarianApi.getPendingRequests().catch(() => []),
                    librarianApi.getOverdueIssues().catch(() => []),
                ]);

                logger.log('Librarian stats:', statsData);
                logger.log('Pending requests:', pendingData);
                logger.log('Overdue issues:', overdueData);

                setStats(statsData);
                setPendingRequests(Array.isArray(pendingData) ? pendingData : []);
                setOverdueIssues(Array.isArray(overdueData) ? overdueData : []);
            } catch (err) {
                logger.error('Error fetching dashboard:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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

    return (
        <div className={styles.dashboard}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>
                    Welcome, {user?.firstName || 'Librarian'}! 📚
                </h1>
                <p className={styles.pageSubtitle}>
                    Manage your library resources efficiently.
                </p>
            </div>

            {/* Stats */}
            <div className={styles.statsGrid}>
                <StatsCard
                    label="Total Books"
                    value={stats?.totalBooks || 0}
                    icon={BookOpen}
                    variant="primary"
                />
                <StatsCard
                    label="Available Books"
                    value={stats?.availableBooks || 0}
                    icon={BookCheck}
                    variant="success"
                />
                <StatsCard
                    label="Pending Requests"
                    value={stats?.pendingRequests || pendingRequests.length || 0}
                    icon={ClipboardList}
                    variant="warning"
                />
                <StatsCard
                    label="Overdue Books"
                    value={stats?.overdueIssues || overdueIssues.length || 0}
                    icon={Clock}
                    variant="error"
                />
            </div>

            {/* Quick Actions */}
            <div className={styles.card} style={{ marginBottom: 'var(--space-6)' }}>
                <h2 className={styles.sectionTitle}>Quick Actions</h2>
                <div className={styles.quickActions}>
                    <Link to="/librarian/books" className={styles.quickActionBtn}>
                        <Plus size={24} />
                        <span>Add Book</span>
                    </Link>
                    <Link to="/librarian/requests" className={styles.quickActionBtn}>
                        <ClipboardList size={24} />
                        <span>Process Requests</span>
                    </Link>
                    <Link to="/librarian/issues" className={styles.quickActionBtn}>
                        <BookCheck size={24} />
                        <span>Issue Book</span>
                    </Link>
                    <Link to="/librarian/overdue" className={styles.quickActionBtn}>
                        <Clock size={24} />
                        <span>View Overdue</span>
                    </Link>
                </div>
            </div>

            <div className={styles.cardGrid}>
                {/* Pending Requests */}
                <div className={styles.card}>
                    <h2 className={styles.sectionTitle}>
                        Pending Requests
                        <Link to="/librarian/requests" className={styles.sectionAction}>View All →</Link>
                    </h2>
                    {pendingRequests.length > 0 ? (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Book</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingRequests.slice(0, 5).map((req, idx) => (
                                    <tr key={req.id || idx}>
                                        <td>{req.studentName || `Student #${req.studentId}`}</td>
                                        <td>{req.bookTitle || `Book #${req.bookId}`}</td>
                                        <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-muted)' }}>
                            <ClipboardList size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                            <p>No pending requests</p>
                        </div>
                    )}
                </div>

                {/* Overdue Books */}
                <div className={styles.card}>
                    <h2 className={styles.sectionTitle}>
                        Overdue Books
                        <Link to="/librarian/overdue" className={styles.sectionAction}>View All →</Link>
                    </h2>
                    {overdueIssues.length > 0 ? (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Book</th>
                                    <th>User</th>
                                    <th>Due Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {overdueIssues.slice(0, 5).map((issue, idx) => (
                                    <tr key={issue.id || idx}>
                                        <td>{issue.bookTitle || `Book #${issue.bookId}`}</td>
                                        <td>{issue.userName || `User #${issue.userId}`}</td>
                                        <td style={{ color: 'var(--error-600)' }}>
                                            {new Date(issue.dueDate).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-muted)' }}>
                            <Clock size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                            <p>No overdue books</p>
                        </div>
                    )}
                </div>
            </div>

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

export default LibrarianDashboard;
