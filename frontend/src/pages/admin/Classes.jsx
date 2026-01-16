import { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin.api';
import { logger } from '../../utils/constants';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import {
    Loader2,
    School,
    Plus,
    Edit2,
    Trash2,
    AlertCircle,
} from 'lucide-react';
import styles from '../../components/common/DataTable.module.css';
import formStyles from '../../components/common/Form.module.css';

const ClassesPage = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        gradeLevel: '',
        section: '',
        academicYear: new Date().getFullYear(),
    });

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getClasses();
            logger.log('Classes data:', data);
            setClasses(Array.isArray(data) ? data : []);
        } catch (err) {
            logger.error('Error fetching classes:', err);
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

        if (!formData.gradeLevel || !formData.section) {
            setError('Grade level and section are required');
            return;
        }

        try {
            setCreating(true);
            await adminApi.createClass(formData);
            setShowModal(false);
            setFormData({ gradeLevel: '', section: '', academicYear: new Date().getFullYear() });
            fetchClasses();
        } catch (err) {
            logger.error('Error creating class:', err);
            setError(err.response?.data?.message || 'Failed to create class');
        } finally {
            setCreating(false);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: 'var(--space-6)' }}>
                <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-1)' }}>
                    Class Management
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Create and manage academic classes
                </p>
            </div>

            <div className={styles.dataTable}>
                <div className={styles.tableHeader}>
                    <div className={styles.tableTitle}>
                        <School size={20} style={{ display: 'inline', marginRight: '8px' }} />
                        All Classes ({classes.length})
                    </div>
                    <button className={styles.addButton} onClick={() => setShowModal(true)}>
                        <Plus size={18} />
                        Add Class
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
                ) : classes.length > 0 ? (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Grade Level</th>
                                <th>Section</th>
                                <th>Academic Year</th>
                                <th>Students</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classes.map((cls) => (
                                <tr key={cls.id}>
                                    <td>#{cls.id}</td>
                                    <td>
                                        <span className={`${styles.badge} ${styles.primary}`}>
                                            Grade {cls.gradeLevel}
                                        </span>
                                    </td>
                                    <td>{cls.section}</td>
                                    <td>{cls.academicYear}</td>
                                    <td>{cls.studentCount || 0}</td>
                                    <td>
                                        <button className={`${styles.actionBtn} ${styles.edit}`} title="Edit">
                                            <Edit2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className={styles.emptyState}>
                        <School size={48} />
                        <p>No classes created yet</p>
                        <Button variant="primary" onClick={() => setShowModal(true)} style={{ marginTop: 'var(--space-4)' }}>
                            <Plus size={16} /> Create First Class
                        </Button>
                    </div>
                )}
            </div>

            {/* Create Class Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Create New Class"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleSubmit} loading={creating}>Create Class</Button>
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
                            <label className={formStyles.label}>Grade Level</label>
                            <select
                                name="gradeLevel"
                                value={formData.gradeLevel}
                                onChange={handleChange}
                                className={formStyles.select}
                            >
                                <option value="">Select Grade</option>
                                {[...Array(12)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                        </div>
                        <div className={formStyles.formGroup}>
                            <label className={formStyles.label}>Section</label>
                            <select
                                name="section"
                                value={formData.section}
                                onChange={handleChange}
                                className={formStyles.select}
                            >
                                <option value="">Select Section</option>
                                {['A', 'B', 'C', 'D', 'E'].map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={formStyles.formGroup}>
                        <label className={formStyles.label}>Academic Year</label>
                        <input
                            type="number"
                            name="academicYear"
                            value={formData.academicYear}
                            onChange={handleChange}
                            className={formStyles.input}
                            min="2020"
                            max="2030"
                        />
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ClassesPage;
