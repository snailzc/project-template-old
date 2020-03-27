import { message } from 'antd';
import { codeAPI, registerAPI, validateCode } from '../services/api';

export default {
  namespace: 'register',

  state: {
    status: undefined,
    ifCode: false,
    ifValidate: false,
  },

  effects: {
    *getCode({ payload }, { call, put }) {
      const response = yield call(codeAPI, payload);
      if (response) {
        yield put({
          type: 'code',
          payload: response,
        });
      }
    },
    *submit({ payload }, { call }) {
      const response = yield call(registerAPI, payload);
      if (response && response.rel === true) {
        message.success('您已注册成功，即将跳转至登录页', 3, () => {
          window.location.href = '#/user/pigLogin';
        });
      }
    },
    *validate({ payload }, { call, put }) {
      const res = yield call(validateCode, payload);
      if (res) {
        yield put({
          type: 'vCode',
          payload: true,
        });
      }
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      return {
        ...state,
        status: payload.status,
      };
    },
    code(state, action) {
      return {
        ...state,
        ifCode: action.payload,
      };
    },
    vCode(state, action) {
      return {
        ...state,
        ifValidate: action.payload,
      };
    },
  },
};
