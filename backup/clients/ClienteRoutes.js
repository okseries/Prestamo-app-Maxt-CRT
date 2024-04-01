import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const ClientList = Loadable(lazy(() => import('./ClientList')));

const ClienteRoutes = [
  {
    path: '/cliente-list',
    element: <ClientList />,
  },
];

export default ClienteRoutes;
