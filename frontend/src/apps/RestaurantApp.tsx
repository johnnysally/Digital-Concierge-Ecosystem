import { Navigate, Route, Routes } from 'react-router-dom';
import RestaurantLayout from '../components/restaurant/layout/RestaurantLayout';
import DashboardPage from '../pages/restaurant/DashboardPage';
import ForgotPasswordPage from '../pages/restaurant/ForgotPasswordPage';
import LoginPage from '../pages/restaurant/LoginPage';
import MenuItemFormPage from '../pages/restaurant/MenuItemFormPage';
import MenuListPage from '../pages/restaurant/MenuListPage';
import OrderDetailsPage from '../pages/restaurant/OrderDetailsPage';
import OrdersListPage from '../pages/restaurant/OrdersListPage';
import PaymentsPage from '../pages/restaurant/PaymentsPage';
import ProfilePage from '../pages/restaurant/ProfilePage';
import PromotionFormPage from '../pages/restaurant/PromotionFormPage';
import PromotionsPage from '../pages/restaurant/PromotionsPage';
import RegisterPage from '../pages/restaurant/RegisterPage';
import ReviewsPage from '../pages/restaurant/ReviewsPage';
import SettingsPage from '../pages/restaurant/SettingsPage';
import StaffFormPage from '../pages/restaurant/StaffFormPage';
import StaffListPage from '../pages/restaurant/StaffListPage';

const getStoredRestaurantSession = () => {
    try {
        const stored = localStorage.getItem('digitalsafaris_restaurant');
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
};

const isAuthenticated = () => Boolean(getStoredRestaurantSession()?.token);

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    return isAuthenticated() ? children : <Navigate to="login" replace />;
};

const RestaurantApp = () => (
    <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />

        <Route
            path=""
            element={
                <ProtectedRoute>
                    <RestaurantLayout />
                </ProtectedRoute>
            }
        >
            <Route index element={<DashboardPage />} />
            <Route path="menu" element={<MenuListPage />} />
            <Route path="menu/new" element={<MenuItemFormPage />} />
            <Route path="menu/:id/edit" element={<MenuItemFormPage />} />
            <Route path="orders" element={<OrdersListPage />} />
            <Route path="orders/:id" element={<OrderDetailsPage />} />
            <Route path="staff" element={<StaffListPage />} />
            <Route path="staff/new" element={<StaffFormPage />} />
            <Route path="staff/:id/edit" element={<StaffFormPage />} />
            <Route path="promotions" element={<PromotionsPage />} />
            <Route path="promotions/new" element={<PromotionFormPage />} />
            <Route path="promotions/:id/edit" element={<PromotionFormPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="login" replace />} />
    </Routes>
);

export default RestaurantApp;
