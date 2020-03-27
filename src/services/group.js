import request from '../utils/request';
import { appShortCode } from '../../config/app.config';

// export async function queryCurrent() {
//   return request(`/api/admin/user/front/info?token=${userToken}`);
// }

export async function querGroupList(params) {
  const name = params.name ? `&name=${params.name}` : '';
  return request(`/api/admin/groupType/page?page=${params.page}&limit=${params.limit}${name}`);
}

export async function deleteGroup(params) {
  return request(`/api/admin/groupType/${params.id}`, {
    method: 'DELETE',
  });
}

export async function updateGroupInfo(params) {
  return request(`/api/admin/groupType/${params.id}`, {
    method: 'PUT',
    body: params,
  });
}

export async function updateGroup(params) {
  return request(`/api/admin/group/${params.id}`, {
    method: 'PUT',
    body: params,
  });
}

export async function updateUserConnect(params) {
  return request('/api/admin/group/addGroupUsers', {
    method: 'POST',
    body: {
      groupId: params.id,
      members: params.members,
      leaders: params.leaders,
    },
  });
}

export async function deleteUserConnect(params) {
  return request('/api/admin/group/delGroupUsers', {
    method: 'DELETE',
    body: {
      groupId: params.id,
      members: params.members,
      leaders: params.leaders,
    },
  });
}

export async function deleteGroupRole(params) {
  return request(`/api/admin/group/${params.id}`, {
    method: 'DELETE',
  });
}

export async function queryGroupTypeAll() {
  return request(`/api/admin/groupType/all?appCode=${appShortCode}`);
}

export async function queryTypeById(params) {
  const namekey = params.searchGroup ? `&name=${params.searchGroup}` : '';
  return request(`/api/admin/group/tree?groupType=${params.id}${namekey}&appCode=${appShortCode}`);
}

export async function queryRoleById(params) {
  return request(`/api/admin/group/${params.id}`);
}

// export async function queryConnectUser(params) {
//   return request(`/api/admin/group/${params.id}/user`);
// }

export async function querySearchUser(params) {
  return request(`/api/admin/user/notLinkedList?groupId=${params.id}&keyword=${params.name}&page=${params.page}&limit=${params.limit}`);
}

export async function queryRoleUser(params) {
  return request(`/api/admin/group/getGroupUsers?keyword=${params.keyword}&type=${params.type}&page=${params.page}&limit=${params.limit}&groupId=${params.groupId}`);
}

export async function queryPowerMenuChoose(params) {
  return request(`/api/admin/group/${params.id}/authority/menu?appCode=${appShortCode}`);
}

export async function queryPowerElements(params) {
  return request(`/api/admin/element/list?menuId=${params.id}&appCode=${appShortCode}`);
}

export async function queryPowerMenu() {
  return request(`/api/admin/menu/tree?appCode=${appShortCode}`);
}

export async function updatePowerMenu(params) {
  return request(`/api/admin/group/${params.id}/authority/menu`, {
    method: 'POST',
    body: {
      menuTrees: params.tree,
    },
  });
}

export async function moveMenuElement(params) {
  return request(`/api/admin/group/${params.id}/authority/element/remove`, {
    method: 'POST',
    body: {
      menuId: params.menuId,
      elementId: params.elementId,
      appCode: appShortCode,
    },
  });
}

export async function updateElement(params) {
  return request(`/api/admin/group/${params.id}/authority/element/update`, {
    method: 'POST',
    body: {
      menuId: params.menuId,
      elementId: params.elementId,
      appCode: appShortCode,
    },
  });
}

export async function addMenuElement(params) {
  return request(`/api/admin/group/${params.id}/authority/element/add`, {
    method: 'POST',
    body: {
      menuId: params.menuId,
      elementId: params.elementId,
      appCode: appShortCode,
    },
  });
}

export async function queryMenuElementChoose(params) {
  return request(`/api/admin/group/${params.id}/authority/element?appCode=${appShortCode}`);
}

export async function addGroupRole(params) {
  return request('/api/admin/group', {
    method: 'POST',
    body: params,
  });
}
