import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { DEBUG_MODE, logger } from '../../utils/constants';
import { GraduationCap, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import styles from './Login.module.css';

const Login = () => {
    const navigate = useNavigate();
    const { login, loading, error: authError } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');

    // Handle input change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        setSubmitError('');
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        logger.log('Attempting login with:', formData.email);

        const result = await login(formData.email, formData.password);

        if (result.success) {
            logger.log('Login successful, redirecting to:', result.redirectTo);
            navigate(result.redirectTo, { replace: true });
        } else {
            setSubmitError(result.error || 'Login failed. Please try again.');
        }
    };

    return (
        <div className={styles.loginPage}>
            <div className={styles.loginContainer}>
                {/* Branding Section */}
                <div className={styles.loginBranding}>
                    <div className={styles.brandingLogo}>
                        <GraduationCap size={48} />
                    </div>
                    <h1 className={styles.brandingTitle}>SMS Portal</h1>
                    <p className={styles.brandingSubtitle}>
                        School Management System - Empowering Education through Technology
                    </p>
                </div>

                {/* Form Section */}
                <div className={styles.loginFormSection}>
                    <div className={styles.formHeader}>
                        <h2 className={styles.formTitle}>Welcome Back!</h2>
                        <p className={styles.formSubtitle}>
                            Please sign in to access your dashboard
                        </p>
                    </div>

                    {/* Error Alert */}
                    {(submitError || authError) && (
                        <div className={`${styles.alertBox} ${styles.alertError}`}>
                            <AlertCircle size={18} />
                            <span>{submitError || authError}</span>
                        </div>
                    )}

                    <form className={styles.loginForm} onSubmit={handleSubmit}>
                        {/* Email Field */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel} htmlFor="email">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@sms.edu.in"
                                className={`${styles.formInput} ${errors.email ? styles.formInputError : ''}`}
                                autoComplete="email"
                                autoFocus
                            />
                            {errors.email && (
                                <span className={styles.errorMessage}>
                                    <AlertCircle size={14} />
                                    {errors.email}
                                </span>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel} htmlFor="password">
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    className={`${styles.formInput} ${errors.password ? styles.formInputError : ''}`}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
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
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && (
                                <span className={styles.errorMessage}>
                                    <AlertCircle size={14} />
                                    {errors.password}
                                </span>
                            )}
                        </div>

                        {/* Remember Me */}
                        <div className={styles.formOptions}>
                            <label className={styles.rememberMe}>
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                />
                                <span>Remember me</span>
                            </label>
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
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className={styles.formFooter}>
                        <Link to="/forgot-password" className={styles.formFooterLink}>
                            Forgot Password?
                        </Link>
                    </p>
                </div>
            </div>

            {/* Debug Panel */}
            {DEBUG_MODE && (
                <div className={styles.debugPanel}>
                    <h4>🐛 Debug Mode</h4>
                    <div>Email: {formData.email || 'empty'}</div>
                    <div>Loading: {String(loading)}</div>
                    <div>Error: {submitError || 'none'}</div>
                </div>
            )}

            {/* Keyframes for spinner */}
            <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default Login;
