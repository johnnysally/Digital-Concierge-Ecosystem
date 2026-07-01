import { RouteObject } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';

const routes: RouteObject[] = [
  {
    path: 'dashboard',
    children: [
      { index: true, element: <DashboardPage /> },
    ],
  },
];

export default routes;
