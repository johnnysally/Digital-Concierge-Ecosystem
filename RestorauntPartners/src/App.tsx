import { Route, Routes, Navigate } from 'react-router-dom';
import Layout from './layouts/PartnerLayout';
import DashboardPage from './features/restaurant/dashboard/pages/DashboardPage';
import OrdersPage from './features/restaurant/orders/pages/OrdersPage';
import MenuPage from './features/restaurant/menu/pages/MenuPage';
import PromotionsPage from './features/restaurant/promotions/pages/PromotionsPage';
import ReviewsPage from './features/restaurant/reviews/pages/ReviewsPage';
import AnalyticsPage from './features/restaurant/analytics/pages/AnalyticsPage';
import DeliveryPage from './features/restaurant/delivery/pages/DeliveryPage';
import PaymentsPage from './features/restaurant/payments/pages/PaymentsPage';
import NotificationsPage from './features/restaurant/notifications/pages/NotificationsPage';
import AIAssistantPage from './features/restaurant/ai/pages/AIAssistantPage';
import ProfilePage from './features/restaurant/profile/pages/ProfilePage';
import SettingsPage from './features/restaurant/settings/pages/SettingsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate replace to="/restaurant/dashboard" />} />
        <Route path="restaurant/dashboard" element={<DashboardPage />} />
        <Route path="restaurant/orders" element={<OrdersPage />} />
        <Route path="restaurant/menu" element={<MenuPage />} />
        <Route path="restaurant/promotions" element={<PromotionsPage />} />
        <Route path="restaurant/reviews" element={<ReviewsPage />} />
        <Route path="restaurant/analytics" element={<AnalyticsPage />} />
        <Route path="restaurant/delivery" element={<DeliveryPage />} />
        <Route path="restaurant/payments" element={<PaymentsPage />} />
        <Route path="restaurant/notifications" element={<NotificationsPage />} />
        <Route path="restaurant/ai" element={<AIAssistantPage />} />
        <Route path="restaurant/profile" element={<ProfilePage />} />
        <Route path="restaurant/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate replace to="/restaurant/dashboard" />} />
      </Route>
    </Routes>
  );
}

export default App;
