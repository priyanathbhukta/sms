import { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin.api';
import { logger } from '../../utils/constants';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import {
    Loader2,
    BookOpen,
    Plus,
    Edit2,
    AlertCircle,
} from 'lucide-react';
import styles from '../../components/common/DataTable.module.css';
import formStyles from '../../components/common/Form.module.css';

const SubjectsPage = () => {
    const [subjects, setSubjects] = useState([]);
    const [classes, setClasses] = useState([]);
    const [faculty, setFaculty] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        classId: '',
        facultyId: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [subjectsData, classesData, facultyData] = await Promise.all([
                adminApi.getSubjects(),
                adminApi.getClasses(),
                adminApi.getFaculty(0, 100).then(d => d.content || d),
            ]);

            setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
            setClasses(Array.isArray(classesData) ? classesData : []);
            setFaculty(Array.isArray(facultyData) ? facultyData : []);
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.code) {
            setError('Name and code are required');
            return;
        }

        if (!formData.classId) {
            setError('Please select a class');
            return;
        }

        if (!formData.facultyId) {
            setError('Please select a faculty');
            return;
        }

        try {
            setCreating(true);
            await adminApi.createSubject({
                name: formData.name,
                code: formData.code,
                classId: parseInt(formData.classId),
                facultyId: parseInt(formData.facultyId),
            });
            setShowModal(false);
            setFormData({ name: '', code: '', classId: '', facultyId: '' });
            fetchData();
        } catch (err) {
            logger.error('Error creating subject:', err);
            const errorMsg = err.response?.data?.message || err.response?.data || 'Failed to create subject';
            setError(typeof errorMsg === 'string' ? errorMsg : 'Failed to create subject');
        } finally {
            setCreating(false);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: 'var(--space-6)' }}>
                <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-1)' }}>
                    Subject Management
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Create and manage subjects
                </p>
            </div>

            <div className={styles.dataTable}>
                <div className={styles.tableHeader}>
                    <div className={styles.tableTitle}>
                        <BookOpen size={20} style={{ display: 'inline', marginRight: '8px' }} />
                        All Subjects ({subjects.length})
                    </div>
                    <button className={styles.addButton} onClick={() => setShowModal(true)}>
                        <Plus size={18} />
                        Add Subject
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
                ) : subjects.length > 0 ? (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Code</th>
                                <th>Class</th>
                                <th>Faculty</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.map((subject) => (
                                <tr key={subject.id}>
                                    <td>#{subject.id}</td>
                                    <td>{subject.name}</td>
                                    <td>
                                        <span className={`${styles.badge} ${styles.info}`}>
                                            {subject.code}
                                        </span>
                                    </td>
                                    <td>{subject.className || subject.classId || '-'}</td>
                                    <td>{subject.facultyName || subject.facultyId || '-'}</td>
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
                        <BookOpen size={48} />
                        <p>No subjects created yet</p>
                        <Button variant="primary" onClick={() => setShowModal(true)} style={{ marginTop: 'var(--space-4)' }}>
                            <Plus size={16} /> Create First Subject
                        </Button>
                    </div>
                )}
            </div>

            {/* Create Subject Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Create New Subject"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleSubmit} loading={creating}>Create Subject</Button>
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
                            <label className={formStyles.label}>Subject Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={formStyles.input}
                                placeholder="Mathematics"
                            />
                        </div>
                        <div className={formStyles.formGroup}>
                            <label className={formStyles.label}>Subject Code</label>
                            <input
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                className={formStyles.input}
                                placeholder="MATH101"
                            />
                        </div>
                    </div>

                    <div className={formStyles.row}>
                        <div className={formStyles.formGroup}>
                            <label className={formStyles.label}>Class <span style={{ color: 'var(--error-500)' }}>*</span></label>
                            <select name="classId" value={formData.classId} onChange={handleChange} className={formStyles.select}>
                                <option value="">Select Class</option>
                                {classes.map(c => (
                                    <option key={c.id} value={c.id}>Grade {c.gradeLevel} - {c.section}</option>
                                ))}
                            </select>
                        </div>
                        <div className={formStyles.formGroup}>
                            <label className={formStyles.label}>Faculty <span style={{ color: 'var(--error-500)' }}>*</span></label>
                            <select name="facultyId" value={formData.facultyId} onChange={handleChange} className={formStyles.select}>
                                <option value="">Select Faculty</option>
                                {faculty.map(f => (
                                    <option key={f.facultyId || f.id} value={f.facultyId || f.id}>{f.firstName} {f.lastName}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default SubjectsPage;
