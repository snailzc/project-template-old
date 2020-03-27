import { message, Modal, Input } from 'antd';
import {
  queryMenuTree, queryMenuId, putMenu, deleteMenu,
  queryAddMenu, queryResourceList, deleteElement,
  addElement, putElement,
} from '../services/api';

const { TextArea } = Input;

function info(val) {
  Modal.info({
    title: '请复制下面的SQL语句',
    content: (
      <div>
        <TextArea defaultValue={val} autosize={{ minRows: 2, maxRows: 6 }} />
      </div>
    ),
  });
}

export default {
  namespace: 'menu',

  state: {
    treeMenu: [],
    menuIdData: {
      code: '',
      title: '',
      parentId: '',
      icon: '',
      href: '',
      type: '',
      orderNum: '',
      description: '',
      attr1: '',
    },
    resourceList: {
      total: 0,
      rows: [],
    },
    ifClose: true,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryMenuTree, payload);
      localStorage.curTree = JSON.stringify(response);
      yield put({
        type: 'getMenu',
        payload: response,
      });
    },
    *fetchMenuId({ payload }, { call, put }) {
      const response = yield call(queryMenuId, payload);
      yield put({
        type: 'getMenuId',
        payload: response.data,
      });
    },
    *fetchPutMenu({ payload, uri }, { call, put }) {
      const response = yield call(putMenu, payload, uri);
      if (response.rel === true) {
        message.success('更新成功');
        const res = yield call(queryMenuTree);
        localStorage.curTree = JSON.stringify(res);
        yield put({
          type: 'getMenu',
          payload: res,
        });
      } else {
        message.error('更新失败');
      }
      yield put({
        type: 'putMenuId',
        payload: response.data,
      });
    },
    *fetchDeleteMenu({ payload, uri }, { call, put }) {
      const response = yield call(deleteMenu, payload, uri);
      if (response.rel === true) {
        message.success('删除成功');
        const res = yield call(queryMenuTree);
        localStorage.curTree = JSON.stringify(res);
        yield put({
          type: 'getMenu',
          payload: res,
        });
      } else {
        message.error('删除失败');
      }
    },
    *emptyMenuId({ payload }, { put }) {
      yield put({
        type: 'menuEmpty',
        payload,
      });
    },
    *addMenu({ payload, uri }, { call, put }) {
      const response = yield call(queryAddMenu, payload, uri);
      if (response.rel === true) {
        message.success('添加成功');
        info(response.data);
        const res = yield call(queryMenuTree);
        localStorage.curTree = JSON.stringify(res);
        yield put({
          type: 'getMenu',
          payload: res,
        });
      } else {
        message.error('添加失败');
      }
    },
    *queryResourceList({ payload }, { call, put }) {
      const response = yield call(queryResourceList, payload);
      yield put({
        type: 'getResourceList',
        payload: response.data,
      });
    },
    *deleteElementById({ payload, uri }, { call, put }) {
      const response = yield call(deleteElement, payload, uri);
      if (response.rel === true) {
        message.success('删除成功');
        const res = yield call(queryResourceList, payload);
        yield put({
          type: 'getResourceList',
          payload: res.data,
        });
      } else {
        message.error('删除失败');
      }
    },
    *putElementById({ payload, uri }, { call, put }) {
      const data = payload;
      const response = yield call(putElement, payload, uri);
      if (response.rel === true) {
        message.success('更新成功');
        delete data.name;
        const res = yield call(queryResourceList, { ...data, page: 1, limit: 20 });
        yield put({
          type: 'getResourceList',
          payload: res.data,
        });
      } else {
        message.error('更新失败');
      }
    },
    *addElementById({ payload, uri }, { call, put }) {
      const data = payload;
      const response = yield call(addElement, payload, uri);
      if (response.rel === true) {
        info(response.data);
        message.success('添加成功');
        delete data.name;
        yield put({
          type: 'closeModal',
          payload: true,
        });
        const res = yield call(queryResourceList, { ...data, page: 1, limit: 20 });
        yield put({
          type: 'getResourceList',
          payload: res.data,
        });
      } else {
        message.error('添加失败');
        yield put({
          type: 'closeModal',
          payload: false,
        });
      }
    },
    *emptyMenuIdData(_, { put }) {
      yield put({
        type: 'empty',
      });
    },
  },

  reducers: {
    empty(state) {
      return {
        ...state,
        menuIdData: {
          code: '',
          title: '',
          parentId: '',
          icon: '',
          href: '',
          type: '',
          orderNum: '',
          description: '',
          attr1: '',
        },
      };
    },
    getMenu(state, action) {
      return {
        ...state,
        treeMenu: action.payload,
      };
    },
    getMenuId(state, action) {
      return {
        ...state,
        menuIdData: action.payload,
      };
    },
    putMenuId(state) {
      return {
        ...state,
      };
    },
    menuEmpty(state, action) {
      return {
        ...state,
        menuIdData: {
          attr1: '',
          code: '',
          description: '',
          href: '',
          icon: '',
          id: '',
          menuType: '',
          orderNum: '',
          path: '',
          status: '',
          title: '',
          type: '',
          updHost: '',
          updName: '',
          updTime: '',
          updUser: '',
          parentId: action.payload.id,
        },
      };
    },
    getResourceList(state, action) {
      return {
        ...state,
        resourceList: action.payload,
      };
    },
    closeModal(state, action) {
      return {
        ...state,
        ifClose: action.payload,
      };
    },
  },
};
