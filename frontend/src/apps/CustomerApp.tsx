import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '../context/customer/ThemeContext';
import { AuthProvider, useAuth } from '../context/customer/AuthContext';
import { SocketProvider } from '../context/customer/SocketContext';
import { BookingProvider } from '../context/customer/BookingContext';
import { ChatProvider } from '../context/customer/ChatContext';
import { WalletProvider } from '../context/customer/WalletContext';
import CustomerLayout from '../components/customer/layout/CustomerLayout';
import HomePage from '../pages/customer/HomePage';
import LoginPage from '../pages/customer/LoginPage';
import RegisterPage from '../pages/customer/RegisterPage';
import ForgotPasswordPage from '../pages/customer/ForgotPasswordPage';
import AccommodationSearchPage from '../pages/customer/AccommodationSearchPage';
import BookingOverviewPage from '../pages/customer/BookingOverviewPage';
import FoodDeliveryPage from '../pages/customer/FoodDeliveryPage';
import TransportDashboardPage from '../pages/customer/TransportDashboardPage';
import WalletPage from '../pages/customer/WalletPage';
import ProfilePage from '../pages/customer/ProfilePage';
import SupportCenterPage from '../pages/customer/SupportCenterPage';
import NotificationsPage from '../pages/customer/NotificationsPage';
import PaymentsPage from '../pages/customer/PaymentsPage';
import PromotionsPage from '../pages/customer/PromotionsPage';
import ReviewsPage from '../pages/customer/ReviewsPage';
import SettingsPage from '../pages/customer/SettingsPage';
import ChatbotPage from '../pages/customer/ChatbotPage';
import PropertyDetailPage from '../pages/customer/PropertyDetailPage';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { staleTime: 1000 * 60, refetchOnWindowFocus: false },
    },
});

function RequireAuth({ children }: { children: JSX.Element }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="text-slate-400 animate-pulse">Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
}

const CustomerApp = () => (
    <QueryClientProvider client={queryClient}>
        <ThemeProvider>
            <AuthProvider>
                <SocketProvider>
                    <BookingProvider>
                        <ChatProvider>
                            <WalletProvider>
                                <Routes>
                                    <Route path="/login" element={<LoginPage />} />
                                    <Route path="/register" element={<RegisterPage />} />
                                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                                    <Route path="/" element={<CustomerLayout />}>
                                        <Route index element={<HomePage />} />
                                        <Route path="search" element={<AccommodationSearchPage />} />
                                        <Route path="food" element={<FoodDeliveryPage />} />
                                        <Route path="transport" element={<TransportDashboardPage />} />
                                        <Route path="promotions" element={<PromotionsPage />} />
                                        <Route path="reviews" element={<ReviewsPage />} />
                                        <Route path="support" element={<SupportCenterPage />} />
                                        <Route path="bookings" element={<RequireAuth><BookingOverviewPage /></RequireAuth>} />
                                        <Route path="wallet" element={<RequireAuth><WalletPage /></RequireAuth>} />
                                        <Route path="profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
                                        <Route path="notifications" element={<RequireAuth><NotificationsPage /></RequireAuth>} />
                                        <Route path="payments" element={<RequireAuth><PaymentsPage /></RequireAuth>} />
                                        <Route path="settings" element={<RequireAuth><SettingsPage /></RequireAuth>} />
                                        <Route path="chat" element={<RequireAuth><ChatbotPage /></RequireAuth>} />
                                        <Route path="property/:id" element={<PropertyDetailPage />} />
                                    </Route>
                                    <Route path="*" element={<Navigate to="/" replace />} />
                                </Routes>
                            </WalletProvider>
                        </ChatProvider>
                    </BookingProvider>
                </SocketProvider>
            </AuthProvider>
        </ThemeProvider>
    </QueryClientProvider>
);

export default CustomerApp;