import { Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '../context/transport/ThemeContext';
import TransportLayout from '../components/transport/layout/TransportLayout';
import DashboardPage from '../pages/transport/DashboardPage';
import LoginPage from '../pages/transport/LoginPage';
import RegisterPage from '../pages/transport/RegisterPage';
import ForgotPasswordPage from '../pages/transport/ForgotPasswordPage';
import DriversListPage from '../pages/transport/DriversListPage';
import DriverFormPage from '../pages/transport/DriverFormPage';
import VehiclesListPage from '../pages/transport/VehiclesListPage';
import VehicleFormPage from '../pages/transport/VehicleFormPage';
import RidesListPage from '../pages/transport/RidesListPage';
import RideDetailsPage from '../pages/transport/RideDetailsPage';
import RideRequestsPage from '../pages/transport/RideRequestsPage';
import PromotionsPage from '../pages/transport/PromotionsPage';
import PromotionFormPage from '../pages/transport/PromotionFormPage';
import WalletPage from '../pages/transport/WalletPage';
import NotificationsPage from '../pages/transport/NotificationsPage';
import LiveMapPage from '../pages/transport/LiveMapPage';
import DispatchPage from '../pages/transport/DispatchPage';
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

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    return isAuthenticated() ? children : <Navigate to="login" replace />;
};

const TransportApp = () => (
    <ThemeProvider>
        <Routes>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />

            <Route
                path=""
                element={
                    <ProtectedRoute>
                        <TransportLayout />
                    </ProtectedRoute>
                }
            >
            <Route index element={<DashboardPage />} />
            <Route path="drivers" element={<DriversListPage />} />
            <Route path="drivers/new" element={<DriverFormPage />} />
            <Route path="drivers/:id/edit" element={<DriverFormPage />} />
            <Route path="vehicles" element={<VehiclesListPage />} />
            <Route path="vehicles/new" element={<VehicleFormPage />} />
            <Route path="vehicles/:id/edit" element={<VehicleFormPage />} />
            <Route path="ride-requests" element={<RideRequestsPage />} />
            <Route path="rides" element={<RidesListPage />} />
            <Route path="rides/:id" element={<RideDetailsPage />} />
            <Route path="promotions" element={<PromotionsPage />} />
            <Route path="promotions/new" element={<PromotionFormPage />} />
            <Route path="promotions/:id/edit" element={<PromotionFormPage />} />
            <Route path="wallet" element={<WalletPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="live" element={<LiveMapPage />} />
            <Route path="dispatch" element={<DispatchPage />} />
            <Route path="maintenance" element={<MaintenancePage />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="support" element={<SupportPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
        </Route>

            <Route path="*" element={<Navigate to="login" replace />} />
        </Routes>
    </ThemeProvider>
);

export default TransportApp;
