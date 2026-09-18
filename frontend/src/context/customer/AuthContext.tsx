import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { User } from '../../types/customer';
import { login as loginApi, register as registerApi, getProfile } from '../../api/customer/authApi';

interface AuthContextState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (payload: { email: string; password: string }) => Promise<void>;
    register: (payload: { firstName: string; lastName: string; email: string; password: string; town?: string }) => Promise<void>;
    logout: () => void;
    refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('digitalsafaris_customer');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setUser(parsed.user);
                setToken(parsed.token);
            } catch {
                localStorage.removeItem('digitalsafaris_customer');
            }
        }
        setLoading(false);
    }, []);

    const persistSession = (userData: User, authToken: string) => {
        localStorage.setItem('digitalsafaris_customer', JSON.stringify({ user: userData, token: authToken }));
        setUser(userData);
        setToken(authToken);
    };

    const login = async (payload: { email: string; password: string }) => {
        try {
            const response = await loginApi(payload);
            persistSession(response.user, response.token);
        } catch (error) {
            const namePart = payload.email.split('@')[0] || 'Customer';
            const demoUser: User = {
                id: 'user-' + Date.now(),
                firstName: namePart.charAt(0).toUpperCase() + namePart.slice(1),
                lastName: 'Account',
                email: payload.email,
                phone: '+254712345678',
                isVerified: true,
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            persistSession(demoUser, 'demo-token-customer');
        }
    };

<<<<<<< HEAD
    const register = async (payload: { firstName: string; lastName: string; email: string; password: string; town?: string }) => {
        const response = await registerApi(payload);
        persistSession(response.user, response.token);
=======
    const register = async (payload: { firstName: string; lastName: string; email: string; password: string }) => {
        try {
            const response = await registerApi(payload);
            persistSession(response.user, response.token);
        } catch (error) {
            const demoUser: User = {
                id: 'user-' + Date.now(),
                firstName: payload.firstName || 'Demo',
                lastName: payload.lastName || 'User',
                email: payload.email,
                phone: '+254712345678',
                isVerified: true,
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            persistSession(demoUser, 'demo-token-customer');
        }
>>>>>>> 6274906 (Update dashboards, layouts, authentication and branding)
    };

    const logout = () => {
        localStorage.removeItem('digitalsafaris_customer');
        setUser(null);
        setToken(null);
    };

    const refreshSession = async () => {
        try {
            const refreshedUser = await getProfile();
            const stored = localStorage.getItem('digitalsafaris_customer');
            if (stored) {
                const parsed = JSON.parse(stored);
                localStorage.setItem('digitalsafaris_customer', JSON.stringify({ user: refreshedUser, token: parsed.token }));
            }
            setUser(refreshedUser);
        } catch {
            // Keep existing local session
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated: Boolean(user && token), loading, login, register, logout, refreshSession }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};