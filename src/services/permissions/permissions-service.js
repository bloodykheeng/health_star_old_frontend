import axiosAPI from '../axiosApi';

export async function getAllPermissionsService(params = {}) {
  const response = await axiosAPI.get('users-permissions', { params: params });
  return response;
}
