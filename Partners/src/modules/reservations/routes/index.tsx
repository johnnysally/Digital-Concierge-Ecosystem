import { RouteObject } from 'react-router-dom';
import ReservationsListPage from '../pages/ReservationsListPage';
import ReservationDetailsPage from '../pages/ReservationDetailsPage';

const routes: RouteObject[] = [
  {
    path: 'reservations',
    children: [
      { index: true, element: <ReservationsListPage /> },
      { path: ':id', element: <ReservationDetailsPage /> },
      { path: ':id/edit', element: <ReservationDetailsPage /> },
    ],
  },
];

export default routes;
