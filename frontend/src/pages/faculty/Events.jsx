import { useState, useEffect } from 'react';
import { facultyApi } from '../../api/faculty.api';
import { useAuth } from '../../contexts/AuthContext';
import { logger } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import {
    Loader2,
    Calendar,
    Plus,
    MapPin,
    AlertCircle,
} from 'lucide-react';
import styles from '../../components/common/DataTable.module.css';
import formStyles from '../../components/common/Form.module.css';

const EventsPage = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        eventDate: '',
        eventTime: '',
        maxParticipants: '',
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const data = await facultyApi.getEvents();
            logger.log('Events:', data);
            setEvents(Array.isArray(data) ? data : []);
        } catch (err) {
            logger.error('Error fetching events:', err);
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

        if (!formData.title || !formData.eventDate) {
            setError('Title and date are required');
            return;
        }

        try {
            setCreating(true);
            await facultyApi.createEvent({
                title: formData.title,
                description: formData.description,
                location: formData.location,
                eventDate: formData.eventDate,
                eventTime: formData.eventTime || '09:00',
                maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : 100,
                createdByUserId: user?.id || 1,
            });
            setShowModal(false);
            setFormData({ title: '', description: '', location: '', eventDate: '', eventTime: '', maxParticipants: '' });
            fetchEvents();
        } catch (err) {
            logger.error('Error creating event:', err);
            setError(err.response?.data?.message || 'Failed to create event');
        } finally {
            setCreating(false);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: 'var(--space-6)' }}>
                <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-1)' }}>
                    Events
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Create and manage school events
                </p>
            </div>

            <div className={styles.dataTable}>
                <div className={styles.tableHeader}>
                    <div className={styles.tableTitle}>
                        <Calendar size={20} style={{ display: 'inline', marginRight: '8px' }} />
                        All Events ({events.length})
                    </div>
                    <button className={styles.addButton} onClick={() => setShowModal(true)}>
                        <Plus size={18} />
                        Create Event
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
                ) : events.length > 0 ? (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Date</th>
                                <th>Location</th>
                                <th>Participants</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event) => (
                                <tr key={event.id}>
                                    <td>#{event.id}</td>
                                    <td style={{ fontWeight: 'var(--font-medium)' }}>{event.title}</td>
                                    <td>{formatDate(event.eventDate)}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                                            <MapPin size={14} style={{ color: 'var(--text-muted)' }} />
                                            {event.location || 'TBD'}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`${styles.badge} ${styles.info}`}>
                                            {event.participantCount || 0}/{event.maxParticipants || '∞'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className={styles.emptyState}>
                        <Calendar size={48} />
                        <p>No events yet</p>
                        <Button variant="primary" onClick={() => setShowModal(true)} style={{ marginTop: 'var(--space-4)' }}>
                            <Plus size={16} /> Create First Event
                        </Button>
                    </div>
                )}
            </div>

            {/* Create Event Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Create Event"
                large
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleSubmit} loading={creating}>Create Event</Button>
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
                        <label className={formStyles.label}>Event Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={formStyles.input}
                            placeholder="Annual Sports Day"
                        />
                    </div>

                    <div className={formStyles.formGroup}>
                        <label className={formStyles.label}>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className={formStyles.textarea}
                            placeholder="Event details..."
                            rows={3}
                        />
                    </div>

                    <div className={formStyles.row}>
                        <div className={formStyles.formGroup}>
                            <label className={formStyles.label}>Date</label>
                            <input
                                type="date"
                                name="eventDate"
                                value={formData.eventDate}
                                onChange={handleChange}
                                className={formStyles.input}
                            />
                        </div>
                        <div className={formStyles.formGroup}>
                            <label className={formStyles.label}>Time</label>
                            <input
                                type="time"
                                name="eventTime"
                                value={formData.eventTime}
                                onChange={handleChange}
                                className={formStyles.input}
                            />
                        </div>
                    </div>

                    <div className={formStyles.row}>
                        <div className={formStyles.formGroup}>
                            <label className={formStyles.label}>Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className={formStyles.input}
                                placeholder="School Auditorium"
                            />
                        </div>
                        <div className={formStyles.formGroup}>
                            <label className={formStyles.label}>Max Participants</label>
                            <input
                                type="number"
                                name="maxParticipants"
                                value={formData.maxParticipants}
                                onChange={handleChange}
                                className={formStyles.input}
                                placeholder="100"
                                min="1"
                            />
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default EventsPage;
