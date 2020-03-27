import request from '../utils/request';

export async function getUrl(params) {
  const curFarmId = localStorage.farmId;
  return request(`/api/admin/fineReport/view/v1?target=${params.uid}`, {
    headers: {
      'X-FARM-ID': curFarmId,
    },
  });
}
