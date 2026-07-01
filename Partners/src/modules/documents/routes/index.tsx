import { RouteObject } from 'react-router-dom';
import React from 'react';
import DocumentsPage from '../pages/DocumentsPage';

const routes: RouteObject[] = [
  {
    path: 'documents',
    children: [
      { index: true, element: <DocumentsPage /> },
      { path: ':id', element: <DocumentsPage /> },
    ],
  },
];

export default routes;
