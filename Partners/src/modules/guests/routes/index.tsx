import { RouteObject } from 'react-router-dom';
import GuestsListPage from '../pages/GuestsListPage';
import GuestDetailsPage from '../pages/GuestDetailsPage';

const routes: RouteObject[] = [
  {
    path: 'guests',
    children: [
      { index: true, element: <GuestsListPage /> },
      { path: ':id', element: <GuestDetailsPage /> },
    ],
  },
];

export default routes;
