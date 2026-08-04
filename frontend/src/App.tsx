import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AccommodationApp from './apps/AccommodationApp';
import CustomerApp from './apps/CustomerApp';
import RestaurantApp from './apps/RestaurantApp';
import TransportApp from './apps/TransportApp';
import Error304Page from './pages/Error304Page';
import StatusErrorPage from './pages/StatusErrorPage';

const App = () => (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
            <Route path="/accommodation/*" element={<AccommodationApp />} />
            <Route path="/accommodation-admin/*" element={<AccommodationApp />} />
            <Route path="/restaurant-admin/*" element={<RestaurantApp />} />
            <Route path="/transport-admin/*" element={<TransportApp />} />
            <Route path="/404" element={<StatusErrorPage statusCode={404} />} />
            <Route path="/304" element={<Error304Page />} />
            <Route path="/500" element={<StatusErrorPage statusCode={500} />} />
            <Route path="/error/:statusCode" element={<StatusErrorPage />} />
            <Route path="/error-304" element={<Error304Page />} />
            <Route path="*" element={<CustomerApp />} />
        </Routes>
    </BrowserRouter>
);

export default App;