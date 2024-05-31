import { lazy } from 'react';
import { CircularProgress, Box } from '@mui/material';
import useAuthContext from '../context/AuthContext';
import { Outlet } from 'react-router-dom';

// project import
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// render - login
const AuthLogin = Loadable(lazy(() => import('pages/authentication/login')));
const AuthRegister = Loadable(lazy(() => import('pages/authentication/register')));
const AuthResetPassword = Loadable(lazy(() => import('pages/authentication/ResetPassword')));

function CheckForAuth() {
  const { isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return <Outlet />;
}

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/',
      element: <CheckForAuth />,
      children: [
        {
          path: '/login',
          element: <AuthLogin />
        },
        {
          path: '/register',
          element: <AuthRegister />
        },
        {
          path: '/reset',
          element: <AuthResetPassword />
        }
      ]
    }
  ]
};

export default LoginRoutes;
