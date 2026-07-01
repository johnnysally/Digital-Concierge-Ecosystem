import { RouteObject } from 'react-router-dom';
import React from 'react';
import AiPage from '../pages/AiPage';

const routes: RouteObject[] = [
  {
    path: 'ai',
    children: [
      { index: true, element: <AiPage /> },
    ],
  },
];

export default routes;
