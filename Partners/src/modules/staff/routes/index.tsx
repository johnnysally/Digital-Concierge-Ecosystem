import { RouteObject } from 'react-router-dom';
import StaffListPage from '../pages/StaffListPage';
import StaffFormPage from '../pages/StaffFormPage';

const routes: RouteObject[] = [
  {
    path: 'staff',
    children: [
      { index: true, element: <StaffListPage /> },
      { path: 'new', element: <StaffFormPage /> },
      { path: ':id', element: <StaffFormPage /> },
    ],
  },
];

export default routes;
