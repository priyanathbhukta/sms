import { useState, useEffect } from 'react';
import { librarianApi } from '../../api/librarian.api';
import { logger } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';
import Button from '../../components/common/Button';
import {
    Loader2,
    ClipboardList,
    CheckCircle,
    XCircle,
    Clock,
} from 'lucide-react';
import styles from '../../components/common/DataTable.module.css';

const BookRequestsPage = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);
    const [filter, setFilter] = useState('PENDING');

    useEffect(() => {
        fetchRequests();
    }, [filter]);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const data = filter === 'ALL'
                ? await librarianApi.getPendingBookRequests()
                : await librarianApi.getRequestsByStatus(filter);
            logger.log('Requests:', data);
            setRequests(Array.isArray(data) ? data : []);
        } catch (err) {
            logger.error('Error fetching requests:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleProcess = async (requestId, action) => {
        try {
            setProcessing(requestId);
            await librarianApi.processRequest({
                requestId,
                action, // 'APPROVE' or 'REJECT'
            });
            fetchRequests();
        } catch (err) {
            logger.error('Error processing request:', err);
        } finally {
            setProcessing(null);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'PENDING':
                return <span className={`${styles.badge} ${styles.warning}`}><Clock size={12} /> Pending</span>;
            case 'APPROVED':
                return <span className={`${styles.badge} ${styles.success}`}><CheckCircle size={12} /> Approved</span>;
            case 'REJECTED':
                return <span className={`${styles.badge} ${styles.error}`}><XCircle size={12} /> Rejected</span>;
            default:
                return <span className={styles.badge}>{status}</span>;
        }
    };

    return (
        <div>
            <div style={{ marginBottom: 'var(--space-6)' }}>
                <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-1)' }}>
                    Book Requests
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Process student book requests
                </p>
            </div>

            <div className={styles.dataTable}>
                <div className={styles.tableHeader}>
                    <div className={styles.tableTitle}>
                        <ClipboardList size={20} style={{ display: 'inline', marginRight: '8px' }} />
                        Book Requests ({requests.length})
                    </div>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        style={{
                            padding: 'var(--space-2) var(--space-3)',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--border-default)',
                            fontSize: 'var(--text-sm)',
                        }}
                    >
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                </div>

                {loading ? (
                    <div className={styles.loading}>
                        <Loader2 size={32} className="spin" />
                        <style>{`
              .spin { animation: spin 1s linear infinite; }
              @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
                    </div>
                ) : requests.length > 0 ? (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Student</th>
                                <th>Book</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((req) => (
                                <tr key={req.id}>
                                    <td>#{req.id}</td>
                                    <td>{req.studentName || `Student #${req.studentId}`}</td>
                                    <td style={{ fontWeight: 'var(--font-medium)' }}>
                                        {req.bookTitle || `Book #${req.bookId}`}
                                    </td>
                                    <td>{formatDate(req.createdAt)}</td>
                                    <td>{getStatusBadge(req.status)}</td>
                                    <td>
                                        {req.status === 'PENDING' && (
                                            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    loading={processing === req.id}
                                                    onClick={() => handleProcess(req.id, 'APPROVE')}
                                                >
                                                    <CheckCircle size={14} /> Approve
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    loading={processing === req.id}
                                                    onClick={() => handleProcess(req.id, 'REJECT')}
                                                >
                                                    <XCircle size={14} /> Reject
                                                </Button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className={styles.emptyState}>
                        <ClipboardList size={48} />
                        <p>No {filter.toLowerCase()} requests</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookRequestsPage;
