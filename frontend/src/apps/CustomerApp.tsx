import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "../context/customer/AuthContext";
import { BookingProvider } from "../context/customer/BookingContext";
import { ChatProvider } from "../context/customer/ChatContext";
import { WalletProvider } from "../context/customer/WalletContext";
import CustomerLayout from "../components/customer/layout/CustomerLayout";
import HomePage from "../pages/customer/HomePage";
import LoginPage from "../pages/customer/LoginPage";
import RegisterPage from "../pages/customer/RegisterPage";
import AccommodationSearchPage from "../pages/customer/AccommodationSearchPage";
import BookingOverviewPage from "../pages/customer/BookingOverviewPage";
import FoodDeliveryPage from "../pages/customer/FoodDeliveryPage";
import TransportDashboardPage from "../pages/customer/TransportDashboardPage";
import WalletPage from "../pages/customer/WalletPage";
import ProfilePage from "../pages/customer/ProfilePage";
import SupportCenterPage from "../pages/customer/SupportCenterPage";
import NotificationsPage from "../pages/customer/NotificationsPage";
import PaymentsPage from "../pages/customer/PaymentsPage";
import PromotionsPage from "../pages/customer/PromotionsPage";
import ReviewsPage from "../pages/customer/ReviewsPage";
import SettingsPage from "../pages/customer/SettingsPage";
import ChatbotPage from "../pages/customer/ChatbotPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
    },
  },
});

function RequireAuth({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/customer/login" replace />;
  }

  return children;
}

const CustomerApp = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BookingProvider>
          <ChatProvider>
            <WalletProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/customer/login" element={<LoginPage />} />
                  <Route path="/customer/register" element={<RegisterPage />} />
                  <Route
                    path="/customer"
                    element={
                      <RequireAuth>
                        <CustomerLayout />
                      </RequireAuth>
                    }
                  >
                    <Route index element={<HomePage />} />
                    <Route path="search" element={<AccommodationSearchPage />} />
                    <Route path="bookings" element={<BookingOverviewPage />} />
                    <Route path="food" element={<FoodDeliveryPage />} />
                    <Route path="transport" element={<TransportDashboardPage />} />
                    <Route path="wallet" element={<WalletPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="support" element={<SupportCenterPage />} />
                    <Route path="notifications" element={<NotificationsPage />} />
                    <Route path="payments" element={<PaymentsPage />} />
                    <Route path="promotions" element={<PromotionsPage />} />
                    <Route path="reviews" element={<ReviewsPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="chat" element={<ChatbotPage />} />
                  </Route>
                  <Route path="*" element={<Navigate to="/customer" replace />} />
                </Routes>
              </BrowserRouter>
            </WalletProvider>
          </ChatProvider>
        </BookingProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default CustomerApp;
