import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const FinancingList = Loadable(lazy(() => import('./FinancingList')));
const Calculadora = Loadable(lazy(() => import('./Calculadora')));

const FinancingRoutes = [
  {
    path: '/Prestamo-list',
    element: <FinancingList />,
  },
  {
    path: '/calculadora',
    element: <Calculadora />,
  },
];

export default FinancingRoutes;
