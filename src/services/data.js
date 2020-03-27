import request from '../utils/request';
import { appShortCode } from '../../config/app.config';

export async function getUser(params) {
  const sorter = params.orderColumn ? `&orderColumn=${params.orderColumn}&order=${params.order}` : '';
  return request(`/api/admin/dataAuth/user/pageList?page=${params.page}&limit=${params.limit}&beginDate=${params.beginDate}&endDate=${params.endDate}&jobNo=${params.jobNo}&accountType=${params.accountType}${sorter}`);
}

export async function getTree(params) {
  return request(`/api/admin/dataAuth/tree/${appShortCode}`);
}

export async function getType(params) {
  return request(`/api/admin/appCode/dataType/get?appCode=${appShortCode}`);
}

export async function getUserPower(params) {
  return request(`/api/admin/dataAuth/user/get/${appShortCode}/${params.userId}`);
}

export async function add(params, uri) {
  return request(`/api${uri}`, {
    method: 'POST',
    body: params,
  });
}
