import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import SuccessMessage from '../SuccessMessage/SuccessMessage';
import './Login.css';

function Login({ onSuccess, onNavigateToRegister }) {
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            const result = await login(formData.username, formData.password);
            
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
        <div className="login-container">
            {/* Image Section - Left Side */}
            <div
                className="login-image-section"
                style={{
                    backgroundImage: "url('/nutrition.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                <div className="login-image-overlay">
                    <div className="medical-icon">
                        <svg className="login-icon-large" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="login-title-main">
                        Nutrition Tracker
                    </h1>
                    <p className="login-subtitle-main">
                        Profesionálny systém riadenia výživy pre zdravotníckych pracovníkov
                    </p>
                    <div className="login-features">
                        <div className="login-feature-card">
                            <div className="login-feature-content">
                                <svg className="login-feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span className="login-feature-text">Zabezpečené</span>
                            </div>
                        </div>
                        <div className="login-feature-card">
                            <div className="login-feature-content">
                                <svg className="login-feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <span className="login-feature-text">Rýchle</span>
                            </div>
                        </div>
                        <div className="login-feature-card">
                            <div className="login-feature-content">
                                <svg className="login-feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span className="login-feature-text">Spoľahlivé</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Section - Right Side */}
            <div className="login-form-section">
                <div className="login-form-wrapper">
                    <div className="login-form-card">
                        {/* Logo/Brand Section */}
                        <div className="login-header">
                            <div className="login-logo">
                                <svg className="login-logo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="login-title">
                                Vitajte späť
                            </h2>
                            <p className="login-subtitle">
                                Prihláste sa pre prístup k nástenke sledovania výživy
                            </p>
                        </div>

                        {/* Error/Success Messages */}
                        {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}
                        {success && <SuccessMessage message={success} onDismiss={() => setSuccess(null)} />}

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="login-form">
                            {/* Username Field */}
                            <div className="login-input-wrapper">
                                <div className="login-input-icon">
                                    <svg className="login-input-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    className="login-input"
                                    placeholder="Zadajte používateľské meno"
                                    value={formData.username}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>

                            {/* Password Field */}
                            <div className="login-input-wrapper">
                                <div className="login-input-icon">
                                    <svg className="login-input-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="login-input login-input-password"
                                    placeholder="Zadajte heslo"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={loading}
                                    
                                />
                                <button
                                    type="button"
                                    className="login-password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={loading}
                                >
                                    {showPassword ? (
                                        <svg className="login-toggle-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="login-toggle-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                className="login-button"
                            >
                                {loading ? (
                                    <span className="login-button-content">
                                        <LoadingSpinner size="sm" />
                                        <span className="login-button-text">Prihlasujem...</span>
                                    </span>
                                ) : (
                                    <span className="login-button-content">
                                        <span>Prihlásiť sa</span>
                                        <svg className="login-button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </span>
                                )}
                            </button>

                            {/* Sign Up Link */}
                            <div className="login-signup">
                                <span className="login-signup-text">
                                    Nemáte účet?{' '}
                                </span>
                                <button type="button" onClick={onNavigateToRegister} className="login-signup-link text-yellow-500 !important bg-transparent border-none cursor-pointer p-0 font-inherit">
                                 Zaregistrujte sa zadarmo
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
