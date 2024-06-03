import axiosAPI from '../axiosApi';

export async function getAllHospitalServices(params = {}) {
  const response = await axiosAPI.get('services', { params: params });
  return response;
}

export async function getHospitalServiceById(id) {
  const response = await axiosAPI.get(`services/` + id);
  return response;
}

export async function postHospitalService(data) {
  const response = await axiosAPI.post(`services`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response;
}

export async function updateHospitalService(id, data) {
  const response = await axiosAPI.post(`services/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response;
}

export async function deleteHospitalServiceById(id) {
  const response = await axiosAPI.delete(`services/${id}`);
  return response;
}
