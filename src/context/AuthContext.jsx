import { createContext, useContext, useState, useEffect, useMemo } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { getUserService, getCsrf } from '../services/auth/auth.js';
import axios from 'axios';
import { logout } from '../services/auth/auth-api';
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [logoutMutationIsLoading, setLogoutMutationIsLoading] = useState(false);

  const location = useLocation();

  const navigate = useNavigate();
  console.log('location.pathname : ', location.pathname);

  // const getCsrfToken = useQuery(["csrftoken"], getCsrf, {
  //     retry: false,
  //     onSuccess: (data) => {},
  //     onError: (error) => {
  //         console.log("error while getting csrf token : ", error);
  //     },
  // });

  function createQueryKeyWithFilterParams(filterParams) {
    // Check if filterParams is an object
    if (filterParams && typeof filterParams === 'object' && !Array.isArray(filterParams)) {
      // Create an array from the object's entries
      const paramsArray = Object.entries(filterParams).flat();
      return [...paramsArray];
    }
    // If filterParams is not an object, return the array without it
    return [];
  }

  const getUserQuery = useQuery({
    queryKey: ['user', ...createQueryKeyWithFilterParams(user)],
    queryFn: getUserService,
    retry: false
  });

  useEffect(() => {
    if (getUserQuery?.isError) {
      setIsLoading(false);
      if (location.pathname == '/login' || location.pathname == '/register') {
        console.log('location is outside auth');
      } else {
        // Redirect to the specified location
        navigate('/login');
      }
      console.log('Error fetching getAllMotorThirdParties:', getUserQuery?.error);
      getUserQuery?.error?.response?.data?.message
        ? toast.error(getUserQuery?.error?.response?.data?.message)
        : !getUserQuery?.error?.response
          ? toast.warning('Check Your Internet Connection Please')
          : toast.error('An Error Occured Please Contact Admin');
    }
  }, [getUserQuery?.isError]);

  const userData = useMemo(() => getUserQuery.data?.data, [getUserQuery.data]);

  useEffect(() => {
    if (getUserQuery.isSuccess) {
      setIsLoading(false);
      console.log('user data from auth context:', userData);

      if (!userData) {
        if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/forgotpassword') {
          console.log('location is outside auth');
        } else {
          navigate('/dashboard'); // Redirect to the specified location
        }
      } else {
        if (userData.message === 'Unauthenticated.') {
          // Handle "Unauthenticated" error
          console.log('User not logged in');
          if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/forgotpassword') {
            console.log('location is outside auth');
          } else {
            navigate('/login'); // Redirect to the specified location
          }
        } else {
          setUser(userData);
        }
      }
    }
  }, [userData]);

  // Logout mutation function
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: (data) => {
      setLogoutMutationIsLoading(false);
      // Reset the user state to null
      setUser(null);
      queryClient.resetQueries(['users']);
      queryClient.clear();

      // Remove the Authorization header from Axios
      axios.defaults.headers.common['Authorization'] = null;

      console.log('logout response is : ', data);
      navigate('/');
      window.location.reload();
      // Display a success toast message
      toast.success('Goodbye 👋');

      // Set loading state to false
      setIsLoading(false);
    },
    onError: (error) => {
      setLogoutMutationIsLoading(false);
      // Display an error toast message
      toast.error('Logout Error');

      // Set loading state to false
      setIsLoading(false);

      // Log the error
      console.log('Logout errors ', error);
    }
  });

  return (
    <AuthContext.Provider
      value={{
        getUserQuery,
        logoutMutation,
        setLogoutMutationIsLoading,
        logoutMutationIsLoading,
        user,
        errors,
        isLoading,
        setIsLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default function useAuthContext() {
  return useContext(AuthContext);
}
