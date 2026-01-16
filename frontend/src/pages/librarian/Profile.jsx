import { useState, useEffect, useRef } from 'react';
import { librarianApi } from '../../api/librarian.api';
import { profileApi } from '../../api/profile.api';
import { logger } from '../../utils/constants';
import Button from '../../components/common/Button';
import {
    Loader2,
    User,
    Mail,
    Phone,
    Briefcase,
    Camera,
    CheckCircle,
    AlertCircle,
} from 'lucide-react';
import styles from '../../components/common/DataTable.module.css';
import formStyles from '../../components/common/Form.module.css';

const LibrarianProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const data = await librarianApi.getMyProfile();
            logger.log('Profile:', data);
            setProfile(data);
        } catch (err) {
            logger.error('Error fetching profile:', err);
            setError('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setError('Image size must be less than 2MB');
            return;
        }

        try {
            setUploading(true);
            setError('');
            await profileApi.uploadImage(file);
            setSuccess('Profile image uploaded successfully!');
            fetchProfile();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            logger.error('Error uploading image:', err);
            setError(err.response?.data?.message || 'Failed to upload image');
        } finally {
            setUploading(false);
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
                    My Profile
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    View and manage your profile information
                </p>
            </div>

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

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 300px) 1fr', gap: 'var(--space-6)' }}>
                {/* Image Section */}
                <div style={{
                    background: 'var(--surface)',
                    padding: 'var(--space-6)',
                    borderRadius: 'var(--radius-xl)',
                    boxShadow: 'var(--shadow-sm)',
                    textAlign: 'center',
                }}>
                    <div style={{
                        width: '180px',
                        height: '180px',
                        margin: '0 auto var(--space-4)',
                        borderRadius: 'var(--radius-full)',
                        border: '3px solid var(--border-light)',
                        overflow: 'hidden',
                        background: 'var(--background)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                    }}>
                        {profile?.profileImageUrl ? (
                            <img
                                src={`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}${profile.profileImageUrl}`}
                                alt="Profile"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                                {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                            </div>
                        )}
                        {uploading && (
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'rgba(0,0,0,0.5)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Loader2 size={32} color="white" className="spin" />
                            </div>
                        )}
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                    />

                    <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                    >
                        <Camera size={16} />
                        {uploading ? 'Uploading...' : 'Upload Photo'}
                    </Button>
                </div>

                {/* Info Section */}
                <div style={{
                    background: 'var(--surface)',
                    padding: 'var(--space-6)',
                    borderRadius: 'var(--radius-xl)',
                    boxShadow: 'var(--shadow-sm)',
                }}>
                    <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-5)' }}>
                        Personal Information
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
                        <div className={formStyles.formGroup}>
                            <label className={formStyles.label}>
                                <User size={14} style={{ marginRight: '6px', display: 'inline' }} />
                                Full Name
                            </label>
                            <div className={formStyles.value}>
                                {profile?.firstName} {profile?.lastName}
                            </div>
                        </div>

                        <div className={formStyles.formGroup}>
                            <label className={formStyles.label}>
                                <Mail size={14} style={{ marginRight: '6px', display: 'inline' }} />
                                Email
                            </label>
                            <div className={formStyles.value}>
                                {profile?.email || 'N/A'}
                            </div>
                        </div>

                        <div className={formStyles.formGroup}>
                            <label className={formStyles.label}>
                                <Briefcase size={14} style={{ marginRight: '6px', display: 'inline' }} />
                                Employee ID
                            </label>
                            <div className={formStyles.value}>
                                {profile?.employeeId || 'N/A'}
                            </div>
                        </div>

                        <div className={formStyles.formGroup}>
                            <label className={formStyles.label}>
                                <Phone size={14} style={{ marginRight: '6px', display: 'inline' }} />
                                Phone
                            </label>
                            <div className={formStyles.value}>
                                {profile?.phone || 'Not set'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LibrarianProfile;
