import '@babel/polyfill';
import dva from 'dva';
import browserHistory from 'history/createHashHistory';
import createLoading from 'dva-loading';
import jwtDecode from 'jwt-decode';
import 'moment/locale/zh-cn';
import FastClick from 'fastclick';
import './rollbar';
import onError from './error';
import { formateRoute, redirectUrl, judgeTitle } from './common/menu';
import { queryMenu, freashToken, getUserId } from './services/api';
import { singleLogin } from './services/local';
import { getToken } from './utils/usertoken';
import {
  filterMenu,
  resetLocal,
  getQueryString,
} from './utils/utils';

import './index.less';

// 1. Initialize

const app = dva({
  history: browserHistory(),
  onError,
});
localStorage.singleLogin = false;
const envir = process.env.API_ENV;
localStorage.isRedirect = false;
// 单点登录
if (window.location.search.indexOf('ticket') !== -1) {
  const curTicket = getQueryString('ticket');
  localStorage.isRedirect = true;
  singleLogin(curTicket).then((res) => {
    if (res && res.data && res.data.rows) {
      localStorage.singleLogin = true;
      localStorage.setItem('user-token', res.data.rows[0].token);
      localStorage.setItem('refreshToken', res.data.rows[0].refreshToken);
      localStorage.setItem('antd-pro-authority', 'admin');
      const cliUrl = window.location.href.split('?')[0];
      sessionStorage.webTitle = '牧原养猪管理平台';
      window.location.href = cliUrl;
    }
  });
}

let userToken = getToken();

const curHref = window.location.href.split('?');
let curCode = '';
if (curHref.length > 1) {
  if (curHref[1].indexOf('code') > -1) {
    curCode = curHref[1].split('&')[0].split('=')[1];
  }
}
let code = '';


// 2. Plugins
app.use(createLoading());

// 3. Register global model
app.model(require('./models/global').default);

if (localStorage.singleLogin === 'false' && curCode) {
  // 二维码登录
  getUserId({ code: curCode }).then((res) => {
    if (res && res.length > 1) {
      localStorage.wechatRes = JSON.stringify(res);
      window.location.search = '';
      window.location.href = `//${window.location.host}`;
    } else if (res && res.length === 1) {
      const bytes = jwtDecode(res[0].accessToken.accessToken);
      localStorage.bytes = JSON.stringify(bytes);
      localStorage.setItem('user-token', res[0].accessToken.accessToken);
      localStorage.setItem('refreshToken', res[0].accessToken.refreshToken);
      document.cookie = `Admin-Token=${res[0].accessToken.accessToken}`;
      localStorage.leftSeconds =
        (`${bytes.exp}000` - new Date().getTime()) / 1000;
      userToken = res[0].accessToken.accessToken;
      localStorage.refreshToken = res[0].accessToken.refreshToken;
      localStorage.setItem('antd-pro-authority', 'admin');
      window.location.href = `//${window.location.host}`;
    } else {
      window.location.search = '';
      const wT = sessionStorage.webTitle;
      const hash = judgeTitle(wT);
      window.location.hash = hash[0].url;
    }
  });
} else if (userToken) {
  if (localStorage.singleLogin === 'true') {
    // 单点登录成功
    // localStorage.webTitle = '牧原养猪管理平台';
    // localStorage.onlineCode = 'pigProdPlat';
    // const { host } = window.location;
    // window.location.href = `http://${host}#/`;
  } else {
    code = redirectUrl();
  }
  queryMenu().then((res) => {
    // 存储上传地址
    if (envir === 'pro') {
      localStorage.v4Upload = 'https://my.imuyuan.com/file/upload/v4';
    } else if (envir === 'test') {
      localStorage.v4Upload = 'https://10.106.11.42/file/upload/v4';
    } else {
      localStorage.v4Upload = 'https://10.106.11.37/file/upload/v4';
    }

    if (code) {
      const routeData = filterMenu(res, [code]);
      formateRoute(routeData);
    } else {
      formateRoute(res);
    }

    // 4. Router
    app.router(require('./router').default);

    // 5. Start
    app.start('#root');
    FastClick.attach(document.body);
  });
} else {
  // 4. Router
  app.router(require('./router').default);

  // 5. Start
  app.start('#root');
  FastClick.attach(document.body);
}

let timer = null;
if (localStorage.bytes) {
  const bytes = JSON.parse(localStorage.bytes);
  const endTime = `${bytes.exp}000`;
  const left = endTime - new Date().getTime();
  if (!localStorage.leftSeconds || localStorage.leftSeconds === 'NaN') {
    localStorage.leftSeconds = left / 1000;
  }
  clearInterval(timer);
  freashUserToken();
}

export default app._store;

function freashUserToken() {
  clearInterval(timer);
  timer = setInterval(() => {
    if (localStorage.leftSeconds <= 600 && localStorage.ifRequest === 'true') {
      clearInterval(timer);
      localStorage.ifRequest = false;
      freashToken()
        .then((res) => {
          if (res.data && res.data.rows[0]) {
            const bytes = jwtDecode(res.data.rows[0].token);
            localStorage.bytes = JSON.stringify(bytes);
            localStorage.setItem('user-token', res.data.rows[0].token);
            localStorage.setItem('refreshToken', res.data.rows[0].refreshToken);
            document.cookie = `Admin-Token=${res.data.rows[0].token}`;
            localStorage.leftSeconds =
              (`${bytes.exp}000` - new Date().getTime()) / 1000;
            freashUserToken();
          }
        })
        .catch(() => {
          resetLocal();
        });
    } else {
      localStorage.leftSeconds -= 1;
    }
    if (localStorage.leftSeconds <= 1) {
      const wTTime = sessionStorage.webTitle;
      const hash = judgeTitle(wTTime);
      window.location.hash = hash[0].url;
    }
  }, 1000);
}
