import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { facultyApi } from '../../api/faculty.api';
import { logger } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import {
    Loader2,
    Bell,
    Plus,
    Trash2,
    AlertCircle,
} from 'lucide-react';
import styles from '../../components/common/DataTable.module.css';
import formStyles from '../../components/common/Form.module.css';

const AnnouncementsPage = () => {
    const { user } = useAuth();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        targetRole: '',
    });

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const data = await facultyApi.getAnnouncements();
            logger.log('Announcements:', data);
            setAnnouncements(Array.isArray(data) ? data : []);
        } catch (err) {
            logger.error('Error fetching announcements:', err);
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

        if (!formData.title || !formData.content) {
            setError('Title and content are required');
            return;
        }

        try {
            setCreating(true);
            await facultyApi.createAnnouncement({
                title: formData.title,
                content: formData.content,
                postByUserId: user?.id || 1,
                targetRole: formData.targetRole || null,
                targetClassId: null,
            });
            setShowModal(false);
            setFormData({ title: '', content: '', targetRole: '' });
            fetchAnnouncements();
        } catch (err) {
            logger.error('Error creating announcement:', err);
            setError(err.response?.data?.message || 'Failed to create announcement');
        } finally {
            setCreating(false);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: 'var(--space-6)' }}>
                <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-1)' }}>
                    Announcements
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Broadcast messages to users
                </p>
            </div>

            <div className={styles.dataTable}>
                <div className={styles.tableHeader}>
                    <div className={styles.tableTitle}>
                        <Bell size={20} style={{ display: 'inline', marginRight: '8px' }} />
                        All Announcements ({announcements.length})
                    </div>
                    <button className={styles.addButton} onClick={() => setShowModal(true)}>
                        <Plus size={18} />
                        New Announcement
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
                ) : announcements.length > 0 ? (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Content</th>
                                <th>Target</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {announcements.map((ann) => (
                                <tr key={ann.id}>
                                    <td>#{ann.id}</td>
                                    <td style={{ fontWeight: 'var(--font-medium)' }}>{ann.title}</td>
                                    <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {ann.content}
                                    </td>
                                    <td>
                                        <span className={`${styles.badge} ${styles.info}`}>
                                            {ann.targetRole || 'All'}
                                        </span>
                                    </td>
                                    <td>{formatDate(ann.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className={styles.emptyState}>
                        <Bell size={48} />
                        <p>No announcements yet</p>
                        <Button variant="primary" onClick={() => setShowModal(true)} style={{ marginTop: 'var(--space-4)' }}>
                            <Plus size={16} /> Create First Announcement
                        </Button>
                    </div>
                )}
            </div>

            {/* Create Announcement Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Create Announcement"
                large
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleSubmit} loading={creating}>Post Announcement</Button>
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
                        <label className={formStyles.label}>Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={formStyles.input}
                            placeholder="Announcement title"
                        />
                    </div>

                    <div className={formStyles.formGroup}>
                        <label className={formStyles.label}>Content</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            className={formStyles.textarea}
                            placeholder="Write your announcement here..."
                            rows={5}
                        />
                    </div>

                    <div className={formStyles.formGroup}>
                        <label className={formStyles.label}>Target Audience (Optional)</label>
                        <select name="targetRole" value={formData.targetRole} onChange={handleChange} className={formStyles.select}>
                            <option value="">Everyone</option>
                            <option value="STUDENT">Students Only</option>
                            <option value="FACULTY">Faculty Only</option>
                            <option value="LIBRARIAN">Librarians Only</option>
                        </select>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default AnnouncementsPage;
