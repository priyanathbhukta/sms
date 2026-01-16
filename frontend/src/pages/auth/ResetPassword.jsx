import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { logger } from '../../utils/constants';
import { GraduationCap, Eye, EyeOff, AlertCircle, Loader2, CheckCircle, Lock } from 'lucide-react';
import styles from './Login.module.css';
import api from '../../api/axios';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: '',
    });
    const [showPasswords, setShowPasswords] = useState({
        new: false,
        confirm: false,
    });
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [invalidToken, setInvalidToken] = useState(false);

    useEffect(() => {
        if (!token) {
            setInvalidToken(true);
        }
    }, [token]);

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
            const response = await api.post('/api/password/reset/confirm', {
                token,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword,
            });
            logger.info('Password reset response:', response.data);

            if (response.data.success) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/login', { replace: true });
                }, 3000);
            } else {
                setSubmitError(response.data.message || 'Failed to reset password');
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to reset password. The link may have expired.';
            setSubmitError(message);
            logger.error('Password reset error:', err);
        } finally {
            setLoading(false);
        }
    };

    const togglePassword = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    if (invalidToken) {
        return (
            <div className={styles.loginPage}>
                <div className={styles.loginContainer} style={{ maxWidth: '500px', textAlign: 'center', padding: 'var(--space-12)' }}>
                    <AlertCircle size={64} color="var(--error-500)" style={{ marginBottom: 'var(--space-4)' }} />
                    <h2 className={styles.formTitle}>Invalid Reset Link</h2>
                    <p className={styles.formSubtitle} style={{ marginBottom: 'var(--space-6)' }}>
                        This password reset link is invalid or has expired.
                    </p>
                    <Link
                        to="/forgot-password"
                        className={styles.submitButton}
                        style={{ display: 'inline-block', textDecoration: 'none' }}
                    >
                        Request New Link
                    </Link>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className={styles.loginPage}>
                <div className={styles.loginContainer} style={{ maxWidth: '500px', textAlign: 'center', padding: 'var(--space-12)' }}>
                    <CheckCircle size={64} color="var(--success-500)" style={{ marginBottom: 'var(--space-4)' }} />
                    <h2 className={styles.formTitle}>Password Reset Successful!</h2>
                    <p className={styles.formSubtitle}>
                        Your password has been reset. Redirecting to login...
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
                    <h1 className={styles.brandingTitle}>Reset Password</h1>
                    <p className={styles.brandingSubtitle}>
                        Create a new password for your account
                    </p>
                </div>

                {/* Form Section */}
                <div className={styles.loginFormSection}>
                    <div className={styles.formHeader}>
                        <h2 className={styles.formTitle}>Create New Password</h2>
                        <p className={styles.formSubtitle}>
                            Enter a strong password to secure your account
                        </p>
                    </div>

                    {submitError && (
                        <div className={`${styles.alertBox} ${styles.alertError}`}>
                            <AlertCircle size={18} />
                            <span>{submitError}</span>
                        </div>
                    )}

                    <form className={styles.loginForm} onSubmit={handleSubmit}>
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
                                    autoFocus
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
                                    Resetting Password...
                                </>
                            ) : (
                                'Reset Password'
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

export default ResetPassword;
