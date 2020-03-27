import React from 'react';
import fetch from 'dva/fetch';
import { notification, Modal, Button } from 'antd';
import { getToken } from './usertoken';
import { resetLocal } from './utils';
import styles from './utils.less';
// import { routerRedux } from 'dva/router';
// import store from '../index';

const codeMessage = {
  200: '服务器成功返回请求的数据',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器',
  502: '网关错误',
  503: '服务不可用，服务器暂时过载或维护',
  504: '网关超时',
};

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}

function error(res) {
  Modal.error({
    title: '错误详情',
    className: styles.modal,
    content: `${res && res.message}`,
  });
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function unitPatrolRequest(url, options) {
  const defaultOptions = {
    // credentials: 'include',
  };

  const newOptions = { ...defaultOptions, ...options };
  newOptions.headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    ...newOptions.headers,
  };
  if (localStorage.farmId && localStorage.farmId !== undefined && url.search('product') >= 0) {
    newOptions.headers['X-FARM-ID'] = localStorage.farmId;
    newOptions.headers['X-FARM-NAME'] = encodeURIComponent(localStorage.farmName);
  }
  // if (userToken) {
  //   newOptions.headers = {
  //     ...newOptions.headers,
  //     Authorization: `${userToken}`,
  //   }
  // }
  // console.log(newOptions, 'user', url);
  if (newOptions.Authorization) {
    newOptions.headers.Authorization = newOptions.Authorization;
  }
  if (url === 'api/auth/jwt/refresh' && localStorage.leftSeconds && localStorage.leftSeconds !== 'undefined' && localStorage.leftSeconds <= 600) {
    newOptions.headers.Authorization = localStorage.getItem('user-token');
    newOptions.headers.RefreshToken = localStorage.refreshToken;
    delete newOptions.Authorization;
    // document.cookie = `Admin-Token=${localStorage.refreshToken}`
  }
  if (url !== '/api/admin/user/front/menus' && url !== '/api/auth/jwt/token'
    && url !== '/api/admin/user/front/info' && url !== '/api/auth/jwt/refresh'
    && url !== '/api/admin/init/v1') {
    localStorage.ifRequest = true;
  }
  newOptions.body = JSON.stringify(newOptions.body);
  return fetch(url, newOptions)
    .then((response) => {
      if (response) {
        if (response.status === 204) {
          return response.text();
        }
        return response.json();
      }
    })
    .catch((e) => {
      // const { dispatch } = store;
      const status = e.name;
      if (status === 401) {
        e.response.json().then(() => {
          notification.error({
            message: '登录已过期，请重新登录',
            description: ' ',
          });
          resetLocal();
          window.location.reload();
        });
      }
      if (status === 429) {
        e.response.json().then(() => {
          // console.log(res.message);
          // localStorage.clear();
          notification.error({
            message: '请求次数过多，请稍后再试',
            description: ' ',
          });
        });
      }
      if (status === 400) {
        e.response.json().then((res) => {
          // console.log(res.message);
          // localStorage.clear();
          notification.error({
            message: res.message,
            description: ' ',
          });
          // window.location.reload();
        });
      }
      if (status === 403) {
        notification.error({
          message: '暂无任何权限',
          description: ' ',
        });
        // console.log(window.location.hash, 'hshd');
        // if (url === '/api/admin/user/front/menus') {
        //   localStorage.clear();
        //   return false;
        // }
        //  else {
        //   window.location.href = '#/exception/403';
        // }
        return;
      }
      if (status <= 504 && status >= 500) {
        if (localStorage.leftSeconds <= 600) {
          notification.error({
            message: '登录已过期，请重新登录',
            description: ' ',
          });
          resetLocal();
          window.location.reload();
          // window.location.href = '#/exception/500';
        } else {
          e.response.json().then((res) => {
            Modal.error({
              title: '服务器提了一个问题',
              content: (
                <div>
                  {status}
                  <Button size="small" onClick={() => error(res)}>查看错误详情</Button>
                </div>
              ),
            });
          });
          // window.location.href = '#/exception/500';
        }

        // if (window.location.hash !== '#/user/login') {
        //   // window.location.href = '#/exception/500';
        // } else {
        //   localStorage.clear();
        //   window.location.href = '#/user/login';
        // }
        return;
      }
      if (status >= 404 && status < 422) {
        notification.error({
          message: '您访问的页面不存在',
          description: ' ',
        });
        // window.location.href = '#/exception/404';
      }
    });
}
