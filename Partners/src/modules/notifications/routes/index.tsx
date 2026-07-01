import { RouteObject } from 'react-router-dom';
import React from 'react';
import NotificationsPage from '../pages/NotificationsPage';

const routes: RouteObject[] = [
  {
    path: 'notifications',
    children: [
      { index: true, element: <NotificationsPage /> },
    ],
  },
];

export default routes;
