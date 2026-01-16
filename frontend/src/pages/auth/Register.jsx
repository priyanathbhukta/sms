import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { DEBUG_MODE, ROLES, logger } from '../../utils/constants';
import { GraduationCap, Eye, EyeOff, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import styles from './Login.module.css';

const Register = () => {
    const navigate = useNavigate();
    const { register, loading } = useAuth();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'STUDENT',
        additionalId: '',
        department: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    const [success, setSuccess] = useState(false);

    // Generate email based on role
    const generateEmail = () => {
        const { firstName, lastName, role, additionalId } = formData;
        if (!firstName || !lastName || !additionalId) return '';

        const fn = firstName.toLowerCase().trim();
        const ln = lastName.toLowerCase().trim();
        const id = additionalId.trim();

        return `${fn}.${ln}.${id}@sms.edu.in`;
    };

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updated = { ...prev, [name]: value };

            // Auto-generate email when name/additionalId changes
            if (['firstName', 'lastName', 'additionalId'].includes(name)) {
                const fn = (name === 'firstName' ? value : prev.firstName).toLowerCase().trim();
                const ln = (name === 'lastName' ? value : prev.lastName).toLowerCase().trim();
                const id = (name === 'additionalId' ? value : prev.additionalId).trim();

                if (fn && ln && id) {
                    updated.email = `${fn}.${ln}.${id}@sms.edu.in`;
                }
            }

            return updated;
        });

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        setSubmitError('');
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@sms\.edu\.in$/.test(formData.email)) {
            newErrors.email = 'Email must be in format: name@sms.edu.in';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.additionalId.trim()) {
            newErrors.additionalId = formData.role === 'STUDENT'
                ? 'Enrollment year is required (e.g., 2024)'
                : 'Employee ID is required';
        }

        if (formData.role === 'FACULTY' && !formData.department.trim()) {
            newErrors.department = 'Department is required for faculty';
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

        logger.log('Attempting registration:', formData);

        const result = await register({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            role: formData.role,
            additionalId: formData.additionalId,
            department: formData.role === 'FACULTY' ? formData.department : null,
        });

        if (result.success) {
            setSuccess(true);
            setTimeout(() => {
                navigate(result.redirectTo || '/login', { replace: true });
            }, 2000);
        } else {
            setSubmitError(result.error || 'Registration failed. Please try again.');
        }
    };

    if (success) {
        return (
            <div className={styles.loginPage}>
                <div className={styles.loginContainer} style={{ maxWidth: '500px', textAlign: 'center', padding: 'var(--space-12)' }}>
                    <CheckCircle size={64} color="var(--success-500)" style={{ marginBottom: 'var(--space-4)' }} />
                    <h2 className={styles.formTitle}>Registration Successful!</h2>
                    <p className={styles.formSubtitle}>
                        Redirecting you to login...
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
                        <GraduationCap size={48} />
                    </div>
                    <h1 className={styles.brandingTitle}>Join SMS Portal</h1>
                    <p className={styles.brandingSubtitle}>
                        Create your account to access all features
                    </p>
                </div>

                {/* Form Section */}
                <div className={styles.loginFormSection} style={{ overflowY: 'auto' }}>
                    <div className={styles.formHeader}>
                        <h2 className={styles.formTitle}>Create Account</h2>
                        <p className={styles.formSubtitle}>
                            Fill in your details to register
                        </p>
                    </div>

                    {/* Error Alert */}
                    {submitError && (
                        <div className={`${styles.alertBox} ${styles.alertError}`}>
                            <AlertCircle size={18} />
                            <span>{submitError}</span>
                        </div>
                    )}

                    <form className={styles.loginForm} onSubmit={handleSubmit}>
                        {/* Role Selection */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>I am a</label>
                            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                                {['STUDENT', 'FACULTY'].map(role => (
                                    <label
                                        key={role}
                                        style={{
                                            flex: 1,
                                            padding: 'var(--space-3)',
                                            border: `2px solid ${formData.role === role ? 'var(--primary-500)' : 'var(--border-default)'}`,
                                            borderRadius: 'var(--radius-lg)',
                                            cursor: 'pointer',
                                            textAlign: 'center',
                                            background: formData.role === role ? 'var(--primary-50)' : 'transparent',
                                            transition: 'all var(--transition-fast)',
                                        }}
                                    >
                                        <input
                                            type="radio"
                                            name="role"
                                            value={role}
                                            checked={formData.role === role}
                                            onChange={handleChange}
                                            style={{ display: 'none' }}
                                        />
                                        <span style={{ fontWeight: 'var(--font-medium)' }}>
                                            {role === 'STUDENT' ? '🎓 Student' : '👨‍🏫 Faculty'}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Name Fields */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel} htmlFor="firstName">First Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="John"
                                    className={`${styles.formInput} ${errors.firstName ? styles.formInputError : ''}`}
                                />
                                {errors.firstName && (
                                    <span className={styles.errorMessage}><AlertCircle size={14} />{errors.firstName}</span>
                                )}
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel} htmlFor="lastName">Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Doe"
                                    className={`${styles.formInput} ${errors.lastName ? styles.formInputError : ''}`}
                                />
                                {errors.lastName && (
                                    <span className={styles.errorMessage}><AlertCircle size={14} />{errors.lastName}</span>
                                )}
                            </div>
                        </div>

                        {/* Additional ID */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel} htmlFor="additionalId">
                                {formData.role === 'STUDENT' ? 'Enrollment Year' : 'Employee ID'}
                            </label>
                            <input
                                type="text"
                                id="additionalId"
                                name="additionalId"
                                value={formData.additionalId}
                                onChange={handleChange}
                                placeholder={formData.role === 'STUDENT' ? '2024' : '101'}
                                className={`${styles.formInput} ${errors.additionalId ? styles.formInputError : ''}`}
                            />
                            {errors.additionalId && (
                                <span className={styles.errorMessage}><AlertCircle size={14} />{errors.additionalId}</span>
                            )}
                        </div>

                        {/* Department (Faculty only) */}
                        {formData.role === 'FACULTY' && (
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel} htmlFor="department">Department</label>
                                <input
                                    type="text"
                                    id="department"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    placeholder="Science"
                                    className={`${styles.formInput} ${errors.department ? styles.formInputError : ''}`}
                                />
                                {errors.department && (
                                    <span className={styles.errorMessage}><AlertCircle size={14} />{errors.department}</span>
                                )}
                            </div>
                        )}

                        {/* Email (Auto-generated) */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel} htmlFor="email">Email Address (Auto-generated)</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="firstname.lastname.id@sms.edu.in"
                                className={`${styles.formInput} ${errors.email ? styles.formInputError : ''}`}
                                style={{ background: 'var(--bg-tertiary)' }}
                            />
                            {errors.email && (
                                <span className={styles.errorMessage}><AlertCircle size={14} />{errors.email}</span>
                            )}
                        </div>

                        {/* Password */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel} htmlFor="password">Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Min. 8 characters"
                                    className={`${styles.formInput} ${errors.password ? styles.formInputError : ''}`}
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
                                <span className={styles.errorMessage}><AlertCircle size={14} />{errors.password}</span>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel} htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Re-enter password"
                                className={`${styles.formInput} ${errors.confirmPassword ? styles.formInputError : ''}`}
                            />
                            {errors.confirmPassword && (
                                <span className={styles.errorMessage}><AlertCircle size={14} />{errors.confirmPassword}</span>
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
                                    Creating Account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className={styles.formFooter}>
                        Already have an account?
                        <Link to="/login" className={styles.formFooterLink}>
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>

            {/* Debug Panel */}
            {DEBUG_MODE && (
                <div className={styles.debugPanel}>
                    <h4>🐛 Debug Mode</h4>
                    <div>Role: {formData.role}</div>
                    <div>Email: {formData.email || 'auto-generating...'}</div>
                    <div>Loading: {String(loading)}</div>
                </div>
            )}

            <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default Register;
