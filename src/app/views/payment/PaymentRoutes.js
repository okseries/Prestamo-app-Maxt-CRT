import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const PagoList = Loadable(lazy(() => import('./PagoList')));

const PaymentRoutes = [
  {
    path: '/historial-pagos',
    element: <PagoList />,
  },
];

export default PaymentRoutes;
