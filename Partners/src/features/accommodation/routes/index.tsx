import React from 'react';
import { RouteObject } from 'react-router-dom';
import AccommodationLayout from '../layouts/AccommodationLayout';
import dashboardRoutes from '../dashboard/routes';
import propertyRoutes from '../../../modules/property/routes';
import roomsRoutes from '../../../modules/rooms/routes';
import reservationsRoutes from '../../../modules/reservations/routes';
import guestsRoutes from '../../../modules/guests/routes';
import housekeepingRoutes from '../../../modules/housekeeping/routes';
import staffRoutes from '../../../modules/staff/routes';
import paymentsRoutes from '../../../modules/payments/routes';
import promotionsRoutes from '../../../modules/promotions/routes';
import analyticsRoutes from '../../../modules/analytics/routes';
import reviewsRoutes from '../../../modules/reviews/routes';
import notificationsRoutes from '../../../modules/notifications/routes';
import communicationRoutes from '../../../modules/communication/routes';
import documentsRoutes from '../../../modules/documents/routes';
import profileRoutes from '../../../modules/profile/routes';
import settingsRoutes from '../../../modules/settings/routes';
import aiRoutes from '../../../modules/ai/routes';

const accommodationRoutes: RouteObject[] = [
  {
    path: '/partners/accommodation',
    element: <AccommodationLayout />,
    children: [
      ...dashboardRoutes,
      ...propertyRoutes,
      ...roomsRoutes,
      ...reservationsRoutes,
      ...guestsRoutes,
      ...housekeepingRoutes,
      ...staffRoutes,
      ...paymentsRoutes,
      ...promotionsRoutes,
      ...analyticsRoutes,
      ...reviewsRoutes,
      ...notificationsRoutes,
      ...communicationRoutes,
      ...documentsRoutes,
      ...profileRoutes,
      ...settingsRoutes,
      ...aiRoutes,
    ],
  },
];

export default accommodationRoutes;
