import { RouteObject } from 'react-router-dom';
import SettingsPage from '../pages/SettingsPage';

const routes: RouteObject[] = [
  {
    path: 'settings',
    children: [
      { index: true, element: <SettingsPage /> },
    ],
  },
];

export default routes;
