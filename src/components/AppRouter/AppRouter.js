import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Login from "../Login/Login";
import Register from "../Register/Register";
import ForgotPassword from "../ForgotPassword/ForgotPassword";
import ResetPassword from "../ResetPassword/ResetPassword";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import NutritionTracker from "../NutritionTracker/NutritionTracker";

// Path-based routing: / = login or app, /register, /forgot-password, /reset-password. No hash in URL.
function getViewFromPath() {
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  if (path.endsWith("/register")) return "register";
  if (path.endsWith("/forgot-password")) return "forgot-password";
  if (path.endsWith("/reset-password")) return "reset-password";
  return "login";
}

function AppRouter() {
  const { isAuthenticated, loading } = useAuth();
  const [currentView, setCurrentView] = useState(getViewFromPath);

  // Sync view from URL on load and on back/forward
  useEffect(() => {
    const handlePopState = () => setCurrentView(getViewFromPath());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Update URL when view changes (path only, no hash). Do not replace URL on reset-password so ?token= stays.
  useEffect(() => {
    if (currentView === "register") {
      window.history.replaceState(null, "", "/register");
    } else if (currentView === "forgot-password") {
      window.history.replaceState(null, "", "/forgot-password");
    } else if (currentView === "reset-password") {
      // Keep current URL (e.g. /reset-password?token=xxx)
    } else {
      window.history.replaceState(null, "", "/");
    }
  }, [currentView]);

  // When authenticated, clear /login, /register, /forgot-password, /reset-password from URL (no hash)
  useEffect(() => {
    if (isAuthenticated) {
      const path =
        window.location.pathname
          .replace(/\/login\/?$/, "/")
          .replace(/\/register\/?$/, "/")
          .replace(/\/forgot-password\/?$/, "/")
          .replace(/\/reset-password\/?$/, "/") || "/";
      if (path !== window.location.pathname) {
        window.history.replaceState(null, "", path);
      }
    }
  }, [isAuthenticated]);

  const goToRegister = () => setCurrentView("register");
  const goToLogin = () => setCurrentView("login");
  const goToForgotPassword = () => setCurrentView("forgot-password");

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If authenticated, show the main app
  if (isAuthenticated) {
    return <NutritionTracker />;
  }

  if (currentView === "register") {
    return (
      <Register
        onSuccess={() => setCurrentView("login")}
        onNavigateToLogin={goToLogin}
      />
    );
  }

  if (currentView === "forgot-password") {
    return <ForgotPassword onNavigateToLogin={goToLogin} />;
  }

  if (currentView === "reset-password") {
    return <ResetPassword onNavigateToLogin={goToLogin} />;
  }

  return (
    <Login
      onSuccess={() => setCurrentView("login")}
      onNavigateToRegister={goToRegister}
      onNavigateToForgotPassword={goToForgotPassword}
    />
  );
}

export default AppRouter;
