import { useState, useEffect } from 'react';
import { facultyApi } from '../../api/faculty.api';
import { logger } from '../../utils/constants';
import Button from '../../components/common/Button';
import {
    Loader2,
    BookCheck,
    AlertCircle,
    CheckCircle,
} from 'lucide-react';
import styles from '../../components/common/DataTable.module.css';
import formStyles from '../../components/common/Form.module.css';

const ResultsPage = () => {
    const [exams, setExams] = useState([]);
    const [students, setStudents] = useState([]);
    const [results, setResults] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedExam, setSelectedExam] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchExams();
    }, []);

    useEffect(() => {
        if (selectedExam) {
            fetchResults();
        }
    }, [selectedExam]);

    const fetchExams = async () => {
        try {
            setLoading(true);
            const data = await facultyApi.getExams();
            setExams(Array.isArray(data) ? data : []);
        } catch (err) {
            logger.error('Error fetching exams:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchResults = async () => {
        try {
            const data = await facultyApi.getResultsByExam(selectedExam);
            logger.log('Results:', data);

            // Get students from faculty classes
            const studentsData = await facultyApi.getMyStudents(0, 100);
            const studentList = studentsData.content || studentsData || [];
            setStudents(studentList);

            // Initialize results
            const initial = {};
            studentList.forEach(s => { initial[s.id] = ''; });

            // Fill in existing results
            if (Array.isArray(data)) {
                data.forEach(r => { initial[r.studentId] = r.marksObtained?.toString() || ''; });
            }

            setResults(initial);
        } catch (err) {
            logger.error('Error fetching results:', err);
        }
    };

    const handleResultChange = (studentId, value) => {
        setResults(prev => ({ ...prev, [studentId]: value }));
    };

    const handleSubmit = async () => {
        if (!selectedExam) {
            setError('Please select an exam');
            return;
        }

        try {
            setSaving(true);
            setError('');

            for (const [studentId, marks] of Object.entries(results)) {
                if (marks !== '') {
                    await facultyApi.enterResult({
                        studentId: parseInt(studentId),
                        examId: parseInt(selectedExam),
                        marksObtained: parseFloat(marks),
                    });
                }
            }

            setSuccess('Results saved successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            logger.error('Error saving results:', err);
            setError(err.response?.data?.message || 'Failed to save results');
        } finally {
            setSaving(false);
        }
    };

    const selectedExamData = exams.find(e => e.id.toString() === selectedExam);

    return (
        <div>
            <div style={{ marginBottom: 'var(--space-6)' }}>
                <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-1)' }}>
                    Enter Results
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Record student exam results
                </p>
            </div>

            {/* Exam Selection */}
            <div style={{
                background: 'var(--surface)',
                padding: 'var(--space-5)',
                borderRadius: 'var(--radius-xl)',
                marginBottom: 'var(--space-6)',
                boxShadow: 'var(--shadow-sm)',
            }}>
                <div className={formStyles.formGroup} style={{ marginBottom: 0 }}>
                    <label className={formStyles.label}>Select Exam</label>
                    <select
                        value={selectedExam}
                        onChange={(e) => setSelectedExam(e.target.value)}
                        className={formStyles.select}
                        style={{ maxWidth: '400px' }}
                    >
                        <option value="">Select an exam</option>
                        {exams.map(e => (
                            <option key={e.id} value={e.id}>{e.examName} (Max: {e.maxMarks})</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Alerts */}
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

            {/* Results Entry */}
            {loading ? (
                <div className={styles.loading}>
                    <Loader2 size={32} className="spin" />
                    <style>{`
            .spin { animation: spin 1s linear infinite; }
            @keyframes spin { to { transform: rotate(360deg); } }
          `}</style>
                </div>
            ) : selectedExam && students.length > 0 ? (
                <div className={styles.dataTable}>
                    <div className={styles.tableHeader}>
                        <div className={styles.tableTitle}>
                            <BookCheck size={20} style={{ display: 'inline', marginRight: '8px' }} />
                            Students ({students.length}) - Max Marks: {selectedExamData?.maxMarks || 100}
                        </div>
                        <Button variant="primary" onClick={handleSubmit} loading={saving}>
                            <CheckCircle size={16} /> Save Results
                        </Button>
                    </div>

                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Marks Obtained</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => (
                                <tr key={student.id}>
                                    <td>#{student.id}</td>
                                    <td>{student.firstName} {student.lastName}</td>
                                    <td>
                                        <input
                                            type="number"
                                            value={results[student.id] || ''}
                                            onChange={(e) => handleResultChange(student.id, e.target.value)}
                                            className={formStyles.input}
                                            style={{ width: '100px' }}
                                            min="0"
                                            max={selectedExamData?.maxMarks || 100}
                                            placeholder="0"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : selectedExam ? (
                <div className={styles.emptyState} style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-12)' }}>
                    <BookCheck size={48} />
                    <p>No students found</p>
                </div>
            ) : (
                <div className={styles.emptyState} style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-12)' }}>
                    <BookCheck size={48} />
                    <p>Select an exam to enter results</p>
                </div>
            )}
        </div>
    );
};

export default ResultsPage;
