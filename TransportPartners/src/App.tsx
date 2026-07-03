import { Routes, Route } from 'react-router-dom';
import PartnerLayout from './layouts/PartnerLayout';
import DashboardPage from './features/transport/dashboard/pages/DashboardPage';
import DeliveriesPage from './features/transport/deliveries/pages/DeliveriesPage';
import EarningsPage from './features/transport/earnings/pages/EarningsPage';
import ProfilePage from './features/transport/profile/pages/ProfilePage';
import RatingsPage from './features/transport/ratings/pages/RatingsPage';
import AnalyticsPage from './features/transport/analytics/pages/AnalyticsPage';
import SettingsPage from './features/transport/settings/pages/SettingsPage';

export default function App() {
  return (
    <Routes>
      <Route element={<PartnerLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/deliveries" element={<DeliveriesPage />} />
        <Route path="/earnings" element={<EarningsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/ratings" element={<RatingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
