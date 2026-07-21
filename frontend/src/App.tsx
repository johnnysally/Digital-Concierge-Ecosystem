import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AccommodationApp from './apps/AccommodationApp';
import CustomerApp from './apps/CustomerApp';
import TransportApp from './apps/TransportApp';
import Error304Page from './pages/Error304Page';

const App = () => (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
            <Route path="/accommodation/*" element={<AccommodationApp />} />
            <Route path="/transport-admin/*" element={<TransportApp />} />
            <Route path="/error-304" element={<Error304Page />} />
            <Route path="*" element={<CustomerApp />} />
        </Routes>
    </BrowserRouter>
);

export default App;
