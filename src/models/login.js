import jwtDecode from 'jwt-decode';
import { message } from 'antd';
import {
  fakeAccountLogin,
  loginOut,
  queryMenu,
  getUrl,
  sendCode,
  getUserId,
  validCode,
  resetPsd,
  getCountOut,
  getCountInner,
  onlineUser,
  getPhoneOut,
  getPhoneCode,
  buildWechatInfo,
} from '../services/api';
import { setAuthority } from '../utils/authority';
import { setToken } from '../utils/usertoken';
import { judgeTitle } from '../common/menu';
import {
  resetLocal,
  FETCH_LOGOUT,
} from '../utils/utils';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    countList: [],
    poneList: [],
  },

  effects: {
    *login({ payload }, { call, put }) {
      const postData = payload;
      delete postData.type;
      const response = yield call(fakeAccountLogin, postData);

      if (response) {
        localStorage.refreshToken = response.data.rows[0].refreshToken;
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: 'ok',
            currentAuthority: 'admin',
            token: response.data.rows[0].token,
          },
        });
      }
    },
    *logout({ payload }, { call, put }) {
      yield call(loginOut, payload);
      localStorage.farmId = '';
      localStorage.farmName = '';
      resetLocal();
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
          token: '',
        },
      });
      const ifLogout = localStorage.ifPigLogout;
      const envir = process.env.API_ENV;
      if (
        ifLogout &&
        ifLogout === 'true' &&
        sessionStorage.webTitle &&
        sessionStorage.webTitle === '牧原养猪管理平台' &&
        envir !== 'local'
      ) {
        const logoutUrl = FETCH_LOGOUT();
        const curUrl = encodeURIComponent(window.location.href);
        window.location.href = `${logoutUrl}${curUrl}`;
        localStorage.ifPigLogout = false;
      } else {
        window.location.reload();
      }
    },
    *getWechat({ payload }, { call }) {
      const response = yield call(getUrl, payload);
    },
    *queryCountOut({ payload }, { call, put }) {
      const response = yield call(getCountOut, payload);
      if (response) {
        yield put({
          type: 'getCount',
          payload: response,
        });
      }
    },

    *queryPhone({ payload }, { call, put }) {
      const res = yield call(getPhoneOut, payload);
      if (res) {
        yield put({
          type: 'getPhone',
          payload: res,
        });
      }
    },

    *queryPhoneCode({ payload }, { call }) {
      const res = yield call(getPhoneCode, payload);
      if (res) {
        message.success('发送成功');
      } else {
        message.error('发送失败，请检查填写的信息');
      }
    },

    *queryCountInner({ payload }, { call, put }) {
      const response = yield call(getCountInner, payload);
      if (response) {
        yield put({
          type: 'getCount',
          payload: response,
        });
      }
    },
    *sendCode({ payload }, { call }) {
      const response = yield call(sendCode, payload);
      if (response && response.rel) {
        message.success('发送成功');
      } else {
        message.error('发送失败，请检查填写的信息');
      }
    },
    *validCode({ payload }, { call }) {
      const response = yield call(validCode, payload);
      if (response && response.rel) {
        message.success('校验成功');
      } else {
        message.error('校验失败，请检查填写的信息');
      }
    },
    *resetPsd({ payload }, { call }) {
      const response = yield call(resetPsd, payload);
      if (response && response.rel) {
        message.success('修改成功,请重新登录');
        resetLocal();
        const timeWT = sessionStorage.webTitle;
        const hash = judgeTitle(timeWT);
        setTimeout(() => {
          window.location.href = hash[0].url;
        }, 800);
      } else {
        message.error('修改失败，请再次尝试');
      }
    },
    *onlineUser(_, { call }) {
      const response = yield call(onlineUser);
      if (response && response.data) {
        localStorage.online = response.data;
      } else {
        localStorage.online = 0;
      }
    },
    *getUserIds({ payload }, { call, put }) {
      const response = yield call(getUserId, payload);
      localStorage.refreshToken = response.data.rows[0].refreshToken;
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: 'ok',
          currentAuthority: 'admin',
          token: response.data.rows[0].token,
        },
      });
    },
    *buildWechatInfo({ payload, callback }, { call }) {
      const res = yield call(buildWechatInfo, payload);
      if (res && res.status === 200 && callback) {
        callback(res.data);
      }
    },
  },
  reducers: {
    getCount(state, action) {
      return {
        ...state,
        countList: action.payload,
      };
    },

    getPhone(state, action) {
      return {
        ...state,
        poneList: action.payload,
      };
    },

    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      setToken(payload.token);
      // document.cookie = `Admin-Token=${payload.token}` const token = payload.token;
      // localStorage.de = CryptoJS.AES.decrypt(token); Login successfully

      if (payload.token) {
        const bytes = jwtDecode(payload.token);
        localStorage.bytes = JSON.stringify(bytes);
        queryMenu(payload.token).then((res) => {
          if (res) {
            window.location.reload();
          }
        });
      }
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
