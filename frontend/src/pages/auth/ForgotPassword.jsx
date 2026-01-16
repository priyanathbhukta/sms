import { useState } from 'react';
import { Link } from 'react-router-dom';
import { logger } from '../../utils/constants';
import { GraduationCap, Mail, AlertCircle, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import styles from './Login.module.css';
import api from '../../api/axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const validateEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email.trim()) {
            setError('Email is required');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);

        try {
            const response = await api.post('/api/password/reset/request', { email });
            logger.info('Password reset request response:', response.data);
            setSuccess(true);
        } catch (err) {
            // API always returns success to prevent enumeration, so this shouldn't happen
            logger.error('Password reset request error:', err);
            // Still show success message for security
            setSuccess(true);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className={styles.loginPage}>
                <div className={styles.loginContainer} style={{ maxWidth: '500px' }}>
                    <div style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
                        <CheckCircle size={64} color="var(--success-500)" style={{ marginBottom: 'var(--space-4)' }} />
                        <h2 className={styles.formTitle}>Check Your Email</h2>
                        <p className={styles.formSubtitle} style={{ marginBottom: 'var(--space-6)' }}>
                            If your email is registered with us, you will receive a password reset link shortly.
                        </p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 'var(--space-6)' }}>
                            Check your spam folder if you don't see the email within a few minutes.
                        </p>
                        <Link
                            to="/login"
                            className={styles.submitButton}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 'var(--space-2)',
                                textDecoration: 'none',
                            }}
                        >
                            <ArrowLeft size={18} />
                            Back to Login
                        </Link>
                    </div>
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
                        <GraduationCap size={48} />
                    </div>
                    <h1 className={styles.brandingTitle}>Forgot Password</h1>
                    <p className={styles.brandingSubtitle}>
                        No worries! Enter your email and we'll send you a reset link.
                    </p>
                </div>

                {/* Form Section */}
                <div className={styles.loginFormSection}>
                    <div className={styles.formHeader}>
                        <h2 className={styles.formTitle}>Reset Password</h2>
                        <p className={styles.formSubtitle}>
                            Enter your personal email address or system email
                        </p>
                    </div>

                    {error && (
                        <div className={`${styles.alertBox} ${styles.alertError}`}>
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form className={styles.loginForm} onSubmit={handleSubmit}>
                        {/* Email Field */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel} htmlFor="email">
                                Email Address
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setError('');
                                    }}
                                    placeholder="you@example.com"
                                    className={`${styles.formInput} ${error ? styles.formInputError : ''}`}
                                    autoComplete="email"
                                    autoFocus
                                    style={{ paddingLeft: '40px' }}
                                />
                                <Mail
                                    size={18}
                                    style={{
                                        position: 'absolute',
                                        left: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: 'var(--text-muted)',
                                    }}
                                />
                            </div>
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
                                    Sending...
                                </>
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className={styles.formFooter}>
                        <Link
                            to="/login"
                            className={styles.formFooterLink}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 'var(--space-1)',
                            }}
                        >
                            <ArrowLeft size={14} />
                            Back to Login
                        </Link>
                    </p>
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

export default ForgotPassword;
