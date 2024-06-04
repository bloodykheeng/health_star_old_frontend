import axiosAPI from '../axiosApi';

export async function getAllHospitalServices(params = {}) {
  const response = await axiosAPI.get('hospital-services', { params: params });
  return response;
}

export async function getHospitalServiceById(id) {
  const response = await axiosAPI.get(`hospital-services/` + id);
  return response;
}

export async function postHospitalService(data) {
  const response = await axiosAPI.post(`hospital-services`, data);
  return response;
}

export async function updateHospitalService(id, data) {
  const response = await axiosAPI.put(`hospital-services/${id}`, data);
  return response;
}

export async function deleteHospitalServiceById(id) {
  const response = await axiosAPI.delete(`hospital-services/${id}`);
  return response;
}
