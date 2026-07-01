import { RouteObject } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';

const routes: RouteObject[] = [
  {
    index: true,
    element: <DashboardPage />,
  },
];

export default routes;
