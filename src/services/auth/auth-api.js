import axiosAPI, { setNewHeaders, setProfileHeaders } from '../axiosApi';

export async function signUp(data) {
  const response = await axiosAPI.post('/register', data);
  localStorage.setItem('user', response.data);
  return response;
}

export async function forgotPassword(email) {
  const response = await axiosAPI.post('forgot-password', {
    email
  });
  return response;
}

export async function obtainToken(email, password) {
  const response = await axiosAPI.post('/login', {
    email,
    password
  });
  setNewHeaders(response);
  setProfileHeaders(response);
  return response;
}

export async function refreshToken(refresh) {
  const response = await axiosAPI.post('/token/refresh/', {
    refresh
  });
  setNewHeaders(response);
  return response;
}

export async function addUser(data) {
  const response = await axiosAPI.post('register', data);
  return response;
}

export async function postThirdPartyRegisterAuth(data) {
  const response = await axiosAPI.post('third-party-register-auth', data);
  setNewHeaders(response);
  setProfileHeaders(response);
  return response;
}

export async function postThirdPartyLoginAuth(data) {
  const response = await axiosAPI.post('third-party-login-auth', data);
  setNewHeaders(response);
  setProfileHeaders(response);
  return response;
}

// eslint-disable-next-line
export async function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  // TODO: invalidate token on backend
}

export const isAuthenticated = () => {
  const token = localStorage.getItem('access_token');
  return !!token;
};
