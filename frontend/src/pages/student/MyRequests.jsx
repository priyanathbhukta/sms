import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { studentApi } from '../../api/student.api';
import { logger } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import {
    Loader2,
    FileText,
    Plus,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
} from 'lucide-react';
import styles from '../../components/common/DataTable.module.css';
import formStyles from '../../components/common/Form.module.css';

const REQUEST_TYPES = [
    'CERTIFICATE_REQUEST',
    'LEAVE_REQUEST',
    'FEE_WAIVER',
    'DOCUMENT_REQUEST',
    'GENERAL_INQUIRY',
    'OTHER',
];

const MyRequestsPage = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        requestType: '',
        description: '',
    });

    useEffect(() => {
        if (user?.id) {
            fetchRequests();
        }
    }, [user?.id]);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const data = await studentApi.getMyRequests(user.id);
            logger.log('My requests:', data);
            setRequests(Array.isArray(data) ? data : []);
        } catch (err) {
            logger.error('Error fetching requests:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.requestType || !formData.description) {
            setError('Please fill in all fields');
            return;
        }

        try {
            setSubmitting(true);
            await studentApi.submitRequest({
                requesterUserId: user.id,
                requesterRole: 'STUDENT',
                requestType: formData.requestType,
                description: formData.description,
            });

            setShowModal(false);
            setFormData({ requestType: '', description: '' });
            setSuccess('Request submitted successfully!');
            setTimeout(() => setSuccess(''), 3000);
            fetchRequests();
        } catch (err) {
            logger.error('Error submitting request:', err);
            setError(err.response?.data?.message || 'Failed to submit request');
        } finally {
            setSubmitting(false);
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
                    My Requests
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Submit and track admin requests
                </p>
            </div>

            {success && (
                <div style={{
                    padding: 'var(--space-3)',
                    background: 'var(--success-50)',
                    color: 'var(--success-600)',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: 'var(--space-4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                }}>
                    <CheckCircle size={16} />
                    {success}
                </div>
            )}

            <div className={styles.dataTable}>
                <div className={styles.tableHeader}>
                    <div className={styles.tableTitle}>
                        <FileText size={20} style={{ display: 'inline', marginRight: '8px' }} />
                        My Requests ({requests.length})
                    </div>
                    <button className={styles.addButton} onClick={() => setShowModal(true)}>
                        <Plus size={18} />
                        New Request
                    </button>
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
                                <th>Status</th>
                                <th>Date</th>
                                <th>Admin Response</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((req) => (
                                <tr key={req.id}>
                                    <td>#{req.id}</td>
                                    <td>
                                        <span className={`${styles.badge} ${styles.info}`}>
                                            {req.requestType?.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {req.description}
                                    </td>
                                    <td>{getStatusBadge(req.status)}</td>
                                    <td>{formatDate(req.createdAt)}</td>
                                    <td style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                        {req.adminComments || '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className={styles.emptyState}>
                        <FileText size={48} />
                        <p>No requests yet</p>
                        <Button variant="primary" onClick={() => setShowModal(true)} style={{ marginTop: 'var(--space-4)' }}>
                            <Plus size={16} /> Submit First Request
                        </Button>
                    </div>
                )}
            </div>

            {/* New Request Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Submit Request"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleSubmit} loading={submitting}>Submit</Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div style={{
                            padding: 'var(--space-3)',
                            background: 'var(--error-50)',
                            color: 'var(--error-600)',
                            borderRadius: 'var(--radius-lg)',
                            marginBottom: 'var(--space-4)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                        }}>
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <div className={formStyles.formGroup}>
                        <label className={formStyles.label}>Request Type</label>
                        <select name="requestType" value={formData.requestType} onChange={handleChange} className={formStyles.select}>
                            <option value="">Select type</option>
                            {REQUEST_TYPES.map(type => (
                                <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
                            ))}
                        </select>
                    </div>

                    <div className={formStyles.formGroup}>
                        <label className={formStyles.label}>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className={formStyles.textarea}
                            placeholder="Describe your request in detail..."
                            rows={4}
                        />
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default MyRequestsPage;
