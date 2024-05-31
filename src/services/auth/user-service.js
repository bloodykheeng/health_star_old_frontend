import axiosAPI from '../axiosApi';

export async function getAllUsers(params = {}) {
  const response = await axiosAPI.get('users', { params: params });
  return response;
}

export async function getUserById(id) {
  const response = await axiosAPI.get(`users/${id}`);
  return response;
}

export async function getApproverRoles() {
  const response = await axiosAPI.get(`approver-roles`);
  return response;
}

export async function createUser(data) {
  const response = await axiosAPI.post(`users`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response;
}

export async function updateUser(id, data) {
  const response = await axiosAPI.post(`users/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response;
}

export async function deleteUserById(id) {
  console.log('deleting user endpoint');
  const response = await axiosAPI.delete(`users/${id}`);
  console.log('deleting user response is : ', response);
  return response;
}

export async function getAssignableRoles() {
  const response = await axiosAPI.get('roles');
  return response;
}
