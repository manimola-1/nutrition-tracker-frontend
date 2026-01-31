import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import SuccessMessage from '../SuccessMessage/SuccessMessage';
import './Register.css';

function Register({ onSuccess, onNavigateToLogin }) {
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password_confirm: '',
        first_name: '',
        last_name: '',
        role: 'doctor',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) setError(null);
    };

    const validateForm = () => {
        if (formData.password !== formData.password_confirm) {
            setError('Heslá sa nezhodujú');
            return false;
        }
        if (formData.password.length < 8) {
            setError('Heslo musí mať aspoň 8 znakov');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Send email as both email and username so email works for login
            const result = await register({ ...formData, username: formData.email });
            
            if (result.success) {
                setSuccess(result.message);
                // Call onSuccess callback if provided (e.g., to redirect)
                if (onSuccess) {
                    setTimeout(() => {
                        onSuccess();
                    }, 1000);
                }
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Vyskytla sa neočakávaná chyba. Skúste to znova.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            {/* Image Section - Left Side */}
            <div
                className="register-image-section"
                style={{
                    backgroundImage: "url('/nutrition.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                <div className="register-image-overlay">
                    <div className="medical-icon">
                        <svg className="register-icon-large" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h1 className="register-title-main">
                        Pridajte sa k Nutrition Tracker
                    </h1>
                    <p className="register-subtitle-main">
                        Začnite spravovať výživu pacientov s našou profesionálnou zdravotnou platformou
                    </p>
                    <div className="register-features">
                        <div className="register-feature-card">
                            <div className="register-feature-content">
                                <svg className="register-feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span className="register-feature-text">Zabezpečené</span>
                            </div>
                        </div>
                        <div className="register-feature-card">
                            <div className="register-feature-content">
                                <svg className="register-feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <span className="register-feature-text">Rýchle</span>
                            </div>
                        </div>
                        <div className="register-feature-card">
                            <div className="register-feature-content">
                                <svg className="register-feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span className="register-feature-text">Spoľahlivé</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Section - Right Side */}
            <div className="register-form-section">
                <div className="register-form-wrapper">
                    <div className="register-form-card">
                        {/* Logo/Brand Section */}
                        <div className="register-header">
                            <div className="register-logo">
                                <svg className="register-logo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                            </div>
                            <h2 className="register-title">
                                Vytvoriť účet
                            </h2>
                            <p className="register-subtitle">
                                Zaregistrujte sa a začnite sledovať výživu svojich pacientov
                            </p>
                        </div>

                        {/* Error/Success Messages */}
                        {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}
                        {success && <SuccessMessage message={success} onDismiss={() => setSuccess(null)} />}

                        {/* Registration Form */}
                        <form onSubmit={handleSubmit} className="register-form">
                            {/* Username Field */}
                            {/* Email Field */}
                            <div className="register-input-wrapper">
                                <div className="register-input-icon">
                                    <svg className="register-input-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="register-input"
                                    placeholder="your.email@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>

                            {/* First Name and Last Name Row */}
                            <div className="register-name-row">
                                <div className="register-input-wrapper">
                                    <div className="register-input-icon">
                                        <svg className="register-input-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="first_name"
                                        name="first_name"
                                        type="text"
                                        className="register-input"
                                        placeholder="Meno"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        disabled={loading}
                                    />
                                </div>
                                <div className="register-input-wrapper">
                                    <div className="register-input-icon">
                                        <svg className="register-input-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="last_name"
                                        name="last_name"
                                        type="text"
                                        className="register-input"
                                        placeholder="Priezvisko"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="register-input-wrapper">
                                <div className="register-input-icon">
                                    <svg className="register-input-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="register-input register-input-password"
                                    placeholder="At least 8 characters"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="register-password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={loading}
                                >
                                    {showPassword ? (
                                        <svg className="register-toggle-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="register-toggle-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            {/* Confirm Password Field */}
                            <div className="register-input-wrapper">
                                <div className="register-input-icon">
                                    <svg className="register-input-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <input
                                    id="password_confirm"
                                    name="password_confirm"
                                    type={showPasswordConfirm ? "text" : "password"}
                                    required
                                    className="register-input register-input-password"
                                    placeholder="Zopakujte heslo"
                                    value={formData.password_confirm}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="register-password-toggle"
                                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                    disabled={loading}
                                >
                                    {showPasswordConfirm ? (
                                        <svg className="register-toggle-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="register-toggle-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>


                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="register-button"
                            >
                                {loading ? (
                                    <span className="register-button-content">
                                        <LoadingSpinner size="sm" />
                                        <span className="register-button-text">Creating account...</span>
                                    </span>
                                ) : (
                                    <span className="register-button-content">
                                        <span>Vytvoriť účet</span>
                                        <svg className="register-button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </span>
                                )}
                            </button>
                           
                            {/* Sign In Link */}
                            <div className="register-signin">
                                <span className="register-signin-text">
                                    Už máte účet?{' '}
                                </span>
                                <button type="button" onClick={onNavigateToLogin} className="register-signin-link bg-transparent border-none cursor-pointer p-0 font-inherit underline text-inherit">
                                    Prihlásiť sa
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
