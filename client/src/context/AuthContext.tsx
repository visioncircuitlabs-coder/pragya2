'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '@/lib/api';
import { User, UserRole } from '@pragya/shared';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: {
        email: string;
        password: string;
        role: keyof typeof UserRole;
        fullName?: string;
        companyName?: string;
    }) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    // Handle SSR - only run on client
    useEffect(() => {
        setMounted(true);
    }, []);

    const refreshUser = useCallback(async () => {
        if (typeof window === 'undefined') return;

        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setUser(null);
                return;
            }

            const userData = await authApi.getMe();
            setUser(userData);
        } catch (error) {
            console.error('Failed to refresh user:', error);
            setUser(null);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        }
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const initAuth = async () => {
            setIsLoading(true);
            await refreshUser();
            setIsLoading(false);
        };

        initAuth();
    }, [mounted, refreshUser]);

    const login = async (email: string, password: string) => {
        try {
            const response = await authApi.login({ email, password });

            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            localStorage.setItem('user', JSON.stringify(response.user));

            setUser(response.user);
        } catch (error: any) {
            const message = error.response?.data?.message || 'Login failed. Please try again.';
            throw new Error(message);
        }
    };

    const register = async (data: {
        email: string;
        password: string;
        role: keyof typeof UserRole;
        fullName?: string;
        companyName?: string;
    }) => {
        try {
            const response = await authApi.register(data as Parameters<typeof authApi.register>[0]);

            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            localStorage.setItem('user', JSON.stringify(response.user));

            setUser(response.user);
        } catch (error: any) {
            const message = error.response?.data?.message || 'Registration failed. Please try again.';
            throw new Error(message);
        }
    };

    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            await authApi.logout(refreshToken || undefined);
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
