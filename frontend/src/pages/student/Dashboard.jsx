import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { studentApi } from '../../api/student.api';
import { DEBUG_MODE, logger } from '../../utils/constants';
import StatsCard from '../../components/dashboard/StatsCard';
import {
    ClipboardList,
    BookCheck,
    CreditCard,
    BookOpen,
    Calendar,
    Bell,
    Loader2,
    AlertCircle,
} from 'lucide-react';
import styles from '../admin/Dashboard.module.css';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [announcements, setAnnouncements] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                logger.log('Fetching student dashboard data...');

                const [announcementsData, eventsData] = await Promise.all([
                    studentApi.getAnnouncements().catch(() => []),
                    studentApi.getUpcomingEvents().catch(() => []),
                ]);

                logger.log('Announcements:', announcementsData);
                logger.log('Events:', eventsData);

                setAnnouncements(Array.isArray(announcementsData) ? announcementsData : []);
                setEvents(Array.isArray(eventsData) ? eventsData : []);
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
                    Hello, {user?.firstName || 'Student'}! 🎓
                </h1>
                <p className={styles.pageSubtitle}>
                    Welcome to your student portal.
                </p>
            </div>

            {/* Stats */}
            <div className={styles.statsGrid}>
                <StatsCard
                    label="Attendance"
                    value="--"
                    icon={ClipboardList}
                    variant="primary"
                />
                <StatsCard
                    label="Results"
                    value="--"
                    icon={BookCheck}
                    variant="success"
                />
                <StatsCard
                    label="Pending Fees"
                    value="--"
                    icon={CreditCard}
                    variant="warning"
                />
                <StatsCard
                    label="Books Issued"
                    value="--"
                    icon={BookOpen}
                    variant="info"
                />
            </div>

            {/* Quick Actions */}
            <div className={styles.card} style={{ marginBottom: 'var(--space-6)' }}>
                <h2 className={styles.sectionTitle}>Quick Actions</h2>
                <div className={styles.quickActions}>
                    <Link to="/student/attendance" className={styles.quickActionBtn}>
                        <ClipboardList size={24} />
                        <span>View Attendance</span>
                    </Link>
                    <Link to="/student/results" className={styles.quickActionBtn}>
                        <BookCheck size={24} />
                        <span>View Results</span>
                    </Link>
                    <Link to="/student/payments" className={styles.quickActionBtn}>
                        <CreditCard size={24} />
                        <span>Pay Fees</span>
                    </Link>
                    <Link to="/student/books" className={styles.quickActionBtn}>
                        <BookOpen size={24} />
                        <span>Request Book</span>
                    </Link>
                </div>
            </div>

            <div className={styles.cardGrid}>
                {/* Announcements */}
                <div className={styles.card}>
                    <h2 className={styles.sectionTitle}>
                        Announcements
                        <Link to="/student/announcements" className={styles.sectionAction}>View All →</Link>
                    </h2>
                    {announcements.length > 0 ? (
                        <div>
                            {announcements.slice(0, 3).map((ann, idx) => (
                                <div key={ann.id || idx} style={{
                                    padding: 'var(--space-3)',
                                    borderBottom: '1px solid var(--border-light)',
                                }}>
                                    <div style={{ fontWeight: 'var(--font-medium)', marginBottom: '4px' }}>
                                        {ann.title}
                                    </div>
                                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                                        {ann.content?.substring(0, 80)}...
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-muted)' }}>
                            <Bell size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                            <p>No announcements</p>
                        </div>
                    )}
                </div>

                {/* Upcoming Events */}
                <div className={styles.card}>
                    <h2 className={styles.sectionTitle}>
                        Upcoming Events
                        <Link to="/student/events" className={styles.sectionAction}>View All →</Link>
                    </h2>
                    {events.length > 0 ? (
                        <div>
                            {events.slice(0, 3).map((event, idx) => (
                                <div key={event.id || idx} style={{
                                    padding: 'var(--space-3)',
                                    borderBottom: '1px solid var(--border-light)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-3)',
                                }}>
                                    <Calendar size={20} style={{ color: 'var(--primary-500)' }} />
                                    <div>
                                        <div style={{ fontWeight: 'var(--font-medium)' }}>{event.title}</div>
                                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                                            {new Date(event.eventDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-muted)' }}>
                            <Calendar size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                            <p>No upcoming events</p>
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
                        {JSON.stringify({ announcements: announcements.length, events: events.length }, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
