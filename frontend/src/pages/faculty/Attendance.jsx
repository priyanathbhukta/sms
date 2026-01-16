import { useState, useEffect } from 'react';
import { facultyApi } from '../../api/faculty.api';
import { logger } from '../../utils/constants';
import Button from '../../components/common/Button';
import {
    Loader2,
    ClipboardList,
    Check,
    X,
    AlertCircle,
    CheckCircle,
} from 'lucide-react';
import styles from '../../components/common/DataTable.module.css';
import formStyles from '../../components/common/Form.module.css';

const AttendancePage = () => {
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [marking, setMarking] = useState(false);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendance, setAttendance] = useState({});
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (selectedClass) {
            fetchStudents();
            // Filter subjects for selected class
            const classSubjects = subjects.filter(s => s.classId === parseInt(selectedClass));
            if (classSubjects.length > 0 && !selectedSubject) {
                setSelectedSubject(classSubjects[0].id.toString());
            }
        }
    }, [selectedClass]);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [classesData, subjectsData] = await Promise.all([
                facultyApi.getMyClasses().catch(() => []),
                facultyApi.getMySubjects().catch(() => []),
            ]);

            setClasses(Array.isArray(classesData) ? classesData : []);
            setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
        } catch (err) {
            logger.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStudents = async () => {
        try {
            const data = await facultyApi.getStudentsInClass(selectedClass);
            logger.log('Students in class:', data);
            const studentList = Array.isArray(data) ? data : [];
            setStudents(studentList);

            // Initialize attendance
            const initial = {};
            studentList.forEach(s => { initial[s.id] = true; });
            setAttendance(initial);
        } catch (err) {
            logger.error('Error fetching students:', err);
        }
    };

    const toggleAttendance = (studentId) => {
        setAttendance(prev => ({ ...prev, [studentId]: !prev[studentId] }));
    };

    const handleSubmit = async () => {
        if (!selectedSubject || !date) {
            setError('Please select subject and date');
            return;
        }

        try {
            setMarking(true);
            setError('');

            for (const [studentId, isPresent] of Object.entries(attendance)) {
                await facultyApi.markAttendance({
                    studentId: parseInt(studentId),
                    subjectId: parseInt(selectedSubject),
                    date,
                    isPresent,
                });
            }

            setSuccess('Attendance marked successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            logger.error('Error marking attendance:', err);
            setError(err.response?.data?.message || 'Failed to mark attendance');
        } finally {
            setMarking(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <Loader2 size={32} className="spin" />
                <style>{`
          .spin { animation: spin 1s linear infinite; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
            </div>
        );
    }

    return (
        <div>
            <div style={{ marginBottom: 'var(--space-6)' }}>
                <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-1)' }}>
                    Mark Attendance
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Record student attendance for your classes
                </p>
            </div>

            {/* Selection Form */}
            <div style={{
                background: 'var(--surface)',
                padding: 'var(--space-5)',
                borderRadius: 'var(--radius-xl)',
                marginBottom: 'var(--space-6)',
                boxShadow: 'var(--shadow-sm)',
            }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
                    <div className={formStyles.formGroup} style={{ marginBottom: 0 }}>
                        <label className={formStyles.label}>Class</label>
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className={formStyles.select}
                        >
                            <option value="">Select Class</option>
                            {classes.map(c => (
                                <option key={c.id} value={c.id}>Grade {c.gradeLevel} - {c.section}</option>
                            ))}
                        </select>
                    </div>

                    <div className={formStyles.formGroup} style={{ marginBottom: 0 }}>
                        <label className={formStyles.label}>Subject</label>
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className={formStyles.select}
                            disabled={!selectedClass}
                        >
                            <option value="">Select Subject</option>
                            {subjects
                                .filter(s => !selectedClass || s.classId === parseInt(selectedClass))
                                .map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                        </select>
                    </div>

                    <div className={formStyles.formGroup} style={{ marginBottom: 0 }}>
                        <label className={formStyles.label}>Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className={formStyles.input}
                        />
                    </div>
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

            {/* Student List */}
            {students.length > 0 ? (
                <div className={styles.dataTable}>
                    <div className={styles.tableHeader}>
                        <div className={styles.tableTitle}>
                            <ClipboardList size={20} style={{ display: 'inline', marginRight: '8px' }} />
                            Students ({students.length})
                        </div>
                        <Button variant="primary" onClick={handleSubmit} loading={marking}>
                            <Check size={16} /> Submit Attendance
                        </Button>
                    </div>

                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => (
                                <tr key={student.id}>
                                    <td>#{student.id}</td>
                                    <td>{student.firstName} {student.lastName}</td>
                                    <td>
                                        <button
                                            onClick={() => toggleAttendance(student.id)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 'var(--space-2)',
                                                padding: 'var(--space-2) var(--space-3)',
                                                borderRadius: 'var(--radius-lg)',
                                                border: 'none',
                                                cursor: 'pointer',
                                                background: attendance[student.id] ? 'var(--success-50)' : 'var(--error-50)',
                                                color: attendance[student.id] ? 'var(--success-600)' : 'var(--error-600)',
                                                fontWeight: 'var(--font-medium)',
                                            }}
                                        >
                                            {attendance[student.id] ? <Check size={16} /> : <X size={16} />}
                                            {attendance[student.id] ? 'Present' : 'Absent'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : selectedClass ? (
                <div className={styles.emptyState} style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-12)' }}>
                    <ClipboardList size={48} />
                    <p>No students in this class</p>
                </div>
            ) : (
                <div className={styles.emptyState} style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-12)' }}>
                    <ClipboardList size={48} />
                    <p>Select a class to mark attendance</p>
                </div>
            )}
        </div>
    );
};

export default AttendancePage;
