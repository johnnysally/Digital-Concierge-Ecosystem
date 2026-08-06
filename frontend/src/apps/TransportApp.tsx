import { Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '../context/transport/ThemeContext';
import Error304Page from '../pages/Error304Page';
import StatusErrorPage from '../pages/StatusErrorPage';
import TransportLayout from '../components/transport/layout/TransportLayout';
import DashboardPage from '../pages/transport/DashboardPage';
import LoginPage from '../pages/transport/LoginPage';
import RegisterPage from '../pages/transport/RegisterPage';
import ForgotPasswordPage from '../pages/transport/ForgotPasswordPage';
import ResetPasswordPage from '../pages/transport/ResetPasswordPage';
import DriversPage from '../pages/transport/DriversPage';
import ShortVehiclesPage from '../pages/transport/ShortVehiclesPage';
import LongVehiclesPage from '../pages/transport/LongVehiclesPage';
import ShortRidesPage from '../pages/transport/ShortRidesPage';
import LongRidesPage from '../pages/transport/LongRidesPage';
import ShortPricingPage from '../pages/transport/ShortPricingPage';
import LongPricingPage from '../pages/transport/LongPricingPage';
import PromotionsPage from '../pages/transport/PromotionsPage';
import WalletPage from '../pages/transport/WalletPage';
import NotificationsPage from '../pages/transport/NotificationsPage';
import LiveMapPage from '../pages/transport/LiveMapPage';
import MaintenancePage from '../pages/transport/MaintenancePage';
import TransactionsPage from '../pages/transport/TransactionsPage';
import SupportPage from '../pages/transport/SupportPage';
import ProfilePage from '../pages/transport/ProfilePage';
import SettingsPage from '../pages/transport/SettingsPage';

const getStoredTransportSession = () => {
    try {
        const stored = localStorage.getItem('digitalsafaris_transport');
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
};

const isAuthenticated = () => Boolean(getStoredTransportSession()?.token);

const isShuttle = () => {
    const session = getStoredTransportSession();
    return ['shuttle', 'bus'].includes(session?.user?.businessType || '');
};

const VehiclesPage = () => isShuttle() ? <LongVehiclesPage /> : <ShortVehiclesPage />;
const RidesPage = () => isShuttle() ? <LongRidesPage /> : <ShortRidesPage />;
const PricingPage = () => isShuttle() ? <LongPricingPage /> : <ShortPricingPage />;

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    return isAuthenticated() ? children : <Navigate to="login" replace />;
};

const TransportApp = () => (
    <ThemeProvider>
        <Routes>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="404" element={<StatusErrorPage statusCode={404} />} />
            <Route path="304" element={<Error304Page />} />
            <Route path="500" element={<StatusErrorPage statusCode={500} />} />
            <Route path="error/:statusCode" element={<StatusErrorPage />} />

            <Route path="" element={<ProtectedRoute><TransportLayout /></ProtectedRoute>}>
                <Route index element={<DashboardPage />} />
                <Route path="drivers" element={<DriversPage />} />
                <Route path="vehicles" element={<VehiclesPage />} />
                <Route path="vehicles/new" element={<VehiclesPage />} />
                <Route path="vehicles/:id/edit" element={<VehiclesPage />} />
                <Route path="rides" element={<RidesPage />} />
                <Route path="rides/:id" element={<RidesPage />} />
                <Route path="pricing" element={<PricingPage />} />
                <Route path="promotions" element={<PromotionsPage />} />
                <Route path="wallet" element={<WalletPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="live" element={<LiveMapPage />} />
                <Route path="maintenance" element={<MaintenancePage />} />
                <Route path="transactions" element={<TransactionsPage />} />
                <Route path="support" element={<SupportPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="settings" element={<SettingsPage />} />
            </Route>

            <Route path="*" element={<StatusErrorPage statusCode={404} />} />
        </Routes>
    </ThemeProvider>
);

export default TransportApp;