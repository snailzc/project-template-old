import { message } from 'antd';
import { getUser, getTree, getType, getUserPower, add } from '../services/data';

export default {
  namespace: 'data',

  state: {
    userList: [],
    treeList: [],
    choosedList: [],
    curType: '',
    ifEdit: false,
  },

  effects: {
    *fetchUser({ payload }, { call, put }) {
      const response = yield call(getUser, payload);
      yield put({
        type: 'user',
        payload: response.data,
      });
    },
    *fetchTree({ payload }, { call, put }) {
      const response = yield call(getTree, payload);
      yield put({
        type: 'tree',
        payload: response,
      });
    },
    *noEdit(_, { put }) {
      yield put({
        type: 'edit',
        payload: false,
      });
    },
    *fetchType({ payload }, { call, put }) {
      const response = yield call(getType, payload);
      if (response && response.data.length) {
        const type = response.data[0].dataType;
        const res = yield call(getTree, { appCode: type });
        yield put({
          type: 'tree',
          payload: res,
        });
        const re = yield call(getUserPower, payload);
        yield put({
          type: 'userPower',
          payload: re,
        });
        yield put({
          type: 'edit',
          payload: true,
        });
      }
    },
    // *fetchUserPower({ payload }, { call, put }) {

    // },
    *fetchAdd({ payload, uri }, { call }) {
      const response = yield call(add, payload, uri);
      if (response.rel) {
        message.success('保存成功');
      } else {
        message.error('保存失败');
      }
    },
  },

  reducers: {
    edit(state, action) {
      return {
        ...state,
        ifEdit: action.payload,
      };
    },
    user(state, action) {
      return {
        ...state,
        userList: action.payload,
      };
    },
    tree(state, action) {
      return {
        ...state,
        treeList: action.payload,
      };
    },
    userPower(state, action) {
      return {
        ...state,
        choosedList: action.payload,
      };
    },
  },
};
