import { useState, useEffect } from 'react';
import { facultyApi } from '../../api/faculty.api';
import { logger } from '../../utils/constants';
import {
    Loader2,
    School,
    Users,
} from 'lucide-react';
import styles from '../../components/common/DataTable.module.css';

const MyClassesPage = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            setLoading(true);
            const data = await facultyApi.getMyClasses();
            logger.log('My classes:', data);
            setClasses(Array.isArray(data) ? data : []);
        } catch (err) {
            logger.error('Error fetching classes:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: 'var(--space-6)' }}>
                <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-1)' }}>
                    My Classes
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Classes assigned to you
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
            ) : classes.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
                    {classes.map((cls) => (
                        <div
                            key={cls.id}
                            style={{
                                background: 'var(--surface)',
                                borderRadius: 'var(--radius-xl)',
                                padding: 'var(--space-5)',
                                boxShadow: 'var(--shadow-sm)',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: 'var(--radius-lg)',
                                    background: 'var(--primary-100)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--primary-600)',
                                }}>
                                    <School size={24} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-lg)' }}>
                                        Grade {cls.gradeLevel} - {cls.section}
                                    </div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                                        {cls.academicYear}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-secondary)' }}>
                                    <Users size={16} />
                                    <span>{cls.studentCount || 0} Students</span>
                                </div>
                                <span className={`${styles.badge} ${styles.primary}`}>
                                    {cls.subjectName || 'General'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState} style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-12)' }}>
                    <School size={48} />
                    <p>No classes assigned</p>
                </div>
            )}
        </div>
    );
};

export default MyClassesPage;
