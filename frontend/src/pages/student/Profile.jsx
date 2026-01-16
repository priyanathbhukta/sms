import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { studentApi } from '../../api/student.api';
import { logger } from '../../utils/constants';
import Button from '../../components/common/Button';
import {
    Loader2,
    User,
    Mail,
    Phone,
    MapPin,
    Hash,
    GraduationCap,
    Camera,
    Save,
    Edit3,
    X,
    CheckCircle,
    AlertCircle,
} from 'lucide-react';
import styles from '../../components/common/DataTable.module.css';
import formStyles from '../../components/common/Form.module.css';

const ProfilePage = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ phone: '', address: '' });
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const data = await studentApi.getMyProfile();
            logger.log('Profile:', data);
            setProfile(data);
            setFormData({
                phone: data.phone || '',
                address: data.address || '',
            });
        } catch (err) {
            logger.error('Error fetching profile:', err);
            setError('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError('');
            await studentApi.updateMyProfile(formData);
            setSuccess('Profile updated successfully!');
            setEditing(false);
            fetchProfile();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            logger.error('Error updating profile:', err);
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            setError('Image size must be less than 2MB');
            return;
        }

        try {
            setUploading(true);
            setError('');
            const result = await studentApi.uploadProfileImage(file);
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

            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 'var(--space-6)' }}>
                {/* Profile Image Section */}
                <div style={{
                    background: 'var(--surface)',
                    padding: 'var(--space-6)',
                    borderRadius: 'var(--radius-xl)',
                    boxShadow: 'var(--shadow-sm)',
                    textAlign: 'center',
                }}>
                    <div style={{
                        width: '180px',
                        height: '220px',
                        margin: '0 auto var(--space-4)',
                        borderRadius: 'var(--radius-lg)',
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
                                src={profile.profileImageUrl}
                                alt="Profile"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <User size={80} style={{ color: 'var(--text-muted)' }} />
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

                    <p style={{ marginTop: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                        Passport size photo in school attire<br />
                        Max size: 2MB
                    </p>
                </div>

                {/* Profile Details Section */}
                <div style={{
                    background: 'var(--surface)',
                    padding: 'var(--space-6)',
                    borderRadius: 'var(--radius-xl)',
                    boxShadow: 'var(--shadow-sm)',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
                        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' }}>
                            Personal Information
                        </h2>
                        {!editing ? (
                            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                                <Edit3 size={14} /> Edit
                            </Button>
                        ) : (
                            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                <Button variant="outline" size="sm" onClick={() => { setEditing(false); setFormData({ phone: profile?.phone || '', address: profile?.address || '' }); }}>
                                    <X size={14} /> Cancel
                                </Button>
                                <Button variant="primary" size="sm" onClick={handleSave} loading={saving}>
                                    <Save size={14} /> Save
                                </Button>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-4)' }}>
                        {/* Name - Read Only */}
                        <div className={formStyles.formGroup}>
                            <label className={formStyles.label}>
                                <User size={14} style={{ marginRight: '6px', display: 'inline' }} />
                                Full Name
                            </label>
                            <div style={{ padding: 'var(--space-2) var(--space-3)', background: 'var(--background)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}>
                                {profile?.firstName} {profile?.lastName}
                            </div>
                        </div>

                        {/* Email - Read Only */}
                        <div className={formStyles.formGroup}>
                            <label className={formStyles.label}>
                                <Mail size={14} style={{ marginRight: '6px', display: 'inline' }} />
                                Email
                            </label>
                            <div style={{ padding: 'var(--space-2) var(--space-3)', background: 'var(--background)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}>
                                {profile?.email || 'Not set'}
                            </div>
                        </div>

                        {/* Registration Number - Read Only */}
                        <div className={formStyles.formGroup}>
                            <label className={formStyles.label}>
                                <Hash size={14} style={{ marginRight: '6px', display: 'inline' }} />
                                Registration Number
                            </label>
                            <div style={{ padding: 'var(--space-2) var(--space-3)', background: 'var(--background)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}>
                                {profile?.registrationNumber || 'Not assigned'}
                            </div>
                        </div>

                        {/* Class - Read Only */}
                        <div className={formStyles.formGroup}>
                            <label className={formStyles.label}>
                                <GraduationCap size={14} style={{ marginRight: '6px', display: 'inline' }} />
                                Class
                            </label>
                            <div style={{ padding: 'var(--space-2) var(--space-3)', background: 'var(--background)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}>
                                {profile?.className || 'Not assigned'}
                            </div>
                        </div>

                        {/* Phone - Editable */}
                        <div className={formStyles.formGroup}>
                            <label className={formStyles.label}>
                                <Phone size={14} style={{ marginRight: '6px', display: 'inline' }} />
                                Phone Number
                            </label>
                            {editing ? (
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className={formStyles.input}
                                    placeholder="Enter your phone number"
                                />
                            ) : (
                                <div style={{ padding: 'var(--space-2) var(--space-3)', background: 'var(--background)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}>
                                    {profile?.phone || 'Not set'}
                                </div>
                            )}
                        </div>

                        {/* Parent Phone - Read Only */}
                        <div className={formStyles.formGroup}>
                            <label className={formStyles.label}>
                                <Phone size={14} style={{ marginRight: '6px', display: 'inline' }} />
                                Parent Phone Number
                            </label>
                            <div style={{ padding: 'var(--space-2) var(--space-3)', background: 'var(--background)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}>
                                {profile?.parentPhone || 'Not set'}
                            </div>
                        </div>

                        {/* Address - Editable */}
                        <div className={formStyles.formGroup} style={{ gridColumn: 'span 2' }}>
                            <label className={formStyles.label}>
                                <MapPin size={14} style={{ marginRight: '6px', display: 'inline' }} />
                                Address
                            </label>
                            {editing ? (
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className={formStyles.input}
                                    placeholder="Enter your address"
                                    rows={3}
                                    style={{ resize: 'vertical' }}
                                />
                            ) : (
                                <div style={{ padding: 'var(--space-2) var(--space-3)', background: 'var(--background)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', minHeight: '60px' }}>
                                    {profile?.address || 'Not set'}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Gamification Points */}
                    {profile?.gamificationPoints !== undefined && (
                        <div style={{ marginTop: 'var(--space-5)', padding: 'var(--space-4)', background: 'linear-gradient(135deg, var(--primary-50), var(--primary-100))', borderRadius: 'var(--radius-lg)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                <span style={{ fontSize: 'var(--text-2xl)' }}>🏆</span>
                                <div>
                                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--primary-600)' }}>Gamification Points</div>
                                    <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--primary-700)' }}>
                                        {profile.gamificationPoints}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
