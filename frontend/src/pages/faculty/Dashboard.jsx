import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { facultyApi } from '../../api/faculty.api';
import { DEBUG_MODE, logger } from '../../utils/constants';
import StatsCard from '../../components/dashboard/StatsCard';
import {
    School,
    Users,
    ClipboardList,
    FileText,
    Calendar,
    Bell,
    Loader2,
    AlertCircle,
} from 'lucide-react';
import styles from '../admin/Dashboard.module.css';

const FacultyDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                logger.log('Fetching faculty dashboard data...');

                const [statsData, classesData] = await Promise.all([
                    facultyApi.getStats().catch(() => null),
                    facultyApi.getMyClasses().catch(() => []),
                ]);

                logger.log('Faculty stats:', statsData);
                logger.log('Faculty classes:', classesData);

                setStats(statsData);
                setClasses(Array.isArray(classesData) ? classesData : []);
                setError(null);
            } catch (err) {
                logger.error('Error fetching dashboard:', err);
                setError(err.response?.data?.message || 'Failed to load dashboard');
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
                    Welcome, {user?.firstName || 'Teacher'}! 👨‍🏫
                </h1>
                <p className={styles.pageSubtitle}>
                    Here's your teaching overview for today.
                </p>
            </div>

            {/* Stats */}
            <div className={styles.statsGrid}>
                <StatsCard
                    label="My Classes"
                    value={stats?.totalClasses || classes.length || 0}
                    icon={School}
                    variant="primary"
                />
                <StatsCard
                    label="Total Students"
                    value={stats?.totalStudents || 0}
                    icon={Users}
                    variant="info"
                />
                <StatsCard
                    label="Pending Attendance"
                    value={stats?.pendingAttendance || 0}
                    icon={ClipboardList}
                    variant="warning"
                />
                <StatsCard
                    label="Upcoming Exams"
                    value={stats?.upcomingExams || 0}
                    icon={FileText}
                    variant="success"
                />
            </div>

            {/* Quick Actions */}
            <div className={styles.card} style={{ marginBottom: 'var(--space-6)' }}>
                <h2 className={styles.sectionTitle}>Quick Actions</h2>
                <div className={styles.quickActions}>
                    <Link to="/faculty/attendance" className={styles.quickActionBtn}>
                        <ClipboardList size={24} />
                        <span>Mark Attendance</span>
                    </Link>
                    <Link to="/faculty/exams" className={styles.quickActionBtn}>
                        <FileText size={24} />
                        <span>Create Exam</span>
                    </Link>
                    <Link to="/faculty/results" className={styles.quickActionBtn}>
                        <FileText size={24} />
                        <span>Enter Results</span>
                    </Link>
                    <Link to="/faculty/announcements" className={styles.quickActionBtn}>
                        <Bell size={24} />
                        <span>Announcements</span>
                    </Link>
                </div>
            </div>

            {/* My Classes */}
            <div className={styles.card}>
                <h2 className={styles.sectionTitle}>
                    My Classes
                    <Link to="/faculty/classes" className={styles.sectionAction}>View All →</Link>
                </h2>
                {classes.length > 0 ? (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Class</th>
                                <th>Section</th>
                                <th>Students</th>
                                <th>Subject</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classes.slice(0, 5).map((cls, idx) => (
                                <tr key={cls.id || idx}>
                                    <td>Grade {cls.gradeLevel || cls.grade}</td>
                                    <td>{cls.section || '-'}</td>
                                    <td>{cls.studentCount || 0}</td>
                                    <td>{cls.subjectName || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-muted)' }}>
                        <School size={48} style={{ marginBottom: '8px', opacity: 0.5 }} />
                        <p>No classes assigned yet</p>
                    </div>
                )}
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
                        {JSON.stringify({ stats, classes }, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default FacultyDashboard;
