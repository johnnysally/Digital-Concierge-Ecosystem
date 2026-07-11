import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { getDashboardStats } from '../api/reportApi';

interface DashboardStats {
    totalCustomers: number;
    totalPartners: number;
    totalProperties: number;
    totalBookings: number;
    totalRevenue: number;
    totalTickets: number;
    totalDisputes: number;
    accPartners: number;
    restPartners: number;
    transPartners: number;
}

interface DashboardContextState {
    stats: DashboardStats;
    loading: boolean;
    refresh: () => void;
}

const DashboardContext = createContext<DashboardContextState | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
    const [stats, setStats] = useState<DashboardStats>({
        totalCustomers: 0,
        totalPartners: 0,
        totalProperties: 0,
        totalBookings: 0,
        totalRevenue: 0,
        totalTickets: 0,
        totalDisputes: 0,
        accPartners: 0,
        restPartners: 0,
        transPartners: 0,
    });
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        const token = localStorage.getItem('digitalsafaris_admin');
        if (!token) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const res = await getDashboardStats();
            setStats(res.stats);
        } catch (error: any) {
            if (error?.response?.status === 401) {
                localStorage.removeItem('digitalsafaris_admin');
                window.location.href = '/login';
                return;
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStats(); }, []);

    return (
        <DashboardContext.Provider value={{ stats, loading, refresh: fetchStats }}>
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (!context) throw new Error('useDashboard must be used within DashboardProvider');
    return context;
};