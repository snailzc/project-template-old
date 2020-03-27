import { listAPI, listGroupAPI, listUserAPI } from '../services/dataInterface';

export default {
  namespace: 'dataInterface',

  state: {
    dataList: {
      total: 0,
      rows: [],
    },
    initData: {
      page: 1,
      limit: 20,
    },
    listRows: [],
    pagination: {
      current: 1,
      pageSize: 20,
    },
    values: {
      data: {
      },
      status: 'add',
    },
    groupList: [],
    userList: [],
  },

  effects: {
    *fetch({ payload, pageElement }, { call, put }) {
      const response = yield call(listAPI, payload, pageElement);
      if (response && response.data) {
        yield put({
          type: 'dataList',
          payload: response.data,
        });
      }
    },
    *fetchGroup({ payload, pageElement }, { call, put }) {
      const response = yield call(listGroupAPI, payload, pageElement);
      if (response && response.data) {
        yield put({
          type: 'groupList',
          payload: response.data,
        });
      }
    },
    *fetchUser({ payload, pageElement }, { call, put }) {
      const response = yield call(listUserAPI, payload, pageElement);
      if (response && response.data) {
        yield put({
          type: 'userList',
          payload: response.data,
        });
      }
    },
  },

  reducers: {
    dataList(state, action) {
      return {
        ...state,
        dataList: action.payload,
      };
    },
    listRows(state, action) {
      return {
        ...state,
        listRows: action.payload,
      };
    },
    filterRows(state, action) {
      const data = action.payload;
      const removeIds = data.id.split(',');
      return {
        ...state,
        listRows: data.oldData.filter(
          item => removeIds.indexOf(item.id) === -1,
        ),
      };
    },
    updateRows(state, action) {
      const data = action.payload;
      const listData = data.oldData.filter(item => item.id !== data.id);
      return {
        ...state,
        listRows: [...listData, data.updateData],
      };
    },
    pagination(state, action) {
      return {
        ...state,
        pagination: action.payload,
      };
    },
    curValues(state, action) {
      return {
        ...state,
        values: action.payload,
      };
    },
    groupList(state, action) {
      return {
        ...state,
        groupList: action.payload,
      };
    },
    userList(state, action) {
      return {
        ...state,
        userList: action.payload,
      };
    },
  },
};
