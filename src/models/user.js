import { message } from 'antd';
import { queryCurrent, queryUserList, addUser, updateUser, deleteUser, updatePsd } from '../services/user';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    userList: [],
    page: 0,
    limit: 20,
  },

  effects: {
    // *fetch(_, { call, put }) {
    //   const response = yield call(queryUsers);
    //   yield put({
    //     type: 'save',
    //     payload: response,
    //   });
    // },
    *fetchCurrent(_, { call, put }) {
      if (!localStorage.info) {
        const response = yield call(queryCurrent);
        localStorage.info = JSON.stringify(response);
      }
      yield put({
        type: 'saveCurrentUser',
        payload: JSON.parse(localStorage.info),
      });
    },
    *fetchUserList({ payload }, { call, put }) {
      const response = yield call(queryUserList, payload);
      yield put({
        type: 'userSave',
        payload: response.data,
      });
    },
    *addUser({ payload, uri }, { call, put }) {
      const data = payload;
      delete data.type;
      delete data.accountType;
      const response = yield call(addUser, data, uri);
      if (response.rel === true) {
        message.success('添加成功');
        const res = yield call(queryUserList, { page: 1, limit: 20, name: '' });
        yield put({
          type: 'userSave',
          payload: res.data,
        });
      } else {
        message.error('添加失败');
      }
    },
    *updateUser({ payload, uri }, { call, put }) {
      const response = yield call(updateUser, payload, uri);
      if (response.rel === true) {
        message.success('更新成功');
        const res = yield call(queryUserList, { page: 1, limit: 20, name: '' });
        yield put({
          type: 'userSave',
          payload: res.data,
        });
      } else {
        message.error('更新失败');
      }
    },
    *deleteUser({ payload, uri }, { call, put }) {
      const response = yield call(deleteUser, payload, uri);
      if (response.rel === true) {
        message.success('删除成功');
        const res = yield call(queryUserList, { page: 1, limit: 20, name: '' });
        yield put({
          type: 'userSave',
          payload: res.data,
        });
      } else {
        message.error('删除失败');
      }
    },
    *updatePsd({ payload, uri }, { call, put }) {
      const response = yield call(updatePsd, payload, uri);
      if (response.rel === true) {
        message.success('修改成功');
        const res = yield call(queryUserList, { page: 1, limit: 20, name: '' });
        yield put({
          type: 'userSave',
          payload: res.data,
        });
      } else {
        message.error('修改失败');
      }
    },
  },

  reducers: {
    // save(state, action) {
    //   return {
    //     ...state,
    //     list: action.payload,
    //   };
    // },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
    userSave(state, action) {
      return {
        ...state,
        userList: action.payload,
      };
    },
  },
};
