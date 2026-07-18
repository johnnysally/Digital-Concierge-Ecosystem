import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import AccommodationLayout from '../components/accommodation/layout/AccommodationLayout';
import DashboardPage from '../pages/accommodation/DashboardPage';
import LoginPage from '../pages/accommodation/LoginPage';
import ProfilePage from '../pages/accommodation/ProfilePage';
import PropertyListPage from '../pages/accommodation/PropertyListPage';
import PropertyEditPage from '../pages/accommodation/PropertyEditPage';
import RegisterPage from '../pages/accommodation/RegisterPage';
import ForgotPasswordPage from '../pages/accommodation/ForgotPasswordPage';
import ReservationsListPage from '../pages/accommodation/ReservationsListPage';
import ReservationDetailsPage from '../pages/accommodation/ReservationDetailsPage';
import RoomsListPage from '../pages/accommodation/RoomsListPage';
import RoomDetailsPage from '../pages/accommodation/RoomDetailsPage';
import RoomFormPage from '../pages/accommodation/RoomFormPage';
import GuestsListPage from '../pages/accommodation/GuestsListPage';
import GuestDetailsPage from '../pages/accommodation/GuestDetailsPage';
import StaffListPage from '../pages/accommodation/StaffListPage';
import StaffFormPage from '../pages/accommodation/StaffFormPage';
import PromotionsPage from '../pages/accommodation/PromotionsPage';
import PromotionFormPage from '../pages/accommodation/PromotionFormPage';
import DocumentsPage from '../pages/accommodation/DocumentsPage';
import HousekeepingListPage from '../pages/accommodation/HousekeepingListPage';
import PaymentsPage from '../pages/accommodation/PaymentsPage';
import ReviewsPage from '../pages/accommodation/ReviewsPage';
import SettingsPage from '../pages/accommodation/SettingsPage';
import AnalyticsPage from '../pages/accommodation/AnalyticsPage';
import { AccommodationThemeProvider } from '../context/accommodation/ThemeContext';

const isAuthenticated = () => {
    const stored = localStorage.getItem('digitalsafaris_accommodation');
    return Boolean(stored);
};

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    return isAuthenticated() ? children : <Navigate to="login" replace />;
};

const AccommodationApp = () => {
    return (
        <AccommodationThemeProvider>
            <Routes>
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="forgot-password" element={<ForgotPasswordPage />} />
                <Route path="dashboard" element={<AccommodationLayout />}>
                    <Route index element={<DashboardPage />} />
                </Route>
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <AccommodationLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="analytics" element={<AnalyticsPage />} />
                    <Route path="properties" element={<PropertyListPage />} />
                    <Route path="properties/new" element={<PropertyEditPage />} />
                    <Route path="properties/:id" element={<PropertyEditPage />} />
                    <Route path="reservations" element={<ReservationsListPage />} />
                    <Route path="reservations/:id" element={<ReservationDetailsPage />} />
                    <Route path="rooms" element={<RoomsListPage />} />
                    <Route path="rooms/new" element={<RoomFormPage />} />
                    <Route path="rooms/:id" element={<RoomDetailsPage />} />
                    <Route path="rooms/:id/edit" element={<RoomFormPage />} />
                    <Route path="guests" element={<GuestsListPage />} />
                    <Route path="guests/:id" element={<GuestDetailsPage />} />
                    <Route path="staff" element={<StaffListPage />} />
                    <Route path="staff/new" element={<StaffFormPage />} />
                    <Route path="staff/:id" element={<StaffFormPage />} />
                    <Route path="promotions" element={<PromotionsPage />} />
                    <Route path="promotions/new" element={<PromotionFormPage />} />
                    <Route path="promotions/:id" element={<PromotionFormPage />} />
                    <Route path="documents" element={<DocumentsPage />} />
                    <Route path="housekeeping" element={<HousekeepingListPage />} />
                    <Route path="payments" element={<PaymentsPage />} />
                    <Route path="reviews" element={<ReviewsPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="settings" element={<SettingsPage />} />
                </Route>
                <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
        </AccommodationThemeProvider>
    );
};

export default AccommodationApp;
