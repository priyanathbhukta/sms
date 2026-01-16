import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { studentApi } from '../../api/student.api';
import { librarianApi } from '../../api/librarian.api';
import { logger } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import {
    Loader2,
    BookOpen,
    Plus,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
} from 'lucide-react';
import styles from '../../components/common/DataTable.module.css';
import formStyles from '../../components/common/Form.module.css';

const LibraryPage = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedBook, setSelectedBook] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [requestsData, booksData] = await Promise.all([
                studentApi.getMyBookRequests(0, 50),
                librarianApi.getAvailable(),
            ]);

            const reqList = requestsData.content || requestsData || [];
            setRequests(Array.isArray(reqList) ? reqList : []);
            setBooks(Array.isArray(booksData) ? booksData : []);
        } catch (err) {
            logger.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedBook) {
            setError('Please select a book');
            return;
        }

        try {
            setSubmitting(true);
            await studentApi.requestBook({
                studentId: user.id,
                bookId: parseInt(selectedBook),
            });

            setShowModal(false);
            setSelectedBook('');
            setSuccess('Book request submitted!');
            setTimeout(() => setSuccess(''), 3000);
            fetchData();
        } catch (err) {
            logger.error('Error requesting book:', err);
            setError(err.response?.data?.message || 'Failed to request book');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = async (requestId) => {
        try {
            await studentApi.cancelBookRequest(requestId);
            fetchData();
        } catch (err) {
            logger.error('Error cancelling request:', err);
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
            case 'CANCELLED':
                return <span className={`${styles.badge} ${styles.info}`}><XCircle size={12} /> Cancelled</span>;
            default:
                return <span className={styles.badge}>{status}</span>;
        }
    };

    return (
        <div>
            <div style={{ marginBottom: 'var(--space-6)' }}>
                <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-1)' }}>
                    Library
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Request and track library books
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
                        <BookOpen size={20} style={{ display: 'inline', marginRight: '8px' }} />
                        My Book Requests
                    </div>
                    <button className={styles.addButton} onClick={() => setShowModal(true)}>
                        <Plus size={18} />
                        Request Book
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
                                <th>Book</th>
                                <th>Request Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((req) => (
                                <tr key={req.id}>
                                    <td>#{req.id}</td>
                                    <td style={{ fontWeight: 'var(--font-medium)' }}>
                                        {req.bookTitle || `Book #${req.bookId}`}
                                    </td>
                                    <td>{formatDate(req.createdAt)}</td>
                                    <td>{getStatusBadge(req.status)}</td>
                                    <td>
                                        {req.status === 'PENDING' && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleCancel(req.id)}
                                            >
                                                Cancel
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className={styles.emptyState}>
                        <BookOpen size={48} />
                        <p>No book requests yet</p>
                        <Button variant="primary" onClick={() => setShowModal(true)} style={{ marginTop: 'var(--space-4)' }}>
                            <Plus size={16} /> Request Your First Book
                        </Button>
                    </div>
                )}
            </div>

            {/* Request Book Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Request Book"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleSubmit} loading={submitting}>Submit Request</Button>
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
                        <label className={formStyles.label}>Select Book</label>
                        <select
                            value={selectedBook}
                            onChange={(e) => { setSelectedBook(e.target.value); setError(''); }}
                            className={formStyles.select}
                        >
                            <option value="">Choose an available book</option>
                            {books.map(book => (
                                <option key={book.id} value={book.id}>
                                    {book.title} by {book.author}
                                </option>
                            ))}
                        </select>
                        <p className={formStyles.helpText}>
                            Only available books are shown. Your request will be reviewed by the librarian.
                        </p>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default LibraryPage;
