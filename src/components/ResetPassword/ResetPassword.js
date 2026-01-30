import React, { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { authAPI } from "../../services/api";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import SuccessMessage from "../SuccessMessage/SuccessMessage";
import "./ResetPassword.css";

function getTokenFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("token") || "";
}

function ResetPassword({ onNavigateToLogin }) {
  const { t } = useLanguage();
  const [token, setToken] = useState("");
  const [formData, setFormData] = useState({
    new_password: "",
    new_password_confirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    setToken(getTokenFromUrl());
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token.trim()) {
      setError(t("resetPassword.invalidToken"));
      return;
    }
    if (formData.new_password !== formData.new_password_confirm) {
      setError(t("resetPassword.passwordsDoNotMatch"));
      return;
    }
    if (formData.new_password.length < 8) {
      setError(t("resetPassword.passwordTooShort"));
      return;
    }

    setLoading(true);
    try {
      const data = await authAPI.resetPassword(
        token.trim(),
        formData.new_password,
        formData.new_password_confirm,
      );
      setSuccess(t("resetPassword.success"));
      setFormData({ new_password: "", new_password_confirm: "" });
      setTimeout(() => {
        onNavigateToLogin();
      }, 2500);
    } catch (err) {
      const res = err.response;
      if (res?.status === 400 && res?.data) {
        const d = res.data;
        if (typeof d === "string") {
          setError(d);
        } else if (d.error) {
          setError(d.error);
        } else if (d.new_password && Array.isArray(d.new_password)) {
          setError(d.new_password[0]);
        } else if (d.token && Array.isArray(d.token)) {
          setError(d.token[0]);
        } else {
          setError(t("resetPassword.error"));
        }
      } else {
        setError(t("resetPassword.error"));
      }
    } finally {
      setLoading(false);
    }
  };

  if (!token.trim()) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-form-section">
          <div className="reset-password-form-wrapper">
            <div className="reset-password-form-card">
              <h2 className="reset-password-title">
                {t("resetPassword.title")}
              </h2>
              <ErrorMessage
                message={t("resetPassword.invalidToken")}
                onDismiss={() => {}}
              />
              <div className="reset-password-back">
                <button
                  type="button"
                  onClick={onNavigateToLogin}
                  className="reset-password-back-link"
                >
                  {t("resetPassword.backToLogin")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-container">
      <div
        className="reset-password-image-section"
        style={{
          backgroundImage: "url('/nutrition.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="reset-password-image-overlay">
          <h1 className="reset-password-title-main">Nutrition Tracker</h1>
          <p className="reset-password-subtitle-main">
            {t("resetPassword.subtitle")}
          </p>
        </div>
      </div>

      <div className="reset-password-form-section">
        <div className="reset-password-form-wrapper">
          <div className="reset-password-form-card">
            <div className="reset-password-header">
              <h2 className="reset-password-title">
                {t("resetPassword.title")}
              </h2>
              <p className="reset-password-subtitle">
                {t("resetPassword.enterNewPassword")}
              </p>
            </div>

            {error && (
              <ErrorMessage message={error} onDismiss={() => setError(null)} />
            )}
            {success && (
              <SuccessMessage
                message={success}
                onDismiss={() => setSuccess(null)}
              />
            )}

            <form onSubmit={handleSubmit} className="reset-password-form">
              <div className="reset-password-input-wrapper">
                <div className="reset-password-input-icon">
                  <svg
                    className="reset-password-input-icon-svg"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  id="new_password"
                  name="new_password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  className="reset-password-input"
                  placeholder={t("resetPassword.newPasswordPlaceholder")}
                  value={formData.new_password}
                  onChange={handleChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="reset-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Skryť heslo" : "Zobraziť heslo"}
                >
                  {showPassword ? (
                    <svg
                      className="reset-password-toggle-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="reset-password-toggle-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              <div className="reset-password-input-wrapper">
                <div className="reset-password-input-icon">
                  <svg
                    className="reset-password-input-icon-svg"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <input
                  id="new_password_confirm"
                  name="new_password_confirm"
                  type={showPasswordConfirm ? "text" : "password"}
                  required
                  minLength={8}
                  className="reset-password-input"
                  placeholder={t("resetPassword.confirmPasswordPlaceholder")}
                  value={formData.new_password_confirm}
                  onChange={handleChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="reset-password-toggle"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  aria-label={
                    showPasswordConfirm ? "Skryť heslo" : "Zobraziť heslo"
                  }
                >
                  {showPasswordConfirm ? (
                    <svg
                      className="reset-password-toggle-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="reset-password-toggle-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="reset-password-button"
              >
                {loading ? (
                  <span className="reset-password-button-content">
                    <LoadingSpinner size="sm" />
                    <span className="reset-password-button-text">
                      {t("resetPassword.submitting")}
                    </span>
                  </span>
                ) : (
                  <span className="reset-password-button-content">
                    <span>{t("resetPassword.submit")}</span>
                    <svg
                      className="reset-password-button-icon"
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

              <div className="reset-password-back">
                <span className="reset-password-back-text">
                  {t("resetPassword.rememberPassword")}{" "}
                </span>
                <button
                  type="button"
                  onClick={onNavigateToLogin}
                  className="reset-password-back-link"
                >
                  {t("resetPassword.backToLogin")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
