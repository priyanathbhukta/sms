import { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin.api';
import { logger } from '../../utils/constants';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import {
    Loader2,
    Layers,
    Plus,
    Edit2,
    AlertCircle,
} from 'lucide-react';
import styles from '../../components/common/DataTable.module.css';
import formStyles from '../../components/common/Form.module.css';

const CoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [classes, setClasses] = useState([]);
    const [faculty, setFaculty] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        courseName: '',
        classId: '',
        facultyId: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [coursesData, classesData, facultyData] = await Promise.all([
                adminApi.getCourses(),
                adminApi.getClasses(),
                adminApi.getFaculty(0, 100).then(d => d.content || d),
            ]);

            setCourses(Array.isArray(coursesData) ? coursesData : []);
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

        if (!formData.courseName || !formData.classId) {
            setError('Course name and class are required');
            return;
        }

        try {
            setCreating(true);
            await adminApi.createCourse({
                ...formData,
                classId: parseInt(formData.classId),
                facultyId: formData.facultyId ? parseInt(formData.facultyId) : null,
            });
            setShowModal(false);
            setFormData({ courseName: '', classId: '', facultyId: '' });
            fetchData();
        } catch (err) {
            logger.error('Error creating course:', err);
            setError(err.response?.data?.message || 'Failed to create course');
        } finally {
            setCreating(false);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: 'var(--space-6)' }}>
                <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-1)' }}>
                    Course Management
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Create and manage courses
                </p>
            </div>

            <div className={styles.dataTable}>
                <div className={styles.tableHeader}>
                    <div className={styles.tableTitle}>
                        <Layers size={20} style={{ display: 'inline', marginRight: '8px' }} />
                        All Courses ({courses.length})
                    </div>
                    <button className={styles.addButton} onClick={() => setShowModal(true)}>
                        <Plus size={18} />
                        Add Course
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
                ) : courses.length > 0 ? (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Course Name</th>
                                <th>Class</th>
                                <th>Faculty</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((course) => (
                                <tr key={course.id}>
                                    <td>#{course.id}</td>
                                    <td>{course.courseName}</td>
                                    <td>{course.className || `Class #${course.classId}` || '-'}</td>
                                    <td>{course.facultyName || course.facultyId || '-'}</td>
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
                        <Layers size={48} />
                        <p>No courses created yet</p>
                        <Button variant="primary" onClick={() => setShowModal(true)} style={{ marginTop: 'var(--space-4)' }}>
                            <Plus size={16} /> Create First Course
                        </Button>
                    </div>
                )}
            </div>

            {/* Create Course Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Create New Course"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleSubmit} loading={creating}>Create Course</Button>
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
                        <label className={formStyles.label}>Course Name</label>
                        <input
                            type="text"
                            name="courseName"
                            value={formData.courseName}
                            onChange={handleChange}
                            className={formStyles.input}
                            placeholder="Algebra I"
                        />
                    </div>

                    <div className={formStyles.row}>
                        <div className={formStyles.formGroup}>
                            <label className={formStyles.label}>Class</label>
                            <select name="classId" value={formData.classId} onChange={handleChange} className={formStyles.select}>
                                <option value="">Select Class</option>
                                {classes.map(c => (
                                    <option key={c.id} value={c.id}>Grade {c.gradeLevel} - {c.section}</option>
                                ))}
                            </select>
                        </div>
                        <div className={formStyles.formGroup}>
                            <label className={formStyles.label}>Faculty (Optional)</label>
                            <select name="facultyId" value={formData.facultyId} onChange={handleChange} className={formStyles.select}>
                                <option value="">Select Faculty</option>
                                {faculty.map(f => (
                                    <option key={f.id} value={f.id}>{f.firstName} {f.lastName}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default CoursesPage;
