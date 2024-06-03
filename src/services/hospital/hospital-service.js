import axiosAPI from '../axiosApi';

export async function getAllHospitals(params = {}) {
  const response = await axiosAPI.get('hospitals', { params: params });
  return response;
}

export async function getHospitalById(id) {
  const response = await axiosAPI.get(`hospitals/` + id);
  return response;
}

export async function postHospital(data) {
  const response = await axiosAPI.post(`hospitals`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response;
}

export async function updateHospital(id, data) {
  const response = await axiosAPI.post(`hospitals/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response;
}

export async function deleteHospitalById(id) {
  const response = await axiosAPI.delete(`hospitals/${id}`);
  return response;
}
