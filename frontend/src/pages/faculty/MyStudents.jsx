import { useState, useEffect } from 'react';
import { facultyApi } from '../../api/faculty.api';
import { logger } from '../../utils/constants';
import {
    Loader2,
    Users,
    Eye,
    ChevronLeft,
    ChevronRight,
    GraduationCap,
} from 'lucide-react';
import styles from '../../components/common/DataTable.module.css';
import formStyles from '../../components/common/Form.module.css';

const MyStudentsPage = () => {
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClass, setSelectedClass] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 10;

    useEffect(() => {
        fetchClasses();
    }, []);

    useEffect(() => {
        if (selectedClass) {
            setPage(0);
            fetchStudents();
        }
    }, [selectedClass]);

    useEffect(() => {
        if (selectedClass) {
            fetchStudents();
        }
    }, [page]);

    const fetchClasses = async () => {
        try {
            setLoading(true);
            const data = await facultyApi.getMyClasses();
            logger.log('My classes:', data);
            const classList = Array.isArray(data) ? data : [];
            setClasses(classList);

            // Auto-select first class if available
            if (classList.length > 0) {
                setSelectedClass(classList[0].id.toString());
            }
        } catch (err) {
            logger.error('Error fetching classes:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const data = await facultyApi.getStudentsInClass(selectedClass);
            logger.log('Students in class:', data);

            if (data.content) {
                setStudents(data.content);
                setTotalPages(data.totalPages || 0);
            } else if (Array.isArray(data)) {
                setStudents(data);
                setTotalPages(1);
            }
        } catch (err) {
            logger.error('Error fetching students:', err);
        } finally {
            setLoading(false);
        }
    };

    const getCurrentClassName = () => {
        const cls = classes.find(c => c.id.toString() === selectedClass);
        return cls ? `Grade ${cls.gradeLevel} - ${cls.section}` : '';
    };

    return (
        <div>
            <div style={{ marginBottom: 'var(--space-6)' }}>
                <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-1)' }}>
                    My Students
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Students in your assigned classes
                </p>
            </div>

            {/* Class Selector */}
            <div style={{
                background: 'var(--surface)',
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-xl)',
                marginBottom: 'var(--space-6)',
                boxShadow: 'var(--shadow-sm)',
            }}>
                <div className={formStyles.formGroup} style={{ marginBottom: 0, maxWidth: '300px' }}>
                    <label className={formStyles.label}>
                        <GraduationCap size={14} style={{ marginRight: '6px', display: 'inline' }} />
                        Select Class
                    </label>
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className={formStyles.select}
                        disabled={loading && classes.length === 0}
                    >
                        <option value="">Choose a class</option>
                        {classes.map(c => (
                            <option key={c.id} value={c.id}>
                                Grade {c.gradeLevel} - {c.section} ({c.studentCount || 0} students)
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className={styles.dataTable}>
                <div className={styles.tableHeader}>
                    <div className={styles.tableTitle}>
                        <Users size={20} style={{ display: 'inline', marginRight: '8px' }} />
                        {selectedClass ? `${getCurrentClassName()} (${students.length} students)` : 'Select a class to view students'}
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
                ) : !selectedClass ? (
                    <div className={styles.emptyState}>
                        <GraduationCap size={48} />
                        <p>Please select a class from the dropdown above</p>
                    </div>
                ) : students.length > 0 ? (
                    <>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Registration No.</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr key={student.id}>
                                        <td>#{student.id}</td>
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
                                        <td>{student.registrationNumber || 'N/A'}</td>
                                        <td>
                                            <button className={`${styles.actionBtn} ${styles.view}`} title="View Details">
                                                <Eye size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {totalPages > 1 && (
                            <div className={styles.pagination}>
                                <div className={styles.paginationButtons}>
                                    <button
                                        className={styles.pageBtn}
                                        disabled={page === 0}
                                        onClick={() => setPage(p => p - 1)}
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <span style={{ padding: '0 var(--space-3)' }}>Page {page + 1} of {totalPages}</span>
                                    <button
                                        className={styles.pageBtn}
                                        disabled={page >= totalPages - 1}
                                        onClick={() => setPage(p => p + 1)}
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className={styles.emptyState}>
                        <Users size={48} />
                        <p>No students in this class</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyStudentsPage;
