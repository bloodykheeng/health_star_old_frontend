import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';

// ==============================|| MINIMAL LAYOUT ||============================== //

export default function MinimalLayout() {
  return (
    <>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </>
  );
}
