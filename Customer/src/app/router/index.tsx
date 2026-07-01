import { Routes, Route, RouteObject } from 'react-router-dom';
import React from 'react';
import CustomerLayout from '../../layouts/CustomerLayout';
import HomePage from '../../features/customer/search/pages/HomePage';
import AccommodationSearchPage from '../../features/customer/accommodation/pages/AccommodationSearchPage';
import TransportDashboardPage from '../../features/customer/transport/pages/TransportDashboardPage';
import FoodDeliveryPage from '../../features/customer/food/pages/FoodDeliveryPage';
import WalletPage from '../../features/customer/wallet/pages/WalletPage';
import PaymentsPage from '../../features/customer/payments/pages/PaymentsPage';
import MapsDashboardPage from '../../features/customer/maps/pages/MapsDashboardPage';
import ChatbotPage from '../../features/customer/chat/pages/ChatbotPage';
import NotificationsPage from '../../features/customer/notifications/pages/NotificationsPage';
import ReviewsPage from '../../features/customer/reviews/pages/ReviewsPage';
import SupportCenterPage from '../../features/customer/support/pages/SupportCenterPage';
import SettingsPage from '../../features/customer/settings/pages/SettingsPage';
import ProfilePage from '../../features/customer/profile/pages/ProfilePage';
import BookingOverviewPage from '../../features/customer/booking/pages/BookingOverviewPage';
import PromotionsPage from '../../features/customer/promotions/pages/PromotionsPage';
import UserProfilesPage from '../../features/customer/users/pages/UserProfilesPage';
import LoginPage from '../../features/customer/auth/pages/LoginPage';
import RegisterPage from '../../features/customer/auth/pages/RegisterPage';
import ForgotPasswordPage from '../../features/customer/auth/pages/ForgotPasswordPage';
// Partner portal routes
import partnerRoutes from '../../../../Partners/src/routes';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Partner Portal Routes */}
      {(partnerRoutes as RouteObject[]).map((route) => (
        <Route key={route.path} path={route.path} element={route.element}>
          {(route.children as RouteObject[] | undefined)?.map((childRoute: RouteObject) => (
            <Route 
              key={`${route.path}-${childRoute.path}`} 
              path={childRoute.path} 
              element={childRoute.element} 
            >
              {(childRoute.children as RouteObject[] | undefined)?.map((grandchildRoute: RouteObject) => (
                <Route
                  key={`${route.path}-${childRoute.path}-${grandchildRoute.path}`}
                  path={grandchildRoute.path}
                  element={grandchildRoute.element}
                />
              ))}
            </Route>
          ))}
        </Route>
      ))}

      {/* Customer Portal Routes */}
      <Route path="/" element={<CustomerLayout />}>
        <Route index element={<HomePage />} />
        <Route path="accommodation" element={<AccommodationSearchPage />} />
        <Route path="transport" element={<TransportDashboardPage />} />
        <Route path="food" element={<FoodDeliveryPage />} />
        <Route path="wallet" element={<WalletPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="maps" element={<MapsDashboardPage />} />
        <Route path="chat" element={<ChatbotPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="support" element={<SupportCenterPage />} />
        <Route path="promotions" element={<PromotionsPage />} />
        <Route path="traveler-profiles" element={<UserProfilesPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="bookings" element={<BookingOverviewPage />} />
      </Route>
    </Routes>
  );
}
