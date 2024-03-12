import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const UserAdmin = Loadable(lazy(() => import('./UserAdmin')));

const UserAdminRoutes = [
  {
    path: '/usuario',
    element: <UserAdmin />,
  },
];
export default UserAdminRoutes;
