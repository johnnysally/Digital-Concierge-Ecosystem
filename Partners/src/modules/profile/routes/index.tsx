import { RouteObject } from 'react-router-dom';
import React from 'react';
import ProfilePage from '../pages/ProfilePage';

const routes: RouteObject[] = [
  {
    path: 'profile',
    children: [
      { index: true, element: <ProfilePage /> },
      { path: 'settings', element: <ProfilePage /> },
    ],
  },
];

export default routes;
