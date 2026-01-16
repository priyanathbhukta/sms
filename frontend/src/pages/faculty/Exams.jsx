import { useState, useEffect } from 'react';
import { facultyApi } from '../../api/faculty.api';
import { adminApi } from '../../api/admin.api';
import { logger } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import {
    Loader2,
    FileText,
    Plus,
    AlertCircle,
} from 'lucide-react';
import styles from '../../components/common/DataTable.module.css';
import formStyles from '../../components/common/Form.module.css';

const ExamsPage = () => {
    const [exams, setExams] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        examName: '',
        courseId: '',
        examDate: '',
        maxMarks: '100',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [examsData, coursesData] = await Promise.all([
                facultyApi.getExams(),
                adminApi.getCourses(),
            ]);

            setExams(Array.isArray(examsData) ? examsData : []);
            setCourses(Array.isArray(coursesData) ? coursesData : []);
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

        if (!formData.examName || !formData.courseId || !formData.examDate) {
            setError('All fields are required');
            return;
        }

        try {
            setCreating(true);
            await facultyApi.createExam({
                examName: formData.examName,
                courseId: parseInt(formData.courseId),
                examDate: formData.examDate,
                maxMarks: parseInt(formData.maxMarks),
            });
            setShowModal(false);
            setFormData({ examName: '', courseId: '', examDate: '', maxMarks: '100' });
            fetchData();
        } catch (err) {
            logger.error('Error creating exam:', err);
            setError(err.response?.data?.message || 'Failed to create exam');
        } finally {
            setCreating(false);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: 'var(--space-6)' }}>
                <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-1)' }}>
                    Exams Management
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Create and manage exams
                </p>
            </div>

            <div className={styles.dataTable}>
                <div className={styles.tableHeader}>
                    <div className={styles.tableTitle}>
                        <FileText size={20} style={{ display: 'inline', marginRight: '8px' }} />
                        All Exams ({exams.length})
                    </div>
                    <button className={styles.addButton} onClick={() => setShowModal(true)}>
                        <Plus size={18} />
                        Create Exam
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
                ) : exams.length > 0 ? (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Exam Name</th>
                                <th>Course</th>
                                <th>Date</th>
                                <th>Max Marks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {exams.map((exam) => (
                                <tr key={exam.id}>
                                    <td>#{exam.id}</td>
                                    <td style={{ fontWeight: 'var(--font-medium)' }}>{exam.examName}</td>
                                    <td>{exam.courseName || `Course #${exam.courseId}`}</td>
                                    <td>{formatDate(exam.examDate)}</td>
                                    <td>
                                        <span className={`${styles.badge} ${styles.primary}`}>
                                            {exam.maxMarks} marks
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className={styles.emptyState}>
                        <FileText size={48} />
                        <p>No exams created yet</p>
                        <Button variant="primary" onClick={() => setShowModal(true)} style={{ marginTop: 'var(--space-4)' }}>
                            <Plus size={16} /> Create First Exam
                        </Button>
                    </div>
                )}
            </div>

            {/* Create Exam Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Create Exam"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleSubmit} loading={creating}>Create Exam</Button>
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
                        <label className={formStyles.label}>Exam Name</label>
                        <input
                            type="text"
                            name="examName"
                            value={formData.examName}
                            onChange={handleChange}
                            className={formStyles.input}
                            placeholder="Mid-term Examination"
                        />
                    </div>

                    <div className={formStyles.formGroup}>
                        <label className={formStyles.label}>Course</label>
                        <select name="courseId" value={formData.courseId} onChange={handleChange} className={formStyles.select}>
                            <option value="">Select Course</option>
                            {courses.map(c => (
                                <option key={c.id} value={c.id}>{c.courseName}</option>
                            ))}
                        </select>
                    </div>

                    <div className={formStyles.row}>
                        <div className={formStyles.formGroup}>
                            <label className={formStyles.label}>Exam Date</label>
                            <input
                                type="date"
                                name="examDate"
                                value={formData.examDate}
                                onChange={handleChange}
                                className={formStyles.input}
                            />
                        </div>
                        <div className={formStyles.formGroup}>
                            <label className={formStyles.label}>Max Marks</label>
                            <input
                                type="number"
                                name="maxMarks"
                                value={formData.maxMarks}
                                onChange={handleChange}
                                className={formStyles.input}
                                min="1"
                            />
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ExamsPage;
