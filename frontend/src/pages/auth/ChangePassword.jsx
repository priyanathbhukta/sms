import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { logger } from '../../utils/constants';
import { GraduationCap, Eye, EyeOff, AlertCircle, Loader2, CheckCircle, Lock } from 'lucide-react';
import styles from './Login.module.css';
import api from '../../api/axios';

const ChangePassword = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Redirect if not logged in
    useEffect(() => {
        if (!user) {
            navigate('/login', { replace: true });
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        setSubmitError('');
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.currentPassword) {
            newErrors.currentPassword = 'Current password is required';
        }

        if (!formData.newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (formData.newPassword.length < 8) {
            newErrors.newPassword = 'Password must be at least 8 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your new password';
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (formData.currentPassword === formData.newPassword) {
            newErrors.newPassword = 'New password must be different from current password';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setSubmitError('');

        try {
            const response = await api.post('/api/password/change', formData);
            logger.info('Password change response:', response.data);

            if (response.data.success) {
                setSuccess(true);
                // Log out user after password change
                setTimeout(async () => {
                    await logout();
                    navigate('/login', { replace: true });
                }, 2000);
            } else {
                setSubmitError(response.data.message || 'Failed to change password');
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to change password. Please try again.';
            setSubmitError(message);
            logger.error('Password change error:', err);
        } finally {
            setLoading(false);
        }
    };

    const togglePassword = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    if (success) {
        return (
            <div className={styles.loginPage}>
                <div className={styles.loginContainer} style={{ maxWidth: '500px', textAlign: 'center', padding: 'var(--space-12)' }}>
                    <CheckCircle size={64} color="var(--success-500)" style={{ marginBottom: 'var(--space-4)' }} />
                    <h2 className={styles.formTitle}>Password Changed!</h2>
                    <p className={styles.formSubtitle}>
                        Your password has been updated successfully. Redirecting to login...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.loginPage}>
            <div className={styles.loginContainer}>
                {/* Branding Section */}
                <div className={styles.loginBranding}>
                    <div className={styles.brandingLogo}>
                        <Lock size={48} />
                    </div>
                    <h1 className={styles.brandingTitle}>Change Password</h1>
                    <p className={styles.brandingSubtitle}>
                        For security, you must change your temporary password
                    </p>
                </div>

                {/* Form Section */}
                <div className={styles.loginFormSection}>
                    <div className={styles.formHeader}>
                        <h2 className={styles.formTitle}>Set New Password</h2>
                        <p className={styles.formSubtitle}>
                            Create a strong password to secure your account
                        </p>
                    </div>

                    {submitError && (
                        <div className={`${styles.alertBox} ${styles.alertError}`}>
                            <AlertCircle size={18} />
                            <span>{submitError}</span>
                        </div>
                    )}

                    <form className={styles.loginForm} onSubmit={handleSubmit}>
                        {/* Current Password */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel} htmlFor="currentPassword">
                                Current Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPasswords.current ? 'text' : 'password'}
                                    id="currentPassword"
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    placeholder="Enter your temporary password"
                                    className={`${styles.formInput} ${errors.currentPassword ? styles.formInputError : ''}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePassword('current')}
                                    style={{
                                        position: 'absolute',
                                        right: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: 'var(--text-muted)',
                                    }}
                                    tabIndex={-1}
                                >
                                    {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.currentPassword && (
                                <span className={styles.errorMessage}>
                                    <AlertCircle size={14} />{errors.currentPassword}
                                </span>
                            )}
                        </div>

                        {/* New Password */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel} htmlFor="newPassword">
                                New Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPasswords.new ? 'text' : 'password'}
                                    id="newPassword"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    placeholder="Min. 8 characters"
                                    className={`${styles.formInput} ${errors.newPassword ? styles.formInputError : ''}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePassword('new')}
                                    style={{
                                        position: 'absolute',
                                        right: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: 'var(--text-muted)',
                                    }}
                                    tabIndex={-1}
                                >
                                    {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.newPassword && (
                                <span className={styles.errorMessage}>
                                    <AlertCircle size={14} />{errors.newPassword}
                                </span>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel} htmlFor="confirmPassword">
                                Confirm New Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPasswords.confirm ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Re-enter new password"
                                    className={`${styles.formInput} ${errors.confirmPassword ? styles.formInputError : ''}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePassword('confirm')}
                                    style={{
                                        position: 'absolute',
                                        right: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: 'var(--text-muted)',
                                    }}
                                    tabIndex={-1}
                                >
                                    {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <span className={styles.errorMessage}>
                                    <AlertCircle size={14} />{errors.confirmPassword}
                                </span>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} style={{ animation: 'spin 1s linear infinite', marginRight: '8px' }} />
                                    Changing Password...
                                </>
                            ) : (
                                'Change Password'
                            )}
                        </button>
                    </form>
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default ChangePassword;
