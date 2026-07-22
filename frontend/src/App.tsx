import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AccommodationApp from './apps/AccommodationApp';
import CustomerApp from './apps/CustomerApp';
import RestaurantApp from './apps/RestaurantApp';
import TransportApp from './apps/TransportApp';
import Error304Page from './pages/Error304Page';

const App = () => (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
            <Route path="/AccommodationPartner/*" element={<AccommodationApp />} />
            <Route path="/restaurant-admin/*" element={<RestaurantApp />} />
            <Route path="/TransportPartner/*" element={<TransportApp />} />
            <Route path="/error-304" element={<Error304Page />} />
            <Route path="*" element={<CustomerApp />} />
        </Routes>
    </BrowserRouter>
);

export default App;
