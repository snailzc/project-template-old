import { stringify } from 'query-string';
import request from '../utils/request';
import { parseParam } from '../utils/utils';

export async function getAPI(params, uri) {
  return request(`/api${uri}?${stringify(params)}`);
}

export async function addAPI(params, uri) {
  return request(`/api${uri}`, {
    method: 'POST',
    body: params,
  });
}

export async function deleteAPI(params, uri) {
  return request(`/api${uri}?${stringify(params)}`, {
    method: 'DELETE',
  });
}

export async function editAPI(params, uri) {
  return request(`/api${uri}`, {
    method: 'PUT',
    body: params,
  });
}

export async function confirmAPI(params, uri) {
  return request(`/api${uri}?${parseParam(params)}`, {
    method: 'POST',
  });
}

export async function unconfirmAPI(params, uri) {
  return request(`/api${uri}?${parseParam(params)}`, {
    method: 'POST',
  });
}

export async function baseInfoAPI(params, service) {
  return request(`/api/expense/baseInfo/${service}`, {
    method: 'POST',
    body: params,
  });
}

export async function dictAPI(code) {
  return request(`/api/expense/baseInfo/dict/${code}`);
}

export async function bankInfoAPI(params, service) {
  return request(`/api/expense/bankInfo/${service}`, {
    method: 'POST',
    body: params,
  });
}
