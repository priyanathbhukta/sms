import { useState, useEffect } from 'react';
import { librarianApi } from '../../api/librarian.api';
import { logger } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';
import Button from '../../components/common/Button';
import {
    Loader2,
    Clock,
    RotateCcw,
    AlertTriangle,
} from 'lucide-react';
import styles from '../../components/common/DataTable.module.css';

const OverduePage = () => {
    const [overdue, setOverdue] = useState([]);
    const [loading, setLoading] = useState(true);
    const [returning, setReturning] = useState(null);

    useEffect(() => {
        fetchOverdue();
    }, []);

    const fetchOverdue = async () => {
        try {
            setLoading(true);
            const data = await librarianApi.getOverdue();
            logger.log('Overdue issues:', data);
            setOverdue(Array.isArray(data) ? data : []);
        } catch (err) {
            logger.error('Error fetching overdue:', err);
        } finally {
            setLoading(false);
        }
    };

    const calculateFine = (dueDate) => {
        const due = new Date(dueDate);
        const today = new Date();
        const daysOverdue = Math.ceil((today - due) / (1000 * 60 * 60 * 24));
        // Assuming ₹10 per day fine
        return Math.max(0, daysOverdue * 10);
    };

    const handleReturn = async (issueId, dueDate) => {
        const fine = calculateFine(dueDate);
        try {
            setReturning(issueId);
            await librarianApi.returnBook(issueId, fine);
            fetchOverdue();
        } catch (err) {
            logger.error('Error returning book:', err);
        } finally {
            setReturning(null);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: 'var(--space-6)' }}>
                <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-1)' }}>
                    Overdue Books
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Books that haven't been returned on time
                </p>
            </div>

            {overdue.length > 0 && (
                <div style={{
                    padding: 'var(--space-4)',
                    background: 'var(--warning-50)',
                    color: 'var(--warning-700)',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: 'var(--space-6)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                }}>
                    <AlertTriangle size={24} />
                    <div>
                        <strong>{overdue.length} books are overdue!</strong>
                        <p style={{ fontSize: 'var(--text-sm)', marginTop: '4px' }}>
                            Contact the users to collect the books and applicable fines.
                        </p>
                    </div>
                </div>
            )}

            <div className={styles.dataTable}>
                <div className={styles.tableHeader}>
                    <div className={styles.tableTitle}>
                        <Clock size={20} style={{ display: 'inline', marginRight: '8px' }} />
                        Overdue Books ({overdue.length})
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
                ) : overdue.length > 0 ? (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Book</th>
                                <th>User</th>
                                <th>Due Date</th>
                                <th>Days Overdue</th>
                                <th>Fine</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {overdue.map((issue) => {
                                const daysOverdue = Math.ceil((new Date() - new Date(issue.dueDate)) / (1000 * 60 * 60 * 24));
                                const fine = calculateFine(issue.dueDate);

                                return (
                                    <tr key={issue.id}>
                                        <td>#{issue.id}</td>
                                        <td style={{ fontWeight: 'var(--font-medium)' }}>
                                            {issue.bookTitle || `Book #${issue.bookId}`}
                                        </td>
                                        <td>{issue.userName || `User #${issue.userId}`}</td>
                                        <td style={{ color: 'var(--error-600)' }}>{formatDate(issue.dueDate)}</td>
                                        <td>
                                            <span className={`${styles.badge} ${styles.error}`}>
                                                {daysOverdue} days
                                            </span>
                                        </td>
                                        <td style={{ fontWeight: 'var(--font-semibold)', color: 'var(--warning-600)' }}>
                                            ₹{fine}
                                        </td>
                                        <td>
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                loading={returning === issue.id}
                                                onClick={() => handleReturn(issue.id, issue.dueDate)}
                                            >
                                                <RotateCcw size={14} /> Return + Fine
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <div className={styles.emptyState}>
                        <Clock size={48} />
                        <p>No overdue books 🎉</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OverduePage;
