import React, { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { authAPI } from "../../services/api";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import SuccessMessage from "../SuccessMessage/SuccessMessage";
import "./ForgotPassword.css";

function ForgotPassword({ onNavigateToLogin }) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const data = await authAPI.requestPasswordReset(formData.email.trim());
      const message = data?.message || t("messages.resetPasswordSuccess");
      setSuccess(message);
      setFormData({ email: "" });
    } catch (err) {
      const res = err.response;
      if (res?.status === 400 && res?.data) {
        const d = res.data;
        if (typeof d === "string") {
          setError(d);
        } else if (d.email && Array.isArray(d.email)) {
          setError(d.email[0]);
        } else if (d.email) {
          setError(d.email);
        } else if (d.message) {
          setError(d.message);
        } else {
          setError(t("messages.resetPasswordError"));
        }
      } else {
        setError(t("messages.resetPasswordError"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      {/* Image Section - Left Side */}
      <div
        className="forgot-password-image-section"
        style={{
          backgroundImage: "url('/nutrition.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="forgot-password-image-overlay">
          <div className="medical-icon">
            <svg
              className="forgot-password-icon-large"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
          <h1 className="forgot-password-title-main">Nutrition Tracker</h1>
          <p className="forgot-password-subtitle-main">
            Obnovenie prístupu k vášmu účtu
          </p>
        </div>
      </div>

      {/* Form Section - Right Side */}
      <div className="forgot-password-form-section">
        <div className="forgot-password-form-wrapper">
          <div className="forgot-password-form-card">
            {/* Logo/Brand Section */}
            <div className="forgot-password-header">
              <div className="forgot-password-logo">
                <svg
                  className="forgot-password-logo-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
              </div>
              <h2 className="forgot-password-title">
                {t("forgotPassword.title")}
              </h2>
              <p className="forgot-password-subtitle">
                {t("forgotPassword.subtitle")}
              </p>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <ErrorMessage message={error} onDismiss={() => setError(null)} />
            )}
            {success && (
              <SuccessMessage
                message={success}
                onDismiss={() => setSuccess(null)}
              />
            )}

            {/* Forgot Password Form */}
            <form onSubmit={handleSubmit} className="forgot-password-form">
              {/* Email Field */}
              <div className="forgot-password-input-wrapper">
                <div className="forgot-password-input-icon">
                  <svg
                    className="forgot-password-input-icon-svg"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="forgot-password-input"
                  placeholder={t("forgotPassword.emailPlaceholder")}
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="forgot-password-button"
              >
                {loading ? (
                  <span className="forgot-password-button-content">
                    <LoadingSpinner size="sm" />
                    <span className="forgot-password-button-text">
                      {t("forgotPassword.sending")}
                    </span>
                  </span>
                ) : (
                  <span className="forgot-password-button-content">
                    <span>{t("forgotPassword.sendInstructions")}</span>
                    <svg
                      className="forgot-password-button-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                )}
              </button>

              {/* Back to Login Link */}
              <div className="forgot-password-back">
                <span className="forgot-password-back-text">
                  {t("forgotPassword.rememberPassword")}{" "}
                </span>
                <button
                  type="button"
                  onClick={onNavigateToLogin}
                  className="forgot-password-back-link"
                >
                  {t("forgotPassword.backToLogin")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
