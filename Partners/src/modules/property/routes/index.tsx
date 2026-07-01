import React from 'react';
import { RouteObject } from 'react-router-dom';
import PropertyListPage from '../pages/PropertyListPage';
import PropertyEditPage from '../pages/PropertyEditPage';

const propertyRoutes: RouteObject[] = [
  {
    path: 'properties',
    children: [
      { index: true, element: <PropertyListPage /> },
      { path: 'new', element: <PropertyEditPage /> },
      { path: ':id/edit', element: <PropertyEditPage /> },
    ],
  },
];

export default propertyRoutes;
