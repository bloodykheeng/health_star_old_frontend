import axiosAPI from '../axiosApi';

export async function getAllRolesAndModifiedPermissionsService(params = {}) {
  const response = await axiosAPI.get('roles-with-modified-permissions', { params: params });
  return response;
}

export async function syncPermissionToRoleService(data) {
  const response = await axiosAPI.post(`sync-permissions-to-role`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response;
}
