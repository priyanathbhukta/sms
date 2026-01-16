import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { studentApi } from '../../api/student.api';
import { logger } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';
import {
    Loader2,
    BookCheck,
    Award,
} from 'lucide-react';
import styles from '../../components/common/DataTable.module.css';

const MyResultsPage = () => {
    const { user } = useAuth();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            fetchResults();
        }
    }, [user?.id]);

    const fetchResults = async () => {
        try {
            setLoading(true);
            const data = await studentApi.getMyResults(user.id);
            logger.log('My results:', data);
            setResults(Array.isArray(data) ? data : []);
        } catch (err) {
            logger.error('Error fetching results:', err);
        } finally {
            setLoading(false);
        }
    };

    const getGrade = (marks, maxMarks) => {
        const percentage = (marks / maxMarks) * 100;
        if (percentage >= 90) return { grade: 'A+', color: 'var(--success-600)' };
        if (percentage >= 80) return { grade: 'A', color: 'var(--success-500)' };
        if (percentage >= 70) return { grade: 'B+', color: 'var(--primary-600)' };
        if (percentage >= 60) return { grade: 'B', color: 'var(--primary-500)' };
        if (percentage >= 50) return { grade: 'C', color: 'var(--warning-600)' };
        if (percentage >= 40) return { grade: 'D', color: 'var(--warning-500)' };
        return { grade: 'F', color: 'var(--error-600)' };
    };

    return (
        <div>
            <div style={{ marginBottom: 'var(--space-6)' }}>
                <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-1)' }}>
                    My Results
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    View your exam results
                </p>
            </div>

            <div className={styles.dataTable}>
                <div className={styles.tableHeader}>
                    <div className={styles.tableTitle}>
                        <BookCheck size={20} style={{ display: 'inline', marginRight: '8px' }} />
                        Exam Results ({results.length})
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
                ) : results.length > 0 ? (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Exam</th>
                                <th>Course</th>
                                <th>Date</th>
                                <th>Marks</th>
                                <th>Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((result, idx) => {
                                const { grade, color } = getGrade(result.marksObtained, result.maxMarks || 100);
                                return (
                                    <tr key={result.id || idx}>
                                        <td style={{ fontWeight: 'var(--font-medium)' }}>
                                            {result.examName || `Exam #${result.examId}`}
                                        </td>
                                        <td>{result.courseName || '-'}</td>
                                        <td>{formatDate(result.examDate)}</td>
                                        <td>
                                            <span style={{ fontWeight: 'var(--font-semibold)' }}>
                                                {result.marksObtained}
                                            </span>
                                            <span style={{ color: 'var(--text-muted)' }}>
                                                /{result.maxMarks || 100}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                                <Award size={16} style={{ color }} />
                                                <span style={{ fontWeight: 'var(--font-bold)', color }}>{grade}</span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <div className={styles.emptyState}>
                        <BookCheck size={48} />
                        <p>No results available yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyResultsPage;
