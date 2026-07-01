import { RouteObject } from 'react-router-dom';
import React from 'react';
import AnalyticsPage from '../pages/AnalyticsPage';

const routes: RouteObject[] = [
  {
    path: 'analytics',
    children: [
      { index: true, element: <AnalyticsPage /> },
    ],
  },
];

export default routes;
