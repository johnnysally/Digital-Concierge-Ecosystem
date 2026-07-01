import { RouteObject } from 'react-router-dom';
import React from 'react';
import HousekeepingListPage from '../pages/HousekeepingListPage';

const routes: RouteObject[] = [
  {
    path: 'housekeeping',
    children: [
      { index: true, element: <HousekeepingListPage /> },
      { path: 'tasks', element: <HousekeepingListPage /> },
    ],
  },
];

export default routes;
