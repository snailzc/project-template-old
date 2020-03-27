import { message } from 'antd';
import {
  getAPI,
  addAPI,
  deleteAPI,
  editAPI,
  confirmAPI,
  unconfirmAPI,
  baseInfoAPI,
  dictAPI,
  bankInfoAPI,
} from '../services/common';

export default {
  namespace: 'myCommon',
  state: {
    tableData: {
      rows: [],
      total: 0,
    },
  },

  effects: {
    *getData({ payload, uri, name = 'tableData', callback }, { call, put }) {
      const res = yield call(getAPI, payload, uri);
      if (res && res.status === 200) {
        if (callback) {
          callback(res.data);
        } else {
          yield put({
            type: 'save',
            payload: { [name]: res.data },
          });
        }
      }
    },
    /**
     * 新增
     */
    *add({ payload, uri, msg = '操作', name = '' }, { call, put }) {
      const res = yield call(addAPI, payload, uri);
      if (res && res.status === 200) {
        if (!res.rel) { // 有返回自定义异常
          message.error(`${msg}失败:${res.message}`);
        } else {
          if (name !== '') {
            yield put({
              type: 'save',
              payload: { [name]: res.data },
            });
          }
          message.success(`${msg}成功`);
        }
      } else {
        message.error(`${msg}失败`);
      }
    },
    /**
     * 删除
     */
    *delete({ payload, uri }, { call }) {
      const res = yield call(deleteAPI, payload, uri);
      if (res && res.status === 200) {
        message.success('操作成功！');
      } else {
        message.error('操作失败');
      }
    },
    /**
     * 编辑
     */
    *edit({ payload, msg = '操作', uri }, { call }) {
      const res = yield call(editAPI, payload, uri);
      if (res && res.status === 200) {
        message.success(`${msg}成功`);
      } else {
        message.error(`${msg}失败`);
      }
    },
    /**
     * 通用post方法
     * @param payload
     * @param uri
     * @param name
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
    *post({ payload, uri, name, callback }, { call, put }) {
      const res = yield call(addAPI, payload, uri);
      if (res && res.status === 200) {
        if (callback && !name) {
          callback(res.data);
        } else {
          yield put({
            type: 'save',
            payload: { [name]: res.data },
          });
        }
      }
    },
    /**
     * 通用get方法
     * @param payload
     * @param uri
     * @param name
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
    *get({ payload, uri, name, callback }, { call, put }) {
      const res = yield call(getAPI, payload, uri);
      if (res && res.status === 200) {
        if (callback && !name) {
          callback(res.data);
        } else {
          yield put({
            type: 'save',
            payload: { [name]: res.data },
          });
        }
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
