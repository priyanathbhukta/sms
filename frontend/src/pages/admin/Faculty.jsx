import { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin.api';
import { logger } from '../../utils/constants';
import {
    Search,
    Loader2,
    UserCog,
    Eye,
    Edit2,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Plus,
    X,
    CheckCircle,
    AlertCircle,
    Mail,
    Phone,
    Building,
    Briefcase,
} from 'lucide-react';
import styles from '../../components/common/DataTable.module.css';

const FacultyPage = () => {
    const [faculty, setFaculty] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 10;

    // Add Faculty Modal State
    const [showAddModal, setShowAddModal] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [addError, setAddError] = useState('');
    const [addSuccess, setAddSuccess] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        personalEmail: '',
        department: '',
        additionalId: '',
        phone: '',
    });

    // View/Edit/Delete Modal State
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        fetchFaculty();
    }, [page]);

    const fetchFaculty = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getFaculty(page, pageSize, 'firstName');
            logger.log('Faculty data:', data);

            if (data.content) {
                setFaculty(data.content);
                setTotalPages(data.totalPages || 0);
                setTotalElements(data.totalElements || 0);
            } else if (Array.isArray(data)) {
                setFaculty(data);
            }
        } catch (err) {
            logger.error('Error fetching faculty:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            fetchFaculty();
            return;
        }

        try {
            setLoading(true);
            const data = await adminApi.searchFaculty(searchTerm, 0, pageSize);
            logger.log('Search results:', data);

            if (data.content) {
                setFaculty(data.content);
                setTotalPages(data.totalPages || 0);
                setTotalElements(data.totalElements || 0);
            } else if (Array.isArray(data)) {
                setFaculty(data);
            }
            setPage(0);
        } catch (err) {
            logger.error('Error searching faculty:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setAddError('');
    };

    const handleAddFaculty = async (e) => {
        e.preventDefault();
        setAddError('');
        setAddSuccess(null);

        // Validation
        if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.personalEmail.trim()) {
            setAddError('First name, last name, and personal email are required');
            return;
        }

        if (!formData.department.trim()) {
            setAddError('Department is required for faculty');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(formData.personalEmail)) {
            setAddError('Please enter a valid email address');
            return;
        }

        setAddLoading(true);

        try {
            const requestData = {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                personalEmail: formData.personalEmail.trim(),
                department: formData.department.trim(),
                additionalId: formData.additionalId.trim() || null,
                phone: formData.phone.trim() || null,
            };

            const response = await adminApi.registerFaculty(requestData);
            logger.info('Faculty registered:', response);

            setAddSuccess({
                message: response.message,
                email: response.generatedEmail,
                emailSent: response.emailSent,
            });

            // Reset form
            setFormData({
                firstName: '',
                lastName: '',
                personalEmail: '',
                department: '',
                additionalId: '',
                phone: '',
            });

            // Refresh faculty list
            fetchFaculty();

        } catch (err) {
            const message = err.response?.data?.message || 'Failed to register faculty';
            setAddError(message);
            logger.error('Error registering faculty:', err);
        } finally {
            setAddLoading(false);
        }
    };

    const closeModal = () => {
        setShowAddModal(false);
        setAddError('');
        setAddSuccess(null);
        setFormData({
            firstName: '',
            lastName: '',
            personalEmail: '',
            department: '',
            additionalId: '',
            phone: '',
        });
    };

    // View Faculty Handler
    const handleViewFaculty = (fac) => {
        setSelectedFaculty(fac);
        setShowViewModal(true);
    };

    // Edit Faculty Handler
    const handleEditFaculty = (fac) => {
        setSelectedFaculty(fac);
        setEditFormData({
            firstName: fac.firstName || '',
            lastName: fac.lastName || '',
            department: fac.department || '',
            phone: fac.phone || '',
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

        // Validation
        if (!editFormData.firstName?.trim() || !editFormData.lastName?.trim()) {
            setEditError('First name and Last name are required');
            setEditLoading(false);
            return;
        }

        if (!editFormData.department?.trim()) {
            setEditError('Department is required');
            setEditLoading(false);
            return;
        }

        try {
            await adminApi.updateFaculty(selectedFaculty.id, {
                firstName: editFormData.firstName,
                lastName: editFormData.lastName,
                department: editFormData.department,
                phone: editFormData.phone,
            });

            setShowEditModal(false);
            setSelectedFaculty(null);
            fetchFaculty(); // Refresh list
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to update faculty';
            setEditError(message);
            logger.error('Error updating faculty:', err);
        } finally {
            setEditLoading(false);
        }
    };

    // Delete Faculty Handler
    const handleDeleteFaculty = (fac) => {
        setSelectedFaculty(fac);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        setDeleteLoading(true);

        try {
            await adminApi.deleteFaculty(selectedFaculty.id);
            setShowDeleteConfirm(false);
            setSelectedFaculty(null);
            fetchFaculty(); // Refresh list
        } catch (err) {
            logger.error('Error deleting faculty:', err);
            alert(err.response?.data?.message || 'Failed to delete faculty');
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: 'var(--space-6)' }}>
                <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-1)' }}>
                    Faculty Management
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    View and manage all faculty members
                </p>
            </div>

            <div className={styles.dataTable}>
                <div className={styles.tableHeader}>
                    <div className={styles.tableTitle}>
                        <UserCog size={20} style={{ display: 'inline', marginRight: '8px' }} />
                        All Faculty ({totalElements})
                    </div>
                    <div className={styles.tableActions}>
                        <div className={styles.searchWrapper}>
                            <Search className={styles.searchIcon} size={18} />
                            <input
                                type="text"
                                placeholder="Search by name..."
                                className={styles.searchInput}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-2)',
                                background: 'var(--primary-500)',
                                color: 'white',
                                border: 'none',
                                padding: 'var(--space-2) var(--space-4)',
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                                fontWeight: 'var(--font-medium)',
                            }}
                        >
                            <Plus size={18} />
                            Add Faculty
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
                ) : faculty.length > 0 ? (
                    <>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Employee ID</th>
                                    <th>Department</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {faculty.map((fac) => (
                                    <tr key={fac.id}>
                                        <td>#{fac.id}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                                <div style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: 'var(--radius-full)',
                                                    background: 'var(--info-50)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'var(--info-600)',
                                                    fontSize: 'var(--text-xs)',
                                                    fontWeight: 'var(--font-medium)',
                                                }}>
                                                    {fac.profileImageUrl ? (
                                                        <img
                                                            src={`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}${fac.profileImageUrl}`}
                                                            alt=""
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-full)' }}
                                                        />
                                                    ) : (
                                                        <>{fac.firstName?.[0]}{fac.lastName?.[0]}</>
                                                    )}
                                                </div>
                                                {fac.firstName} {fac.lastName}
                                            </div>
                                        </td>
                                        <td>{fac.email}</td>
                                        <td>{fac.employeeId || fac.additionalId || '-'}</td>
                                        <td>
                                            {fac.department ? (
                                                <span className={`${styles.badge} ${styles.primary}`}>
                                                    {fac.department}
                                                </span>
                                            ) : (
                                                <span style={{ color: 'var(--text-muted)' }}>-</span>
                                            )}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                                                <button
                                                    className={`${styles.actionBtn} ${styles.view}`}
                                                    title="View Details"
                                                    onClick={() => handleViewFaculty(fac)}
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    className={`${styles.actionBtn} ${styles.edit}`}
                                                    title="Edit"
                                                    onClick={() => handleEditFaculty(fac)}
                                                    style={{ color: 'var(--warning-600)', background: 'var(--warning-50)' }}
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    className={`${styles.actionBtn} ${styles.delete}`}
                                                    title="Delete"
                                                    onClick={() => handleDeleteFaculty(fac)}
                                                    style={{ color: 'var(--error-600)', background: 'var(--error-50)' }}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className={styles.pagination}>
                            <div className={styles.paginationInfo}>
                                Showing {page * pageSize + 1} to {Math.min((page + 1) * pageSize, totalElements)} of {totalElements}
                            </div>
                            <div className={styles.paginationButtons}>
                                <button
                                    className={styles.pageBtn}
                                    disabled={page === 0}
                                    onClick={() => setPage(p => p - 1)}
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                {[...Array(Math.min(5, totalPages))].map((_, i) => (
                                    <button
                                        key={i}
                                        className={`${styles.pageBtn} ${page === i ? styles.active : ''}`}
                                        onClick={() => setPage(i)}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    className={styles.pageBtn}
                                    disabled={page >= totalPages - 1}
                                    onClick={() => setPage(p => p + 1)}
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className={styles.emptyState}>
                        <UserCog size={48} />
                        <p>No faculty members found</p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            style={{
                                marginTop: 'var(--space-4)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-2)',
                                background: 'var(--primary-500)',
                                color: 'white',
                                border: 'none',
                                padding: 'var(--space-2) var(--space-4)',
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                            }}
                        >
                            <Plus size={18} />
                            Add First Faculty
                        </button>
                    </div>
                )}
            </div>

            {/* Add Faculty Modal */}
            {showAddModal && (
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
                        maxHeight: '90vh',
                        overflow: 'auto',
                        boxShadow: 'var(--shadow-xl)',
                    }}>
                        {/* Modal Header */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: 'var(--space-4) var(--space-6)',
                            borderBottom: '1px solid var(--border-primary)',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                <UserCog size={24} style={{ color: 'var(--primary-500)' }} />
                                <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' }}>
                                    Add New Faculty
                                </h2>
                            </div>
                            <button
                                onClick={closeModal}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--text-secondary)',
                                }}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div style={{ padding: 'var(--space-6)' }}>
                            {addSuccess ? (
                                <div style={{ textAlign: 'center' }}>
                                    <CheckCircle size={64} style={{ color: 'var(--success-500)', marginBottom: 'var(--space-4)' }} />
                                    <h3 style={{ marginBottom: 'var(--space-2)' }}>Faculty Registered!</h3>
                                    <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
                                        {addSuccess.message}
                                    </p>
                                    <div style={{
                                        background: 'var(--bg-secondary)',
                                        padding: 'var(--space-4)',
                                        borderRadius: 'var(--radius-md)',
                                        marginBottom: 'var(--space-4)',
                                    }}>
                                        <p style={{ fontWeight: 'var(--font-medium)', marginBottom: 'var(--space-2)' }}>
                                            Login Credentials:
                                        </p>
                                        <p style={{ fontFamily: 'monospace', color: 'var(--primary-600)' }}>
                                            Email: {addSuccess.email}
                                        </p>
                                        <p style={{ fontFamily: 'monospace', color: 'var(--primary-600)' }}>
                                            Password: password123
                                        </p>
                                    </div>
                                    <button
                                        onClick={closeModal}
                                        style={{
                                            background: 'var(--primary-500)',
                                            color: 'white',
                                            border: 'none',
                                            padding: 'var(--space-2) var(--space-6)',
                                            borderRadius: 'var(--radius-md)',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Done
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleAddFaculty}>
                                    {addError && (
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
                                            {addError}
                                        </div>
                                    )}

                                    <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontWeight: 'var(--font-medium)' }}>
                                                    First Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleInputChange}
                                                    placeholder="Jane"
                                                    required
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
                                                    Last Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                    placeholder="Smith"
                                                    required
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
                                                Personal Email * <span style={{ fontWeight: 'normal', color: 'var(--text-muted)' }}>(credentials sent here)</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="personalEmail"
                                                value={formData.personalEmail}
                                                onChange={handleInputChange}
                                                placeholder="faculty@gmail.com"
                                                required
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
                                                Department *
                                            </label>
                                            <input
                                                type="text"
                                                name="department"
                                                value={formData.department}
                                                onChange={handleInputChange}
                                                placeholder="Science, Mathematics, etc."
                                                required
                                                style={{
                                                    width: '100%',
                                                    padding: 'var(--space-2) var(--space-3)',
                                                    border: '1px solid var(--border-primary)',
                                                    borderRadius: 'var(--radius-md)',
                                                    fontSize: 'var(--text-sm)',
                                                }}
                                            />
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontWeight: 'var(--font-medium)' }}>
                                                    Employee ID
                                                </label>
                                                <input
                                                    type="text"
                                                    name="additionalId"
                                                    value={formData.additionalId}
                                                    onChange={handleInputChange}
                                                    placeholder="101"
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
                                                    Phone
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    placeholder="9876543210"
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

                                        <div style={{
                                            background: 'var(--info-50)',
                                            padding: 'var(--space-3)',
                                            borderRadius: 'var(--radius-md)',
                                            fontSize: 'var(--text-sm)',
                                            color: 'var(--info-700)',
                                        }}>
                                            💡 A system email (firstname.lastname.id@sms.edu.in) will be generated automatically.
                                            Default password is <strong>password123</strong> (must change on first login).
                                        </div>
                                    </div>

                                    {/* Modal Footer */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        gap: 'var(--space-3)',
                                        marginTop: 'var(--space-6)',
                                    }}>
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            style={{
                                                padding: 'var(--space-2) var(--space-4)',
                                                border: '1px solid var(--border-primary)',
                                                borderRadius: 'var(--radius-md)',
                                                background: 'var(--bg-primary)',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={addLoading}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 'var(--space-2)',
                                                padding: 'var(--space-2) var(--space-4)',
                                                background: 'var(--primary-500)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: 'var(--radius-md)',
                                                cursor: addLoading ? 'not-allowed' : 'pointer',
                                                opacity: addLoading ? 0.7 : 1,
                                            }}
                                        >
                                            {addLoading ? (
                                                <>
                                                    <Loader2 size={16} className="spin" />
                                                    Registering...
                                                </>
                                            ) : (
                                                <>
                                                    <Plus size={16} />
                                                    Register Faculty
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* View Faculty Modal */}
            {showViewModal && selectedFaculty && (
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
                                Faculty Details
                            </h2>
                            <button
                                onClick={() => { setShowViewModal(false); setSelectedFaculty(null); }}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div style={{ padding: 'var(--space-6)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: 'var(--radius-full)',
                                    background: 'var(--info-50)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--info-600)',
                                    fontSize: 'var(--text-xl)',
                                    fontWeight: 'var(--font-bold)',
                                }}>
                                    {selectedFaculty.firstName?.[0]}{selectedFaculty.lastName?.[0]}
                                </div>
                                <div>
                                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' }}>
                                        {selectedFaculty.firstName} {selectedFaculty.lastName}
                                    </h3>
                                    <p style={{ color: 'var(--text-muted)' }}>ID: #{selectedFaculty.id}</p>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                    <Mail size={18} style={{ color: 'var(--text-muted)' }} />
                                    <span>{selectedFaculty.email || '-'}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                    <Briefcase size={18} style={{ color: 'var(--text-muted)' }} />
                                    <span>Employee ID: {selectedFaculty.employeeId || selectedFaculty.additionalId || '-'}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                    <Building size={18} style={{ color: 'var(--text-muted)' }} />
                                    <span>Department: {selectedFaculty.department || '-'}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                    <Phone size={18} style={{ color: 'var(--text-muted)' }} />
                                    <span>Phone: {selectedFaculty.phone || '-'}</span>
                                </div>
                            </div>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            padding: 'var(--space-4) var(--space-6)',
                            borderTop: '1px solid var(--border-primary)',
                        }}>
                            <button
                                onClick={() => { setShowViewModal(false); setSelectedFaculty(null); }}
                                style={{
                                    padding: 'var(--space-2) var(--space-4)',
                                    background: 'var(--primary-500)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    cursor: 'pointer',
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Faculty Modal */}
            {showEditModal && selectedFaculty && (
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
                                Edit Faculty
                            </h2>
                            <button
                                onClick={() => { setShowEditModal(false); setSelectedFaculty(null); }}
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

                            <p style={{ marginBottom: 'var(--space-4)', color: 'var(--text-secondary)' }}>
                                Editing: <strong>{selectedFaculty.firstName} {selectedFaculty.lastName}</strong>
                            </p>

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
                                            placeholder="First name"
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
                                            placeholder="Last name"
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
                                        Department
                                    </label>
                                    <input
                                        type="text"
                                        name="department"
                                        value={editFormData.department}
                                        onChange={handleEditInputChange}
                                        placeholder="Science, Mathematics, etc."
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
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={editFormData.phone}
                                        onChange={handleEditInputChange}
                                        placeholder="9876543210"
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
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 'var(--space-3)',
                            padding: 'var(--space-4) var(--space-6)',
                            borderTop: '1px solid var(--border-primary)',
                        }}>
                            <button
                                onClick={() => { setShowEditModal(false); setSelectedFaculty(null); }}
                                style={{
                                    padding: 'var(--space-2) var(--space-4)',
                                    border: '1px solid var(--border-primary)',
                                    borderRadius: 'var(--radius-md)',
                                    background: 'var(--bg-primary)',
                                    cursor: 'pointer',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                disabled={editLoading}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-2)',
                                    padding: 'var(--space-2) var(--space-4)',
                                    background: 'var(--primary-500)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    cursor: editLoading ? 'not-allowed' : 'pointer',
                                    opacity: editLoading ? 0.7 : 1,
                                }}
                            >
                                {editLoading ? <Loader2 size={16} className="spin" /> : <CheckCircle size={16} />}
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && selectedFaculty && (
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
                        textAlign: 'center',
                    }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: 'var(--radius-full)',
                            background: 'var(--error-50)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto var(--space-4)',
                        }}>
                            <Trash2 size={32} style={{ color: 'var(--error-500)' }} />
                        </div>
                        <h3 style={{ marginBottom: 'var(--space-2)' }}>Delete Faculty?</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
                            Are you sure you want to delete <strong>{selectedFaculty.firstName} {selectedFaculty.lastName}</strong>?
                            This action cannot be undone.
                        </p>
                        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
                            <button
                                onClick={() => { setShowDeleteConfirm(false); setSelectedFaculty(null); }}
                                style={{
                                    padding: 'var(--space-2) var(--space-4)',
                                    border: '1px solid var(--border-primary)',
                                    borderRadius: 'var(--radius-md)',
                                    background: 'var(--bg-primary)',
                                    cursor: 'pointer',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={deleteLoading}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-2)',
                                    padding: 'var(--space-2) var(--space-4)',
                                    background: 'var(--error-500)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    cursor: deleteLoading ? 'not-allowed' : 'pointer',
                                    opacity: deleteLoading ? 0.7 : 1,
                                }}
                            >
                                {deleteLoading ? <Loader2 size={16} className="spin" /> : <Trash2 size={16} />}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FacultyPage;
