import { stringify } from 'qs';
import request from '../utils/request';
import { getToken } from '../utils/usertoken';
import { FETCH_ENV } from '../utils/utils';
import appConfig from '../../config/app.config';


const userToken = getToken();

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function getUrl() {
  return request('/wechat/auth/url?key=qrcode&redirectUrl=http://imuyuan.com');
}

export async function buildWechatInfo(params) {
  return request(`/api/wechat/auth/buildWxLoginInfo?${stringify(params)}`);
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function queryNotices() {
  return request('/api/notices');
}

// new
export async function fakeAccountLogin(params) {
  return request('/api/auth/jwt/token', {
    method: 'POST',
    body: params,
  });
}

export async function queryMenu(token) {
  const userId = token || userToken;
  const url = '/api/admin/user/front/menus';
  return request(url, { Authorization: userId });
}


// 登出
export async function loginOut() {
  return request('/api/auth/jwt/logout', {
    method: 'POST',
    headers: {
      Authorization: localStorage.getItem('user-token'),
    },
  });
}

// 单点登录登出
export async function singleLogout() {
  const domain = FETCH_ENV().split('cas')[0];
  return request(`${domain}cas/logout`, {
    method: 'POST',
    // headers: {
    //   Authorization: localStorage.getItem('user-token'),
    // },
  });
}

export async function freashToken() {
  return request('api/auth/jwt/refresh', {
    method: 'POST',
    headers: {
      Authorization: localStorage.getItem('user-token'),
      RefreshToken: localStorage.getItem('refreshToken'),
    },
  });
}

export async function queryMenuTree() {
  return request(`/api/admin/menu/tree?appCode=${appConfig.appShortCode}`);
}

export async function queryMenuId(params) {
  return request(`/api/admin/menu/${params.id}`);
}

export async function putMenu(params, uri) {
  return request(`/api${uri}/${params.id}`, {
    method: 'PUT',
    body: params,
  });
}

export async function deleteMenu(params, uri) {
  return request(`/api${uri}`, {
    method: 'DELETE',
    body: {
      id: params.id,
    },
  });
}

export async function queryAddMenu(params, uri) {
  return request(`/api${uri}`, {
    method: 'POST',
    body: params,
  });
}

export async function queryResourceList(params) {
  const menuId = params.menuId
    ? `&menuId=${params.menuId}`
    : '';
  const name = params.name
    ? `&name=${params.name}`
    : '';
  const appcode = `&appCode=${appConfig.appShortCode}`;
  return request(`/api/admin/element/list?page=${params.page}&limit=${params.limit}${menuId}${name}${appcode}`);
}

export async function deleteElement(params, uri) {
  return request(`/api${uri}/${params.id}`, {
    method: 'DELETE',
  });
}

export async function addElement(params, uri) {
  return request(`/api${uri}`, {
    method: 'POST',
    body: params,
  });
}

export async function putElement(params, uri) {
  return request(`/api${uri}/${params.id}`, {
    method: 'PUT',
    body: params,
  });
}

export async function getDictTree(params) {
  return request(`/api/admin/dict/v1/page?page=${params.page}&limit=${params.limit}&keyword=${params.name}`);
}

export async function getChildDictTree(params) {
  return request(`/api/admin/dict/v1/child/page?page=${params.page}&limit=${params.limit}&keyword=${params.name}&parentId=${params.id}`);
}

export async function queryDictTreeId(params) {
  return request(`/api/admin/dict/${params.id}`);
}

export async function putDict(params, uri) {
  return request(`/api${uri}/${params.id}`, {
    method: 'PUT',
    body: params,
  });
}

export async function deleteDict(params, uri) {
  return request(`/api${uri}/${params.id}`, {
    method: 'DELETE',
  });
}

export async function queryAddDict(params, uri) {
  return request(`/api${uri}`, {
    method: 'POST',
    body: params,
  });
}

export async function sendCode(params) {
  return request(`/api/wechat/verificationCode/send?jobNo=${params.jobNo}&cause=数字化养殖平台密码修改验证码`);
}

export async function getAppList() {
  return request('/api/admin/app/page?page=1&limit=20000');
}

export async function getCountOut(params) {
  return request(`api/admin/user/account/innerlist?jobNo=${params.jobNo}`);
}

export async function getCountInner(params) {
  return request(`api/admin/user/account/list?jobNo=${params.jobNo}`);
}

export async function getUserId(params) {
  return request(`/api/auth/jwt/tokenByWxQrCode?code=${params.code}`);
}

export async function validCode(params) {
  return request(`/api/wechat/verificationCode/verify?code=${params.code}&jobNo=${params.jobNo}`);
}

export async function resetPsd(params) {
  return request('/api/admin/user/internal/resetpwd', {
    method: 'POST',
    body: params,
    // headers: {   'Content-Type': 'application/x-www-form-urlencoded', },
  });
}

export async function getPhoneOut(params) {
  return request(`/api/admin/user/account/outlist?mobilePhone=${params.jobNo}`);
}

export async function getPhoneCode(params) {
  return request(`/api/admin/user/sendVerifyCodeByMobile?mobile=${params.jobNo}`);
}

export async function onlineUser(params) {
  return request(`api/auth/online/user/count/${params}`);
}

export async function userApi(params) {
  return request(`api/auth/online/user/${params}`, {
    method: 'POST',
  });
}

export async function codeAPI(params) {
  return request(`/api/admin/user/sendVerifyCode?mobile=${params.mobile}`);
}


// 注册接口
export async function registerAPI(params) {
  return request('/api/admin/corp/register', {
    method: 'POST',
    body: params,
  });
}

// 注册验证码校验
export async function validateCode(params) {
  return request(`/api/admin/user/verifyCode?mobile=${params.mobile || ''}&code=${params.code || ''}`);
}
