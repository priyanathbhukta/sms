import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { studentApi } from '../../api/student.api';
import { logger } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';
import {
    Loader2,
    Bell,
} from 'lucide-react';
import styles from '../../components/common/DataTable.module.css';

const AnnouncementsPage = () => {
    const { user } = useAuth();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.studentId) {
            fetchAnnouncements();
        }
    }, [user?.studentId]);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            // Fetch class-specific + general announcements
            const data = await studentApi.getMyAnnouncements(user.studentId);
            logger.log('Announcements:', data);
            setAnnouncements(Array.isArray(data) ? data : []);
        } catch (err) {
            logger.error('Error fetching announcements:', err);
            // Fallback to general announcements
            try {
                const fallbackData = await studentApi.getAnnouncements();
                setAnnouncements(Array.isArray(fallbackData) ? fallbackData : []);
            } catch (fallbackErr) {
                logger.error('Error fetching fallback announcements:', fallbackErr);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: 'var(--space-6)' }}>
                <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-1)' }}>
                    Announcements
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Latest updates from school administration
                </p>
            </div>

            {loading ? (
                <div className={styles.loading}>
                    <Loader2 size={32} className="spin" />
                    <style>{`
            .spin { animation: spin 1s linear infinite; }
            @keyframes spin { to { transform: rotate(360deg); } }
          `}</style>
                </div>
            ) : announcements.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    {announcements.map((ann) => (
                        <div
                            key={ann.id}
                            style={{
                                background: 'var(--surface)',
                                borderRadius: 'var(--radius-xl)',
                                padding: 'var(--space-5)',
                                boxShadow: 'var(--shadow-sm)',
                                borderLeft: '4px solid var(--primary-500)',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' }}>
                                    {ann.title}
                                </h3>
                                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                                    {formatDate(ann.createdAt)}
                                </span>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                {ann.content}
                            </p>
                            {ann.targetRole && (
                                <div style={{ marginTop: 'var(--space-3)' }}>
                                    <span className={`${styles.badge} ${styles.info}`}>
                                        For: {ann.targetRole}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState} style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-12)' }}>
                    <Bell size={48} />
                    <p>No announcements yet</p>
                </div>
            )}
        </div>
    );
};

export default AnnouncementsPage;
