import axiosAPI from '../axiosApi';

export async function getAllUserPoints(params = {}) {
  const response = await axiosAPI.get('user-points', { params: params });
  return response;
}

export async function getUserPointById(id) {
  const response = await axiosAPI.get(`user-points/` + id);
  return response;
}

export async function postUserPoint(data) {
  const response = await axiosAPI.post(`user-points`, data);
  return response;
}

export async function updateUserPoint(id, data) {
  const response = await axiosAPI.post(`user-points/${id}`, data);
  return response;
}

export async function deleteUserPointById(id) {
  const response = await axiosAPI.delete(`user-points/${id}`);
  return response;
}
