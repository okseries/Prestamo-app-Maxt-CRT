import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const HistorialMora = Loadable(lazy(() => import('./HistorialMora')));

const HistorialMoraRoute = [
  {
    path: '/historial-moras',
    element: <HistorialMora />,
  },
];

export default HistorialMoraRoute;
