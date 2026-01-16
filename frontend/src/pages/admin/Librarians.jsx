import { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin.api';
import { logger } from '../../utils/constants';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import {
    Loader2,
    Library,
    Eye,
    Edit2,
    Trash2,
    Plus,
    AlertCircle,
    X,
} from 'lucide-react';
import styles from '../../components/common/DataTable.module.css';
import formStyles from '../../components/common/Form.module.css';

const LibrariansPage = () => {
    const [librarians, setLibrarians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        additionalId: '',
    });

    // View/Edit/Delete state
    const [selectedLibrarian, setSelectedLibrarian] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [editFormData, setEditFormData] = useState({ firstName: '', lastName: '', phone: '' });
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        fetchLibrarians();
    }, []);

    const fetchLibrarians = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getLibrarians(0, 50);
            logger.log('Librarians data:', data);

            if (data.content) {
                setLibrarians(data.content);
            } else if (Array.isArray(data)) {
                setLibrarians(data);
            }
        } catch (err) {
            logger.error('Error fetching librarians:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updated = { ...prev, [name]: value };

            // Auto-generate email
            if (['firstName', 'lastName', 'additionalId'].includes(name)) {
                const fn = (name === 'firstName' ? value : prev.firstName).toLowerCase().trim();
                const ln = (name === 'lastName' ? value : prev.lastName).toLowerCase().trim();
                const id = (name === 'additionalId' ? value : prev.additionalId).trim();

                if (fn && ln && id) {
                    updated.email = `${fn}.${ln}.${id}@sms.edu.in`;
                }
            }

            return updated;
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.firstName || !formData.lastName || !formData.password || !formData.additionalId) {
            setError('All fields are required');
            return;
        }

        try {
            setCreating(true);
            await adminApi.createLibrarian({
                ...formData,
                role: 'LIBRARIAN',
            });

            setShowModal(false);
            setFormData({ firstName: '', lastName: '', email: '', password: '', additionalId: '' });
            fetchLibrarians();
        } catch (err) {
            logger.error('Error creating librarian:', err);
            setError(err.response?.data?.message || 'Failed to create librarian');
        } finally {
            setCreating(false);
        }
    };

    // View handler
    const handleViewLibrarian = (lib) => {
        setSelectedLibrarian(lib);
        setShowViewModal(true);
    };

    // Edit handlers
    const handleEditLibrarian = (lib) => {
        setSelectedLibrarian(lib);
        setEditFormData({
            firstName: lib.firstName || '',
            lastName: lib.lastName || '',
            phone: lib.phone || '',
        });
        setEditError('');
        setShowEditModal(true);
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
        setEditError('');
    };

    const handleSaveEdit = async () => {
        setEditLoading(true);
        setEditError('');

        try {
            await adminApi.updateLibrarian(selectedLibrarian.id || selectedLibrarian.librarianId, {
                firstName: editFormData.firstName || null,
                lastName: editFormData.lastName || null,
                phone: editFormData.phone || null,
            });

            setShowEditModal(false);
            setSelectedLibrarian(null);
            fetchLibrarians();
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to update librarian';
            setEditError(message);
            logger.error('Error updating librarian:', err);
        } finally {
            setEditLoading(false);
        }
    };

    // Delete handlers
    const handleDeleteLibrarian = (lib) => {
        setSelectedLibrarian(lib);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        setDeleteLoading(true);
        try {
            await adminApi.deleteLibrarian(selectedLibrarian.id || selectedLibrarian.librarianId);
            setShowDeleteConfirm(false);
            setSelectedLibrarian(null);
            fetchLibrarians();
        } catch (err) {
            logger.error('Error deleting librarian:', err);
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: 'var(--space-6)' }}>
                <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-1)' }}>
                    Librarian Management
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Manage library staff members
                </p>
            </div>

            <div className={styles.dataTable}>
                <div className={styles.tableHeader}>
                    <div className={styles.tableTitle}>
                        <Library size={20} style={{ display: 'inline', marginRight: '8px' }} />
                        All Librarians ({librarians.length})
                    </div>
                    <div className={styles.tableActions}>
                        <button className={styles.addButton} onClick={() => setShowModal(true)}>
                            <Plus size={18} />
                            Add Librarian
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
                ) : librarians.length > 0 ? (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Employee ID</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {librarians.map((lib) => (
                                <tr key={lib.id}>
                                    <td>#{lib.id}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                            <div style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: 'var(--radius-full)',
                                                background: 'var(--warning-50)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'var(--warning-600)',
                                                fontSize: 'var(--text-xs)',
                                                fontWeight: 'var(--font-medium)',
                                            }}>
                                                {lib.firstName?.[0]}{lib.lastName?.[0]}
                                            </div>
                                            {lib.firstName} {lib.lastName}
                                        </div>
                                    </td>
                                    <td>{lib.email}</td>
                                    <td>{lib.employeeId || lib.additionalId || '-'}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                                            <button
                                                className={`${styles.actionBtn} ${styles.view}`}
                                                title="View Details"
                                                onClick={() => handleViewLibrarian(lib)}
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                className={`${styles.actionBtn} ${styles.edit}`}
                                                title="Edit"
                                                onClick={() => handleEditLibrarian(lib)}
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                className={`${styles.actionBtn} ${styles.delete}`}
                                                title="Delete"
                                                onClick={() => handleDeleteLibrarian(lib)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className={styles.emptyState}>
                        <Library size={48} />
                        <p>No librarians found</p>
                        <Button variant="primary" onClick={() => setShowModal(true)} style={{ marginTop: 'var(--space-4)' }}>
                            <Plus size={16} /> Add First Librarian
                        </Button>
                    </div>
                )}
            </div>

            {/* Create Librarian Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Add New Librarian"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleSubmit} loading={creating}>Create Librarian</Button>
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

                    <div className={formStyles.row}>
                        <div className={formStyles.formGroup}>
                            <label className={formStyles.label}>First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className={formStyles.input}
                                placeholder="Sarah"
                            />
                        </div>
                        <div className={formStyles.formGroup}>
                            <label className={formStyles.label}>Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className={formStyles.input}
                                placeholder="Connor"
                            />
                        </div>
                    </div>

                    <div className={formStyles.formGroup}>
                        <label className={formStyles.label}>Employee ID</label>
                        <input
                            type="text"
                            name="additionalId"
                            value={formData.additionalId}
                            onChange={handleChange}
                            className={formStyles.input}
                            placeholder="501"
                        />
                    </div>

                    <div className={formStyles.formGroup}>
                        <label className={formStyles.label}>Email (Auto-generated)</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={formStyles.input}
                            placeholder="firstname.lastname.id@sms.edu.in"
                            style={{ background: 'var(--bg-tertiary)' }}
                        />
                    </div>

                    <div className={formStyles.formGroup}>
                        <label className={formStyles.label}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={formStyles.input}
                            placeholder="Min. 8 characters"
                        />
                    </div>
                </form>
            </Modal>

            {/* View Librarian Modal */}
            {showViewModal && selectedLibrarian && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                }}>
                    <div style={{
                        background: 'var(--bg-primary)',
                        borderRadius: 'var(--radius-lg)',
                        width: '100%',
                        maxWidth: '500px',
                        boxShadow: 'var(--shadow-xl)',
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: 'var(--space-4) var(--space-6)',
                            borderBottom: '1px solid var(--border-primary)',
                        }}>
                            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' }}>
                                Librarian Details
                            </h2>
                            <button
                                onClick={() => { setShowViewModal(false); setSelectedLibrarian(null); }}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div style={{ padding: 'var(--space-6)' }}>
                            <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                                <div><strong>Name:</strong> {selectedLibrarian.firstName} {selectedLibrarian.lastName}</div>
                                <div><strong>Email:</strong> {selectedLibrarian.email}</div>
                                <div><strong>Employee ID:</strong> {selectedLibrarian.employeeId || selectedLibrarian.additionalId || '-'}</div>
                                <div><strong>Phone:</strong> {selectedLibrarian.phone || 'Not provided'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Librarian Modal */}
            {showEditModal && selectedLibrarian && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                }}>
                    <div style={{
                        background: 'var(--bg-primary)',
                        borderRadius: 'var(--radius-lg)',
                        width: '100%',
                        maxWidth: '500px',
                        boxShadow: 'var(--shadow-xl)',
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: 'var(--space-4) var(--space-6)',
                            borderBottom: '1px solid var(--border-primary)',
                        }}>
                            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' }}>
                                Edit Librarian
                            </h2>
                            <button
                                onClick={() => { setShowEditModal(false); setSelectedLibrarian(null); }}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div style={{ padding: 'var(--space-6)' }}>
                            {editError && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-2)',
                                    padding: 'var(--space-3)',
                                    background: 'var(--error-50)',
                                    color: 'var(--error-600)',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: 'var(--space-4)',
                                }}>
                                    <AlertCircle size={18} />
                                    {editError}
                                </div>
                            )}
                            <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontWeight: 'var(--font-medium)' }}>
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={editFormData.firstName}
                                            onChange={handleEditInputChange}
                                            style={{
                                                width: '100%',
                                                padding: 'var(--space-2) var(--space-3)',
                                                border: '1px solid var(--border-primary)',
                                                borderRadius: 'var(--radius-md)',
                                                fontSize: 'var(--text-sm)',
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontWeight: 'var(--font-medium)' }}>
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={editFormData.lastName}
                                            onChange={handleEditInputChange}
                                            style={{
                                                width: '100%',
                                                padding: 'var(--space-2) var(--space-3)',
                                                border: '1px solid var(--border-primary)',
                                                borderRadius: 'var(--radius-md)',
                                                fontSize: 'var(--text-sm)',
                                            }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontWeight: 'var(--font-medium)' }}>
                                        Phone
                                    </label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={editFormData.phone}
                                        onChange={handleEditInputChange}
                                        placeholder="Enter phone number"
                                        style={{
                                            width: '100%',
                                            padding: 'var(--space-2) var(--space-3)',
                                            border: '1px solid var(--border-primary)',
                                            borderRadius: 'var(--radius-md)',
                                            fontSize: 'var(--text-sm)',
                                        }}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
                                <Button variant="secondary" onClick={() => { setShowEditModal(false); setSelectedLibrarian(null); }}>Cancel</Button>
                                <Button variant="primary" onClick={handleSaveEdit} loading={editLoading}>Save Changes</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && selectedLibrarian && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                }}>
                    <div style={{
                        background: 'var(--bg-primary)',
                        borderRadius: 'var(--radius-lg)',
                        width: '100%',
                        maxWidth: '400px',
                        boxShadow: 'var(--shadow-xl)',
                        padding: 'var(--space-6)',
                    }}>
                        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-4)' }}>
                            Delete Librarian
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
                            Are you sure you want to delete <strong>{selectedLibrarian.firstName} {selectedLibrarian.lastName}</strong>? This action cannot be undone and will also remove their user account.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                            <Button variant="secondary" onClick={() => { setShowDeleteConfirm(false); setSelectedLibrarian(null); }}>Cancel</Button>
                            <Button variant="danger" onClick={confirmDelete} loading={deleteLoading}>Delete</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LibrariansPage;
