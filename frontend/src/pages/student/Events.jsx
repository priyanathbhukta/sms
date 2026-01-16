import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { studentApi } from '../../api/student.api';
import { logger } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';
import Button from '../../components/common/Button';
import {
    Loader2,
    Calendar,
    MapPin,
    Users,
    CheckCircle,
    Filter,
} from 'lucide-react';
import styles from '../../components/common/DataTable.module.css';

const EventsPage = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [myParticipations, setMyParticipations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(null);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        fetchData();
    }, [user?.id, showAll]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [eventsData, participationsData] = await Promise.all([
                showAll ? studentApi.getEvents() : studentApi.getUpcomingEvents(),
                user?.id ? studentApi.getMyEventParticipations(user.id) : Promise.resolve([]),
            ]);

            setEvents(Array.isArray(eventsData) ? eventsData : []);
            setMyParticipations(Array.isArray(participationsData) ? participationsData : []);
        } catch (err) {
            logger.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const isRegistered = (eventId) => {
        return myParticipations.some(p => p.eventId === eventId);
    };

    const handleRegister = async (eventId) => {
        try {
            setRegistering(eventId);
            await studentApi.registerForEvent({
                eventId,
                userId: user.id,
            });
            fetchData();
        } catch (err) {
            logger.error('Error registering for event:', err);
        } finally {
            setRegistering(null);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-1)' }}>
                        Events
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {showAll ? 'All school events' : 'Upcoming school events'}
                    </p>
                </div>

                {/* Toggle between upcoming and all events */}
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button
                        onClick={() => setShowAll(false)}
                        style={{
                            padding: 'var(--space-2) var(--space-4)',
                            borderRadius: 'var(--radius-lg)',
                            border: 'none',
                            cursor: 'pointer',
                            background: !showAll ? 'var(--primary-500)' : 'var(--background)',
                            color: !showAll ? 'white' : 'var(--text-secondary)',
                            fontWeight: 'var(--font-medium)',
                            fontSize: 'var(--text-sm)',
                        }}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => setShowAll(true)}
                        style={{
                            padding: 'var(--space-2) var(--space-4)',
                            borderRadius: 'var(--radius-lg)',
                            border: 'none',
                            cursor: 'pointer',
                            background: showAll ? 'var(--primary-500)' : 'var(--background)',
                            color: showAll ? 'white' : 'var(--text-secondary)',
                            fontWeight: 'var(--font-medium)',
                            fontSize: 'var(--text-sm)',
                        }}
                    >
                        All Events
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
            ) : events.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 'var(--space-4)' }}>
                    {events.map((event) => (
                        <div
                            key={event.id}
                            style={{
                                background: 'var(--surface)',
                                borderRadius: 'var(--radius-xl)',
                                padding: 'var(--space-5)',
                                boxShadow: 'var(--shadow-sm)',
                            }}
                        >
                            <div style={{ marginBottom: 'var(--space-4)' }}>
                                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-2)' }}>
                                    {event.title}
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                                    {event.description || 'No description available'}
                                </p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                                    <Calendar size={14} />
                                    {formatDate(event.eventDate)} {event.eventTime && `at ${event.eventTime}`}
                                </div>
                                {event.location && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                                        <MapPin size={14} />
                                        {event.location}
                                    </div>
                                )}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                                    <Users size={14} />
                                    {event.participantCount || 0}/{event.maxParticipants || '∞'} participants
                                </div>
                            </div>

                            {isRegistered(event.id) ? (
                                <Button variant="success" fullWidth disabled>
                                    <CheckCircle size={16} /> Registered
                                </Button>
                            ) : (
                                <Button
                                    variant="primary"
                                    fullWidth
                                    onClick={() => handleRegister(event.id)}
                                    loading={registering === event.id}
                                >
                                    Register
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState} style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-12)' }}>
                    <Calendar size={48} />
                    <p>No upcoming events</p>
                </div>
            )}
        </div>
    );
};

export default EventsPage;
