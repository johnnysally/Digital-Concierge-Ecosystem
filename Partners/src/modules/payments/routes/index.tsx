import { RouteObject } from 'react-router-dom';
import React from 'react';
import PaymentsPage from '../pages/PaymentsPage';

const routes: RouteObject[] = [
  {
    path: 'payments',
    children: [
      { index: true, element: <PaymentsPage /> },
      { path: 'payouts', element: <PaymentsPage /> },
      { path: ':id', element: <div /> },
    ],
  },
];

export default routes;
