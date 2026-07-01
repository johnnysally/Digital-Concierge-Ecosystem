import { RouteObject } from 'react-router-dom';
import React from 'react';
import ReviewsPage from '../pages/ReviewsPage';

const routes: RouteObject[] = [
  {
    path: 'reviews',
    children: [
      { index: true, element: <ReviewsPage /> },
    ],
  },
];

export default routes;
