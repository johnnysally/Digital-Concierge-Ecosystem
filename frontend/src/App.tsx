import { BrowserRouter } from 'react-router-dom';
import CustomerApp from './apps/CustomerApp';

const App = () => (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <CustomerApp />
    </BrowserRouter>
);

export default App;