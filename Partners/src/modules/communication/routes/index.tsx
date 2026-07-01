import { RouteObject } from 'react-router-dom';
import React from 'react';
import CommunicationPage from '../pages/CommunicationPage';

const routes: RouteObject[] = [
  {
    path: 'communication',
    children: [
      { index: true, element: <CommunicationPage /> },
    ],
  },
];

export default routes;
