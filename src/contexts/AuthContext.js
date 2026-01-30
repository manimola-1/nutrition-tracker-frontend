import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check if user is logged in on mount
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('access_token');
            const storedUser = localStorage.getItem('user');

            if (token && storedUser) {
                try {
                    // Verify token is still valid by fetching profile
                    const userData = await authAPI.getProfile();
                    setUser(userData);
                    setIsAuthenticated(true);
                } catch (error) {
                    // Token invalid, clear storage
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    localStorage.removeItem('user');
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (username, password) => {
        try {
            const response = await authAPI.login({ username, password });
            const { access, refresh, message } = response;

            // Store tokens
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);

            // Fetch user profile
            const userData = await authAPI.getProfile();
            localStorage.setItem('user', JSON.stringify(userData));

            setUser(userData);
            setIsAuthenticated(true);

            return { success: true, message: message || 'Login successful' };
        } catch (error) {
            const errorMessage = error.response?.data?.detail || 
                                error.response?.data?.non_field_errors?.[0] ||
                                error.message || 
                                'Login failed';
            return { success: false, message: errorMessage };
        }
    };

    const register = async (userData) => {
        try {
            const response = await authAPI.register(userData);
            const { access, refresh, user: newUser, message } = response;

            // Store tokens
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            localStorage.setItem('user', JSON.stringify(newUser));

            setUser(newUser);
            setIsAuthenticated(true);

            return { success: true, message: message || 'Registration successful' };
        } catch (error) {
            const errorMessage = error.response?.data?.detail ||
                                Object.values(error.response?.data || {})[0]?.[0] ||
                                error.message ||
                                'Registration failed';
            return { success: false, message: errorMessage };
        }
    };

    const logout = async () => {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
