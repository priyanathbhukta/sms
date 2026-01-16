import { useState, useEffect } from 'react';
import { librarianApi } from '../../api/librarian.api';
import { adminApi } from '../../api/admin.api';
import { logger } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import {
    Loader2,
    BookCheck,
    Plus,
    RotateCcw,
    AlertCircle,
    CheckCircle,
} from 'lucide-react';
import styles from '../../components/common/DataTable.module.css';
import formStyles from '../../components/common/Form.module.css';

const IssuesPage = () => {
    const [issues, setIssues] = useState([]);
    const [books, setBooks] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [issuing, setIssuing] = useState(false);
    const [returning, setReturning] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        bookId: '',
        userId: '',
        dueDate: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [booksData, studentsData, issuesData] = await Promise.all([
                librarianApi.getAvailable(),
                adminApi.getStudents(0, 100).then(d => d.content || d),
                librarianApi.getActiveIssues(),
            ]);

            setBooks(Array.isArray(booksData) ? booksData : []);
            setStudents(Array.isArray(studentsData) ? studentsData : []);
            setIssues(Array.isArray(issuesData) ? issuesData : []);
        } catch (err) {
            logger.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleIssue = async (e) => {
        e.preventDefault();

        if (!formData.bookId || !formData.userId || !formData.dueDate) {
            setError('All fields are required');
            return;
        }

        try {
            setIssuing(true);
            await librarianApi.issueBook({
                bookId: parseInt(formData.bookId),
                userId: parseInt(formData.userId),
                issueDate: new Date().toISOString().split('T')[0],
                dueDate: formData.dueDate,
            });

            setShowModal(false);
            setFormData({ bookId: '', userId: '', dueDate: '' });
            setSuccess('Book issued successfully!');
            setTimeout(() => setSuccess(''), 3000);
            fetchData();
        } catch (err) {
            logger.error('Error issuing book:', err);
            setError(err.response?.data?.message || 'Failed to issue book');
        } finally {
            setIssuing(false);
        }
    };

    const handleReturn = async (issueId) => {
        try {
            setReturning(issueId);
            await librarianApi.returnBook(issueId, 0);
            fetchData();
            setSuccess('Book returned!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            logger.error('Error returning book:', err);
        } finally {
            setReturning(null);
        }
    };

    // Calculate default due date (14 days from now)
    const getDefaultDueDate = () => {
        const date = new Date();
        date.setDate(date.getDate() + 14);
        return date.toISOString().split('T')[0];
    };

    return (
        <div>
            <div style={{ marginBottom: 'var(--space-6)' }}>
                <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-1)' }}>
                    Issue Books
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Issue and return library books
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
                        <BookCheck size={20} style={{ display: 'inline', marginRight: '8px' }} />
                        Issued Books
                    </div>
                    <button className={styles.addButton} onClick={() => { setShowModal(true); setFormData(prev => ({ ...prev, dueDate: getDefaultDueDate() })); }}>
                        <Plus size={18} />
                        Issue Book
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
                ) : issues.length > 0 ? (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Book</th>
                                <th>User</th>
                                <th>Issue Date</th>
                                <th>Due Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {issues.map((issue) => (
                                <tr key={issue.id}>
                                    <td>#{issue.id}</td>
                                    <td>{issue.bookTitle || `Book #${issue.bookId}`}</td>
                                    <td>{issue.userName || `User #${issue.userId}`}</td>
                                    <td>{formatDate(issue.issueDate)}</td>
                                    <td>{formatDate(issue.dueDate)}</td>
                                    <td>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            loading={returning === issue.id}
                                            onClick={() => handleReturn(issue.id)}
                                        >
                                            <RotateCcw size={14} /> Return
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className={styles.emptyState}>
                        <BookCheck size={48} />
                        <p>No active issues</p>
                        <Button variant="primary" onClick={() => { setShowModal(true); setFormData(prev => ({ ...prev, dueDate: getDefaultDueDate() })); }} style={{ marginTop: 'var(--space-4)' }}>
                            <Plus size={16} /> Issue First Book
                        </Button>
                    </div>
                )}
            </div>

            {/* Issue Book Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Issue Book"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleIssue} loading={issuing}>Issue Book</Button>
                    </>
                }
            >
                <form onSubmit={handleIssue}>
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
                        <select name="bookId" value={formData.bookId} onChange={handleChange} className={formStyles.select}>
                            <option value="">Choose a book</option>
                            {books.map(b => (
                                <option key={b.id} value={b.id}>{b.title} by {b.author}</option>
                            ))}
                        </select>
                    </div>

                    <div className={formStyles.formGroup}>
                        <label className={formStyles.label}>Select Student</label>
                        <select name="userId" value={formData.userId} onChange={handleChange} className={formStyles.select}>
                            <option value="">Choose a student</option>
                            {students.map(s => (
                                <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
                            ))}
                        </select>
                    </div>

                    <div className={formStyles.formGroup}>
                        <label className={formStyles.label}>Due Date</label>
                        <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            className={formStyles.input}
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default IssuesPage;
