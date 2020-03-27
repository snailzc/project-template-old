import { onlineUser, userApi } from '../services/api';
import { FETCH_ENV } from '../utils/utils';

/* eslint-disable import/no-mutable-exports */
let menuList = [];
let menuTitle = '';
const envir = process.env.API_ENV;
const appConfig = require("../../config/app.config.js");
const system = [{ title: appConfig.appName, code: appConfig.appShortCode, url: '#/user/login'}];

function formatter(data, parentPath = '', parentAuthority) {
  return data.map((item) => {
    const result = {
      ...item,
      path: `${parentPath}${item.path}`,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

function formate(data) {
  const DataArr = [];
  if (data && data.length) {
    data.map((item) => {
      const path = item.path.split('/')[item.path.split('/').length - 1];
      const obj = item;
      obj.children = obj.children.length ? formate(obj.children) : [];
      DataArr.push({
        ...item,
        name: item.title,
        icon: item.icon,
        path,
        children: obj.children,
      });
      return '';
    });
  }
  return DataArr;
}
// 获取菜单 menuList
const formateRoute = (res) => {
  menuList = formatter(formate(res));
};

// 根据titel判断code；
function judgeTitle(title) {
  const arr = system.filter((item) => {
    return item.title === title;
  });
  return arr[0] ? arr : [{ ...system[0] }];
}

// 根据hash判断code、存储session
function judgeUrl(url) {
  const arr = system.filter((item) => {
    return item.url === url;
  });
  menuTitle = arr[0] ? arr[0].title : system[0].title;
  sessionStorage.webTitle = menuTitle;
  return arr[0] ? arr : [{ ...system[0] }];
}

// 获取菜单
function redirectUrl() {
  const url = window.location.hash;
  const title = sessionStorage.webTitle;
  let judge = '';
  if (title && title !== 'false') {
    judge = judgeTitle(title);
  } else if (url) {
    judge = judgeUrl(url);
  }
  // console.log(title, 'title', url, 'url', judge, 'judge');
  return judge[0].code;
}


// 获取在线人数
function getOnline() {
  const code = redirectUrl();
  const wTWeChat = sessionStorage.webTitle;
  if (wTWeChat && wTWeChat === '牧原数字化养殖平台') {
    return onlineUser(code).then((res) => {
      if (res && res.data) {
        return res.data;
      }
    });
  } else {
    return userApi(code).then(() => {
      return onlineUser(code);
    }).then((res) => {
      if (res && res.data) {
        return res.data;
      }
    });
  }
}

// cas单点登录
function casPigLogin() {
  sessionStorage.webTitle = '牧原养猪管理平台';
  const serviceUrl = FETCH_ENV();
  const curUrl = encodeURIComponent(window.location.href);
  window.location.href = `${serviceUrl}${curUrl}`;
}

function goCas() {
  if (envir !== 'local' && localStorage.isRedirect === 'false') {
    casPigLogin();
  } else {
    window.location.hash = '#/user/pigLogin';
  }
}

export {
  menuList,
  formateRoute,
  getOnline,
  redirectUrl,
  casPigLogin,
  goCas,
  menuTitle,
  judgeUrl,
  judgeTitle,
};

