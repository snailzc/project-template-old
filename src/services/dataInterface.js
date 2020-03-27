import request from '../utils/request';
import { parseElementCode } from '../utils/utils';
import { appShortCode } from '../../config/app.config';

// 元素管理API
const base = 'api/admin/dataInterface';

export async function listAPI(params, pageElement) {
  const pms = {
    ...params,
    // menuId: getCurrentMenuId(),
    code: appShortCode,
  };
  return request(`${base}/getDataInterface`, {
    method: 'POST',
    body: pms,
    headers: {
      elementCode: parseElementCode(pageElement, 'view'),
    },
  });
}

export async function listGroupAPI(params, pageElement) {
  return request(`${base}/getGroup`, {
    method: 'POST',
    body: params,
    headers: {
      elementCode: parseElementCode(pageElement, 'view'),
    },
  });
}

export async function listUserAPI(params, pageElement) {
  return request(`${base}/getPerson`, {
    method: 'POST',
    body: params,
    headers: {
      elementCode: parseElementCode(pageElement, 'view'),
    },
  });
}
