import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DashboardProvider } from './context/DashboardContext';
import { getPublicSettings } from './api/settingsApi';
import { setPlatformCurrency } from './utils/formatCurrency';
import AdminLayout from './components/layout/AdminLayout';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import PartnersListPage from './pages/PartnersListPage';
import PartnerDetailsPage from './pages/PartnerDetailsPage';
import CustomersListPage from './pages/CustomersListPage';
import CustomerDetailsPage from './pages/CustomerDetailsPage';
import TransactionsPage from './pages/TransactionsPage';
import DisputesPage from './pages/DisputesPage';
import ReportsPage from './pages/ReportsPage';
import PlatformSettingsPage from './pages/PlatformSettingsPage';
import BackupsPage from './pages/BackupsPage';
import LegalPage from './pages/LegalPage';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { staleTime: 1000 * 60, refetchOnWindowFocus: false },
    },
});

function RequireAuth({ children }: { children: JSX.Element }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950">
                <div className="text-slate-400 animate-pulse">Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
}

const App = () => {
    useEffect(() => {
        getPublicSettings()
            .then((res) => {
                const config = res.settings || res.config || {};
                if (config.default_currency) {
                    setPlatformCurrency(config.default_currency);
                }
            })
            .catch(() => {});
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <DashboardProvider>
                    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                            <Route path="/" element={<RequireAuth><AdminLayout /></RequireAuth>}>
                                <Route index element={<DashboardPage />} />
                                <Route path="partners" element={<PartnersListPage />} />
                                <Route path="partners/:id" element={<PartnerDetailsPage />} />
                                <Route path="customers" element={<CustomersListPage />} />
                                <Route path="customers/:id" element={<CustomerDetailsPage />} />
                                <Route path="transactions" element={<TransactionsPage />} />
                                <Route path="disputes" element={<DisputesPage />} />
                                <Route path="reports" element={<ReportsPage />} />
                                <Route path="backups" element={<BackupsPage />} />
                                <Route path="settings" element={<PlatformSettingsPage />} />
                                <Route path="legal" element={<LegalPage />} />
                            </Route>
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </BrowserRouter>
                </DashboardProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
};

export default App;