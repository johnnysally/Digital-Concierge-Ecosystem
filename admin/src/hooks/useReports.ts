import { useEffect, useState } from 'react';
import { getDashboardStats, getRevenueReport } from '../api/reportApi';
import type { DashboardStats } from '../types';

export const useDashboardStats = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDashboardStats()
            .then((res) => setStats(res.stats))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return { stats, loading };
};

export const useRevenueReport = (params?: any) => {
    const [revenue, setRevenue] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getRevenueReport(params)
            .then((res) => setRevenue(res.revenue))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return { revenue, loading };
};