import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const PagoList = Loadable(lazy(() => import('./PagoList')));

const PaymentRoutes = [
  {
    path: '/Pago-list',
    element: <PagoList />,
  },
];

export default PaymentRoutes;
