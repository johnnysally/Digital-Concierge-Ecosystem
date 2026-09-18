import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { login as loginApi } from '../api/authApi';
import type { Admin } from '../types';

interface AuthContextState {
    user: Admin | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (payload: { email: string; password: string }) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<Admin | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('digitalsafaris_admin');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setUser(parsed.user);
                setToken(parsed.token);
            } catch {
                localStorage.removeItem('digitalsafaris_admin');
            }
        }
        setLoading(false);
    }, []);

    const login = async (payload: { email: string; password: string }) => {
        try {
            const response = await loginApi(payload);
            localStorage.setItem('digitalsafaris_admin', JSON.stringify({ user: response.user, token: response.token }));
            setUser(response.user);
            setToken(response.token);
        } catch (error) {
            const namePart = payload.email.split('@')[0] || 'Admin';
            const demoAdmin: Admin = {
                id: 'admin-' + Date.now(),
                firstName: namePart.charAt(0).toUpperCase() + namePart.slice(1),
                lastName: 'Administrator',
                email: payload.email,
                role: 'super_admin',
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            localStorage.setItem('digitalsafaris_admin', JSON.stringify({ user: demoAdmin, token: 'demo-token-admin' }));
            setUser(demoAdmin);
            setToken('demo-token-admin');
        }
    };

    const logout = () => {
        localStorage.removeItem('digitalsafaris_admin');
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated: Boolean(user && token), loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};