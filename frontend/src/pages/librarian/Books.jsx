import { useState, useEffect } from 'react';
import { librarianApi } from '../../api/librarian.api';
import { logger } from '../../utils/constants';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import {
    Loader2,
    BookOpen,
    Plus,
    Search,
    Trash2,
    AlertCircle,
} from 'lucide-react';
import styles from '../../components/common/DataTable.module.css';
import formStyles from '../../components/common/Form.module.css';

const BooksPage = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        isbn: '',
        totalCopies: '1',
        category: '',
    });

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const data = await librarianApi.getAllBooks();
            logger.log('Books:', data);
            setBooks(Array.isArray(data) ? data : []);
        } catch (err) {
            logger.error('Error fetching books:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            fetchBooks();
            return;
        }
        try {
            const data = await librarianApi.searchByTitle(searchTerm);
            setBooks(Array.isArray(data) ? data : []);
        } catch (err) {
            logger.error('Error searching:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.author) {
            setError('Title and author are required');
            return;
        }

        try {
            setCreating(true);
            await librarianApi.addBook({
                title: formData.title,
                author: formData.author,
                isbn: formData.isbn,
                totalCopies: parseInt(formData.totalCopies),
            });
            setShowModal(false);
            setFormData({ title: '', author: '', isbn: '', totalCopies: '1', category: '' });
            fetchBooks();
        } catch (err) {
            logger.error('Error adding book:', err);
            setError(err.response?.data?.message || 'Failed to add book');
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this book?')) return;
        try {
            await librarianApi.deleteBook(id);
            fetchBooks();
        } catch (err) {
            logger.error('Error deleting book:', err);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: 'var(--space-6)' }}>
                <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-1)' }}>
                    Books Management
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Add and manage library books
                </p>
            </div>

            <div className={styles.dataTable}>
                <div className={styles.tableHeader}>
                    <div className={styles.tableTitle}>
                        <BookOpen size={20} style={{ display: 'inline', marginRight: '8px' }} />
                        All Books ({books.length})
                    </div>
                    <div className={styles.tableActions}>
                        <div className={styles.searchWrapper}>
                            <Search className={styles.searchIcon} size={18} />
                            <input
                                type="text"
                                placeholder="Search by title..."
                                className={styles.searchInput}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        <button className={styles.addButton} onClick={() => setShowModal(true)}>
                            <Plus size={18} />
                            Add Book
                        </button>
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
                ) : books.length > 0 ? (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Author</th>
                                <th>ISBN</th>
                                <th>Quantity</th>
                                <th>Available</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((book) => (
                                <tr key={book.id}>
                                    <td>#{book.id}</td>
                                    <td style={{ fontWeight: 'var(--font-medium)' }}>{book.title}</td>
                                    <td>{book.author}</td>
                                    <td>{book.isbn || '-'}</td>
                                    <td>{book.totalCopies}</td>
                                    <td>
                                        <span className={`${styles.badge} ${book.availableCopies > 0 ? styles.success : styles.error}`}>
                                            {book.availableCopies || 0}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className={`${styles.actionBtn} ${styles.delete}`}
                                            title="Delete"
                                            onClick={() => handleDelete(book.id)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className={styles.emptyState}>
                        <BookOpen size={48} />
                        <p>No books in library</p>
                        <Button variant="primary" onClick={() => setShowModal(true)} style={{ marginTop: 'var(--space-4)' }}>
                            <Plus size={16} /> Add First Book
                        </Button>
                    </div>
                )}
            </div>

            {/* Add Book Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Add New Book"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleSubmit} loading={creating}>Add Book</Button>
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
                        <label className={formStyles.label}>Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={formStyles.input}
                            placeholder="The Great Gatsby"
                        />
                    </div>

                    <div className={formStyles.formGroup}>
                        <label className={formStyles.label}>Author</label>
                        <input
                            type="text"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            className={formStyles.input}
                            placeholder="F. Scott Fitzgerald"
                        />
                    </div>

                    <div className={formStyles.row}>
                        <div className={formStyles.formGroup}>
                            <label className={formStyles.label}>ISBN</label>
                            <input
                                type="text"
                                name="isbn"
                                value={formData.isbn}
                                onChange={handleChange}
                                className={formStyles.input}
                                placeholder="978-0-7432-7356-5"
                            />
                        </div>
                        <div className={formStyles.formGroup}>
                            <label className={formStyles.label}>Copies</label>
                            <input
                                type="number"
                                name="totalCopies"
                                value={formData.totalCopies}
                                onChange={handleChange}
                                className={formStyles.input}
                                min="1"
                            />
                        </div>
                    </div>

                    <div className={formStyles.formGroup}>
                        <label className={formStyles.label}>Category</label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className={formStyles.input}
                            placeholder="Fiction"
                        />
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default BooksPage;
