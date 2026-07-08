import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { User } from "../../types/customer";
import { login as loginApi, refreshUser } from "../../api/customer/authApi";

interface AuthContextState {
  user: User | null;
  isAuthenticated: boolean;
  login: (payload: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("digitalsafaris_customer");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("digitalsafaris_customer", JSON.stringify(user));
    } else {
      localStorage.removeItem("digitalsafaris_customer");
    }
  }, [user]);

  const login = async (payload: { email: string; password: string }) => {
    const response = await loginApi(payload);
    setUser(response);
  };

  const logout = () => {
    setUser(null);
  };

  const refreshSession = async () => {
    if (!user) return;
    const refreshedUser = await refreshUser();
    setUser(refreshedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
