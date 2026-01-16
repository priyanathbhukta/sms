import { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin.api';
import { logger } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';
import Button from '../../components/common/Button';
import {
    Loader2,
    ClipboardList,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
} from 'lucide-react';
import styles from '../../components/common/DataTable.module.css';

const RequestsPage = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [processing, setProcessing] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, [filter]);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            let data;
            if (filter === 'all') {
                data = await adminApi.getAdminRequests();
            } else {
                data = await adminApi.getRequestsByStatus(filter.toUpperCase());
            }
            logger.log('Requests data:', data);
            setRequests(Array.isArray(data) ? data : []);
        } catch (err) {
            logger.error('Error fetching requests:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (requestId, status) => {
        const comments = status === 'APPROVED'
            ? 'Request approved by admin'
            : window.prompt('Enter rejection reason:');

        if (status === 'REJECTED' && !comments) return;

        try {
            setProcessing(requestId);
            await adminApi.updateRequestStatus(requestId, status, comments || '');
            fetchRequests();
        } catch (err) {
            logger.error('Error updating request:', err);
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
                    Admin Requests
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    View and process requests from students, faculty, and librarians
                </p>
            </div>

            <div className={styles.dataTable}>
                <div className={styles.tableHeader}>
                    <div className={styles.tableTitle}>
                        <ClipboardList size={20} style={{ display: 'inline', marginRight: '8px' }} />
                        All Requests ({requests.length})
                    </div>
                    <div className={styles.tableActions}>
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
                            <option value="all">All Requests</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
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
                ) : requests.length > 0 ? (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Type</th>
                                <th>Description</th>
                                <th>Requester</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((req) => (
                                <tr key={req.id}>
                                    <td>#{req.id}</td>
                                    <td>
                                        <span className={`${styles.badge} ${styles.info}`}>
                                            {req.requestType}
                                        </span>
                                    </td>
                                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {req.description}
                                    </td>
                                    <td>{req.requesterName || `User #${req.requesterUserId}`}</td>
                                    <td>{getStatusBadge(req.status)}</td>
                                    <td>{formatDate(req.createdAt)}</td>
                                    <td>
                                        {req.status === 'PENDING' && (
                                            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    loading={processing === req.id}
                                                    onClick={() => handleUpdateStatus(req.id, 'APPROVED')}
                                                >
                                                    <CheckCircle size={14} />
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    loading={processing === req.id}
                                                    onClick={() => handleUpdateStatus(req.id, 'REJECTED')}
                                                >
                                                    <XCircle size={14} />
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
                        <p>No requests found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RequestsPage;
