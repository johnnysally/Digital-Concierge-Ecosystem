import { RouteObject } from 'react-router-dom';
import RoomsListPage from '../pages/RoomsListPage';
import RoomFormPage from '../pages/RoomFormPage';
import RoomDetailsPage from '../pages/RoomDetailsPage';

const routes: RouteObject[] = [
  {
    path: 'rooms',
    children: [
      { index: true, element: <RoomsListPage /> },
      { path: 'new', element: <RoomFormPage /> },
      { path: ':id', element: <RoomDetailsPage /> },
    ],
  },
];

export default routes;
