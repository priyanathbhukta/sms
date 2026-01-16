import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { studentApi } from '../../api/student.api';
import { logger } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';
import {
    Loader2,
    ClipboardList,
    Check,
    X,
    Calendar,
} from 'lucide-react';
import styles from '../../components/common/DataTable.module.css';

const MyAttendancePage = () => {
    const { user } = useAuth();
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ present: 0, absent: 0, total: 0, percentage: 0 });

    useEffect(() => {
        if (user?.id) {
            fetchAttendance();
        }
    }, [user?.id]);

    const fetchAttendance = async () => {
        try {
            setLoading(true);
            const data = await studentApi.getMyAttendance(user.id);
            logger.log('My attendance:', data);

            const list = Array.isArray(data) ? data : [];
            setAttendance(list);

            // Calculate stats
            const present = list.filter(a => a.isPresent).length;
            const absent = list.filter(a => !a.isPresent).length;
            const total = list.length;
            const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

            setStats({ present, absent, total, percentage });
        } catch (err) {
            logger.error('Error fetching attendance:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: 'var(--space-6)' }}>
                <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-1)' }}>
                    My Attendance
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    View your attendance records
                </p>
            </div>

            {/* Stats Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 'var(--space-4)',
                marginBottom: 'var(--space-6)',
            }}>
                <div style={{
                    background: 'var(--surface)',
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--space-5)',
                    boxShadow: 'var(--shadow-sm)',
                    textAlign: 'center',
                }}>
                    <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--primary-600)' }}>
                        {stats.percentage}%
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Attendance Rate</div>
                </div>
                <div style={{
                    background: 'var(--surface)',
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--space-5)',
                    boxShadow: 'var(--shadow-sm)',
                    textAlign: 'center',
                }}>
                    <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--success-600)' }}>
                        {stats.present}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Days Present</div>
                </div>
                <div style={{
                    background: 'var(--surface)',
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--space-5)',
                    boxShadow: 'var(--shadow-sm)',
                    textAlign: 'center',
                }}>
                    <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--error-600)' }}>
                        {stats.absent}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Days Absent</div>
                </div>
                <div style={{
                    background: 'var(--surface)',
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--space-5)',
                    boxShadow: 'var(--shadow-sm)',
                    textAlign: 'center',
                }}>
                    <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>
                        {stats.total}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Total Days</div>
                </div>
            </div>

            {/* Attendance Records */}
            <div className={styles.dataTable}>
                <div className={styles.tableHeader}>
                    <div className={styles.tableTitle}>
                        <ClipboardList size={20} style={{ display: 'inline', marginRight: '8px' }} />
                        Attendance Records
                    </div>
                </div>

                {loading ? (
                    <div className={styles.loading}>
                        <Loader2 size={32} className="spin" />
                        <style>{`
              .spin { animation: spin 1s linear infinite; }
              @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
                    </div>
                ) : attendance.length > 0 ? (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Subject</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendance.map((record, idx) => (
                                <tr key={record.id || idx}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                            <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
                                            {formatDate(record.date)}
                                        </div>
                                    </td>
                                    <td>{record.subjectName || `Subject #${record.subjectId}`}</td>
                                    <td>
                                        {record.isPresent ? (
                                            <span className={`${styles.badge} ${styles.success}`}>
                                                <Check size={12} /> Present
                                            </span>
                                        ) : (
                                            <span className={`${styles.badge} ${styles.error}`}>
                                                <X size={12} /> Absent
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className={styles.emptyState}>
                        <ClipboardList size={48} />
                        <p>No attendance records yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyAttendancePage;
