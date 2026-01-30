import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Login from '../Login/Login';
import Register from '../Register/Register';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import NutritionTracker from '../NutritionTracker/NutritionTracker';

// Path-based routing: / = login or app, /register = register. No hash in URL.
function getViewFromPath() {
    const path = window.location.pathname.replace(/\/$/, '') || '/';
    return path.endsWith('/register') ? 'register' : 'login';
}

function AppRouter() {
    const { isAuthenticated, loading } = useAuth();
    const [currentView, setCurrentView] = useState(getViewFromPath);

    // Sync view from URL on load and on back/forward
    useEffect(() => {
        const handlePopState = () => setCurrentView(getViewFromPath());
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    // Update URL when view changes (path only, no hash)
    useEffect(() => {
        if (currentView === 'register') {
            window.history.replaceState(null, '', '/register');
        } else {
            window.history.replaceState(null, '', '/login');
        }
    }, [currentView]);

    // When authenticated, clear /login and /register from URL (no hash)
    useEffect(() => {
        if (isAuthenticated) {
            const path = window.location.pathname
                .replace(/\/login\/?$/, '/')
                .replace(/\/register\/?$/, '/') || '/';
            if (path !== window.location.pathname) {
                window.history.replaceState(null, '', path);
            }
        }
    }, [isAuthenticated]);

    const goToRegister = () => setCurrentView('register');
    const goToLogin = () => setCurrentView('login');

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

    if (currentView === 'register') {
        return (
            <Register
                onSuccess={() => setCurrentView('login')}
                onNavigateToLogin={goToLogin}
            />
        );
    }

    return (
        <Login
            onSuccess={() => setCurrentView('login')}
            onNavigateToRegister={goToRegister}
        />
    );
}

export default AppRouter;
