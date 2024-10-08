import AuthGuard from 'app/auth/AuthGuard';
import chartsRoute from 'app/views/charts/ChartsRoute';
import dashboardRoutes from 'app/views/dashboard/DashboardRoutes';
import materialRoutes from 'app/views/material-kit/MaterialRoutes';
import NotFound from 'app/views/sessions/NotFound';
import sessionRoutes from 'app/views/sessions/SessionRoutes';
import { Navigate } from 'react-router-dom';
import MatxLayout from './components/MatxLayout/MatxLayout';
import ClienteRoutes from './views/clients/ClienteRoutes';
import FinancingRoutes from './views/financing/FinancingRoutes';
import PaymentRoutes from './views/payment/PaymentRoutes';
import UserAdminRoutes from './views/user/UserAdminRoutes';
import HistorialMoraRoute from './views/moraHistory/HistorialMoraRoute';

const routes = [
  {
    element: (
      <AuthGuard>
        <MatxLayout />
      </AuthGuard>
    ),
    children: [
      ...dashboardRoutes,
      ...chartsRoute,
      ...materialRoutes,
      ...ClienteRoutes,
      ...FinancingRoutes,
      ...PaymentRoutes,
      ...UserAdminRoutes,
      ...HistorialMoraRoute,
    ],
  },
  ...sessionRoutes,
  { path: '/', element: <Navigate to="dashboard/default" /> },
  { path: '*', element: <NotFound /> },
];

export default routes;
