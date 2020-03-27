import request from '../utils/request';


export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/admin/user/front/info');
}

export async function queryUserList(params) {
  return request(`/api/admin/user/manager/userpage?page=${params.page}&limit=${params.limit}&keyword=${params.name}`);
}

export async function addUser(params, uri) {
  return request(`/api${uri}`, {
    method: 'POST',
    body: params,
  });
}

export async function updateUser(params, uri) {
  return request(`/api${uri}`, {
    method: 'PUT',
    body: {
      ...params,
      id: params.id,
    },
  });
}

export async function deleteUser(params, uri) {
  return request(`/api${uri}`, {
    method: 'DELETE',
    body: {
      id: params.id,
    },
  });
}

export async function updatePsd(params, uri) {
  return request(`/api${uri}`, {
    method: 'PUT',
    body: params,
  });
}
