import { Provider } from 'react-redux';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { BrowserRouter, Navigate, useRoutes } from 'react-router-dom';
import store from './store';
import partnerRoutes from './routes';

const queryClient = new QueryClient();

function PartnerAppRoutes() {
  return useRoutes([
    { index: true, element: <Navigate replace to="/partners/accommodation" /> },
    { path: '*', element: <Navigate replace to="/partners/accommodation" /> },
    ...partnerRoutes,
  ]);
}

export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <PartnerAppRoutes />
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
}
