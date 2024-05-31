import { lazy } from 'react';
import { CircularProgress, Box } from '@mui/material';
import useAuthContext from '../context/AuthContext';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';

import MinimalLayout from 'layout/MinimalLayout';

const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));
const HospitalPage = Loadable(lazy(() => import('views/hospitals/HospitalsPage')));

//======================= user management ================
const UsersPage = Loadable(lazy(() => import('views/user-management/users/UsersPage')));
const RolesPage = Loadable(lazy(() => import('views/user-management/roles/RolesPage')));
const PermissionsPage = Loadable(lazy(() => import('views/user-management/permissions/PermissionsPage')));

function AuthenticatedDashboard() {
  const { isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return <Dashboard />;
}

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/',
      element: <AuthenticatedDashboard />,
      children: [
        {
          path: '/',
          element: <DashboardDefault />
        },
        {
          path: 'dashboard',
          element: <DashboardDefault />
        },
        {
          path: 'hospitals',
          element: <HospitalPage />
        },
        {
          path: 'users',
          element: <UsersPage />
        },
        {
          path: 'roles',
          element: <RolesPage />
        },
        {
          path: 'permissions',
          element: <PermissionsPage />
        },
        {
          path: 'color',
          element: <Color />
        },
        {
          path: 'sample-page',
          element: <SamplePage />
        },
        {
          path: 'shadow',
          element: <Shadow />
        },
        {
          path: 'typography',
          element: <Typography />
        }
      ]
    }
  ]
};

export default MainRoutes;
