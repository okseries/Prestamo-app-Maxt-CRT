import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const ClientList = Loadable(lazy(() => import('./ClientList')));
const ClienteCreate = Loadable(lazy(() => import('./ClienteCreate')));

const ClienteRoutes = [
  {
    path: '/cliente-list',
    element: <ClientList />,
  },
  {
    path: '/cliente-create',
    element: <ClienteCreate />,
  },
];

export default ClienteRoutes;
