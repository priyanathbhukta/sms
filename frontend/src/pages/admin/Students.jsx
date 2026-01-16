import { useState, useEffect, useMemo } from 'react';
import { adminApi } from '../../api/admin.api';
import { logger } from '../../utils/constants';
import {
    Search,
    Loader2,
    Users,
    Eye,
    Edit2,
    Trash2,
    ChevronLeft,
    ChevronRight,
    GraduationCap,
    Plus,
    X,
    Mail,
    Phone,
    CheckCircle,
    AlertCircle,
    MapPin,
    Calendar,
    BookOpen,
} from 'lucide-react';
import styles from '../../components/common/DataTable.module.css';

const StudentsPage = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 10;

    // Add Student Modal State
    const [showAddModal, setShowAddModal] = useState(false);
    const [classes, setClasses] = useState([]);
    const [addLoading, setAddLoading] = useState(false);
    const [addError, setAddError] = useState('');
    const [addSuccess, setAddSuccess] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        personalEmail: '',
        additionalId: String(new Date().getFullYear()),
        phone: '',
        classId: '',
    });

    // View/Edit/Delete Modal State
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Generate email preview based on form data
    const emailPreview = useMemo(() => {
        const firstName = formData.firstName.trim().toLowerCase().replace(/\s+/g, '');
        const lastName = formData.lastName.trim().toLowerCase().replace(/\s+/g, '');
        const year = formData.additionalId.trim() || String(new Date().getFullYear());

        if (firstName && lastName) {
            return `${firstName}.${lastName}.${year}@sms.edu.in`;
        }
        return '';
    }, [formData.firstName, formData.lastName, formData.additionalId]);

    useEffect(() => {
        fetchStudents();
        fetchClasses();
    }, [page]);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getStudents(page, pageSize, 'firstName');
            logger.log('Students data:', data);

            if (data.content) {
                setStudents(data.content);
                setTotalPages(data.totalPages || 0);
                setTotalElements(data.totalElements || 0);
            } else if (Array.isArray(data)) {
                setStudents(data);
            }
        } catch (err) {
            logger.error('Error fetching students:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchClasses = async () => {
        try {
            const data = await adminApi.getClasses();
            setClasses(Array.isArray(data) ? data : []);
        } catch (err) {
            logger.error('Error fetching classes:', err);
        }
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            fetchStudents();
            return;
        }

        try {
            setLoading(true);
            const data = await adminApi.searchStudents(searchTerm, 0, pageSize);
            logger.log('Search results:', data);

            if (data.content) {
                setStudents(data.content);
                setTotalPages(data.totalPages || 0);
                setTotalElements(data.totalElements || 0);
            } else if (Array.isArray(data)) {
                setStudents(data);
            }
            setPage(0);
        } catch (err) {
            logger.error('Error searching students:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setAddError('');
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        setAddError('');
        setAddSuccess(null);

        // Validation
        if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.personalEmail.trim()) {
            setAddError('First name, last name, and personal email are required');
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
                additionalId: formData.additionalId.trim() || String(new Date().getFullYear()),
                phone: formData.phone.trim() || null,
                classId: formData.classId ? parseInt(formData.classId) : null,
            };

            const response = await adminApi.registerStudent(requestData);
            logger.info('Student registered:', response);

            // Check if response indicates failure
            if (response.message && response.message.includes('error')) {
                setAddError(response.message);
                return;
            }

            setAddSuccess({
                message: response.message,
                email: response.generatedEmail || emailPreview,
                emailSent: response.emailSent,
            });

            // Reset form
            setFormData({
                firstName: '',
                lastName: '',
                personalEmail: '',
                additionalId: String(new Date().getFullYear()),
                phone: '',
                classId: '',
            });

            // Refresh student list
            fetchStudents();

        } catch (err) {
            let message = 'Failed to register student';
            if (err.response?.data?.message) {
                message = err.response.data.message;
            } else if (err.response?.data) {
                message = typeof err.response.data === 'string' ? err.response.data : JSON.stringify(err.response.data);
            } else if (err.message) {
                message = err.message;
            }
            setAddError(message);
            logger.error('Error registering student:', err);
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
            additionalId: String(new Date().getFullYear()),
            phone: '',
            classId: '',
        });
    };

    // View Student Handler
    const handleViewStudent = (student) => {
        setSelectedStudent(student);
        setShowViewModal(true);
    };

    // Edit Student Handler
    const handleEditStudent = (student) => {
        setSelectedStudent(student);
        setEditFormData({
            firstName: student.firstName || '',
            lastName: student.lastName || '',
            classId: student.classId || '',
            parentPhone: student.parentPhone || '',
            address: student.address || '',
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
            await adminApi.updateStudent(selectedStudent.studentId || selectedStudent.id, {
                firstName: editFormData.firstName || null,
                lastName: editFormData.lastName || null,
                classId: editFormData.classId ? parseInt(editFormData.classId) : null,
                parentPhone: editFormData.parentPhone || null,
                address: editFormData.address || null,
            });

            setShowEditModal(false);
            setSelectedStudent(null);
            fetchStudents(); // Refresh list
        } catch (err) {
            let message = 'Failed to update student';
            if (err.response?.data?.message) {
                message = err.response.data.message;
            } else if (err.response?.status === 403) {
                message = 'Access denied - you may not have permission to update students';
            } else if (err.response?.status === 404) {
                message = 'Student not found';
            } else if (err.message) {
                message = err.message;
            }
            setEditError(message);
            logger.error('Error updating student:', err);
        } finally {
            setEditLoading(false);
        }
    };

    // Delete Student Handler
    const handleDeleteStudent = (student) => {
        setSelectedStudent(student);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        setDeleteLoading(true);

        try {
            await adminApi.deleteStudent(selectedStudent.studentId || selectedStudent.id);
            setShowDeleteConfirm(false);
            setSelectedStudent(null);
            fetchStudents(); // Refresh list
        } catch (err) {
            logger.error('Error deleting student:', err);
            alert(err.response?.data?.message || 'Failed to delete student');
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: 'var(--space-6)' }}>
                <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-1)' }}>
                    Student Management
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    View and manage all registered students
                </p>
            </div>

            <div className={styles.dataTable}>
                <div className={styles.tableHeader}>
                    <div className={styles.tableTitle}>
                        <Users size={20} style={{ display: 'inline', marginRight: '8px' }} />
                        All Students ({totalElements})
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
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        <button
                            className={styles.addBtn}
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
                            Add Student
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
                ) : students.length > 0 ? (
                    <>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Enrollment Year</th>
                                    <th>Class</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr key={student.id || student.studentId}>
                                        <td>#{student.id || student.studentId}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                                <div style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: 'var(--radius-full)',
                                                    background: 'var(--primary-100)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'var(--primary-600)',
                                                    fontSize: 'var(--text-xs)',
                                                    fontWeight: 'var(--font-medium)',
                                                }}>
                                                    {student.firstName?.[0]}{student.lastName?.[0]}
                                                </div>
                                                {student.firstName} {student.lastName}
                                            </div>
                                        </td>
                                        <td>{student.email}</td>
                                        <td>{student.enrollmentYear || '-'}</td>
                                        <td>
                                            {student.className && student.className !== 'Not Assigned' ? (
                                                <span className={`${styles.badge} ${styles.info}`}>
                                                    {student.className}
                                                </span>
                                            ) : (
                                                <span style={{ color: 'var(--text-muted)' }}>Unassigned</span>
                                            )}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                                                <button
                                                    className={`${styles.actionBtn} ${styles.view}`}
                                                    title="View Details"
                                                    onClick={() => handleViewStudent(student)}
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    className={`${styles.actionBtn} ${styles.edit}`}
                                                    title="Edit"
                                                    onClick={() => handleEditStudent(student)}
                                                    style={{ color: 'var(--warning-600)', background: 'var(--warning-50)' }}
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    className={`${styles.actionBtn} ${styles.delete}`}
                                                    title="Delete"
                                                    onClick={() => handleDeleteStudent(student)}
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

                        {/* Pagination */}
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
                        <GraduationCap size={48} />
                        <p>No students found</p>
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
                            Add First Student
                        </button>
                    </div>
                )}
            </div>

            {/* Add Student Modal */}
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
                                <GraduationCap size={24} style={{ color: 'var(--primary-500)' }} />
                                <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' }}>
                                    Add New Student
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
                                    <h3 style={{ marginBottom: 'var(--space-2)' }}>Student Registered!</h3>
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
                                <form onSubmit={handleAddStudent}>
                                    {addError && (
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: 'var(--space-2)',
                                            padding: 'var(--space-3)',
                                            background: 'var(--error-50)',
                                            color: 'var(--error-600)',
                                            borderRadius: 'var(--radius-md)',
                                            marginBottom: 'var(--space-4)',
                                            fontSize: 'var(--text-sm)',
                                        }}>
                                            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                                            <span>{addError}</span>
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
                                                    placeholder="John"
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
                                                    placeholder="Doe"
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

                                        {/* Email Preview */}
                                        {emailPreview && (
                                            <div style={{
                                                background: 'var(--success-50)',
                                                padding: 'var(--space-3)',
                                                borderRadius: 'var(--radius-md)',
                                                border: '1px solid var(--success-200)',
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                                    <Mail size={16} style={{ color: 'var(--success-600)' }} />
                                                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--success-700)' }}>
                                                        <strong>System Email:</strong> {emailPreview}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontWeight: 'var(--font-medium)' }}>
                                                Personal Email * <span style={{ fontWeight: 'normal', color: 'var(--text-muted)' }}>(credentials will be sent here)</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="personalEmail"
                                                value={formData.personalEmail}
                                                onChange={handleInputChange}
                                                placeholder="student@gmail.com"
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
                                                    Enrollment Year *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="additionalId"
                                                    value={formData.additionalId}
                                                    onChange={handleInputChange}
                                                    placeholder={String(new Date().getFullYear())}
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
                                                    Phone
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    placeholder="1234567890"
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
                                                Assign to Class
                                            </label>
                                            <select
                                                name="classId"
                                                value={formData.classId}
                                                onChange={handleInputChange}
                                                style={{
                                                    width: '100%',
                                                    padding: 'var(--space-2) var(--space-3)',
                                                    border: '1px solid var(--border-primary)',
                                                    borderRadius: 'var(--radius-md)',
                                                    fontSize: 'var(--text-sm)',
                                                    background: 'var(--bg-primary)',
                                                }}
                                            >
                                                <option value="">-- Select Class (Optional) --</option>
                                                {classes.map((cls) => (
                                                    <option key={cls.id} value={cls.id}>
                                                        Grade {cls.gradeLevel} - Section {cls.section} ({cls.academicYear})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div style={{
                                            background: 'var(--info-50)',
                                            padding: 'var(--space-3)',
                                            borderRadius: 'var(--radius-md)',
                                            fontSize: 'var(--text-sm)',
                                            color: 'var(--info-700)',
                                        }}>
                                            💡 Default password is <strong>password123</strong> (must change on first login).
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
                                                    Register Student
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

            {/* View Student Modal */}
            {showViewModal && selectedStudent && (
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
                                Student Details
                            </h2>
                            <button
                                onClick={() => { setShowViewModal(false); setSelectedStudent(null); }}
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
                                    background: 'var(--primary-100)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--primary-600)',
                                    fontSize: 'var(--text-xl)',
                                    fontWeight: 'var(--font-bold)',
                                }}>
                                    {selectedStudent.firstName?.[0]}{selectedStudent.lastName?.[0]}
                                </div>
                                <div>
                                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' }}>
                                        {selectedStudent.firstName} {selectedStudent.lastName}
                                    </h3>
                                    <p style={{ color: 'var(--text-muted)' }}>ID: #{selectedStudent.id || selectedStudent.studentId}</p>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                    <Mail size={18} style={{ color: 'var(--text-muted)' }} />
                                    <span>{selectedStudent.email || '-'}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                    <Calendar size={18} style={{ color: 'var(--text-muted)' }} />
                                    <span>Enrollment Year: {selectedStudent.enrollmentYear || '-'}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                    <BookOpen size={18} style={{ color: 'var(--text-muted)' }} />
                                    <span>Class: {selectedStudent.className || 'Not Assigned'}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                    <Phone size={18} style={{ color: 'var(--text-muted)' }} />
                                    <span>Parent Phone: {selectedStudent.parentPhone || '-'}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                    <MapPin size={18} style={{ color: 'var(--text-muted)' }} />
                                    <span>Address: {selectedStudent.address || '-'}</span>
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
                                onClick={() => { setShowViewModal(false); setSelectedStudent(null); }}
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

            {/* Edit Student Modal */}
            {showEditModal && selectedStudent && (
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
                                Edit Student
                            </h2>
                            <button
                                onClick={() => { setShowEditModal(false); setSelectedStudent(null); }}
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
                                Editing: <strong>{selectedStudent.firstName} {selectedStudent.lastName}</strong>
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
                                        Assign to Class
                                    </label>
                                    <select
                                        name="classId"
                                        value={editFormData.classId}
                                        onChange={handleEditInputChange}
                                        style={{
                                            width: '100%',
                                            padding: 'var(--space-2) var(--space-3)',
                                            border: '1px solid var(--border-primary)',
                                            borderRadius: 'var(--radius-md)',
                                            fontSize: 'var(--text-sm)',
                                            background: 'var(--bg-primary)',
                                        }}
                                    >
                                        <option value="">-- No Class --</option>
                                        {classes.map((cls) => (
                                            <option key={cls.id} value={cls.id}>
                                                Grade {cls.gradeLevel} - Section {cls.section}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontWeight: 'var(--font-medium)' }}>
                                        Parent Phone
                                    </label>
                                    <input
                                        type="tel"
                                        name="parentPhone"
                                        value={editFormData.parentPhone}
                                        onChange={handleEditInputChange}
                                        placeholder="1234567890"
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
                                        Address
                                    </label>
                                    <textarea
                                        name="address"
                                        value={editFormData.address}
                                        onChange={handleEditInputChange}
                                        placeholder="Enter address..."
                                        rows={3}
                                        style={{
                                            width: '100%',
                                            padding: 'var(--space-2) var(--space-3)',
                                            border: '1px solid var(--border-primary)',
                                            borderRadius: 'var(--radius-md)',
                                            fontSize: 'var(--text-sm)',
                                            resize: 'vertical',
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
                                onClick={() => { setShowEditModal(false); setSelectedStudent(null); }}
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
            {showDeleteConfirm && selectedStudent && (
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
                        <h3 style={{ marginBottom: 'var(--space-2)' }}>Delete Student?</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
                            Are you sure you want to delete <strong>{selectedStudent.firstName} {selectedStudent.lastName}</strong>?
                            This action cannot be undone.
                        </p>
                        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
                            <button
                                onClick={() => { setShowDeleteConfirm(false); setSelectedStudent(null); }}
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

export default StudentsPage;
