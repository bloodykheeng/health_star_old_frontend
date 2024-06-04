import axiosAPI from '../axiosApi';

export async function getAllVisits(params = {}) {
  const response = await axiosAPI.get('visits', { params: params });
  return response;
}

export async function getVisitById(id) {
  const response = await axiosAPI.get(`visits/` + id);
  return response;
}

export async function postVisit(data) {
  const response = await axiosAPI.post(`visits`, data);
  return response;
}

export async function updateVisit(id, data) {
  const response = await axiosAPI.put(`visits/${id}`, data);
  return response;
}

export async function deleteVisitById(id) {
  const response = await axiosAPI.delete(`visits/${id}`);
  return response;
}
