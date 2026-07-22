import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { User } from '../../types/customer';
import { login as loginApi, register as registerApi, getProfile } from '../../api/customer/authApi';

interface AuthContextState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (payload: { email: string; password: string }) => Promise<void>;
    register: (payload: { firstName: string; lastName: string; email: string; password: string }) => Promise<void>;
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
            const parsed = JSON.parse(stored);
            setUser(parsed.user);
            setToken(parsed.token);
        }
        setLoading(false);
    }, []);

    const persistSession = (userData: User, authToken: string) => {
        localStorage.setItem('digitalsafaris_customer', JSON.stringify({ user: userData, token: authToken }));
        setUser(userData);
        setToken(authToken);
    };

    const login = async (payload: { email: string; password: string }) => {
        const response = await loginApi(payload);
        persistSession(response.user, response.token);
    };

    const register = async (payload: { firstName: string; lastName: string; email: string; password: string }) => {
        const response = await registerApi(payload);
        persistSession(response.user, response.token);
    };

    const logout = () => {
        localStorage.removeItem('digitalsafaris_customer');
        setUser(null);
        setToken(null);
    };

    const refreshSession = async () => {
        const refreshedUser = await getProfile();
        const stored = localStorage.getItem('digitalsafaris_customer');
        if (stored) {
            const parsed = JSON.parse(stored);
            localStorage.setItem('digitalsafaris_customer', JSON.stringify({ user: refreshedUser, token: parsed.token }));
        }
        setUser(refreshedUser);
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