import { RouteObject } from 'react-router-dom';
import PromotionsPage from '../pages/PromotionsPage';
import PromotionFormPage from '../pages/PromotionFormPage';

const routes: RouteObject[] = [
  {
    path: 'promotions',
    children: [
      { index: true, element: <PromotionsPage /> },
      { path: 'new', element: <PromotionFormPage /> },
    ],
  },
];

export default routes;
