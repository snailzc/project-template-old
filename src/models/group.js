import { message } from 'antd';
import {
  querGroupList,
  deleteGroup,
  updateGroupInfo,
  deleteUserConnect,
  queryGroupTypeAll,
  queryTypeById,
  queryRoleById,
  updateGroup,
  deleteGroupRole,
  querySearchUser,
  updateUserConnect,
  queryPowerMenu,
  queryPowerElements,
  queryPowerMenuChoose,
  updatePowerMenu,
  moveMenuElement,
  addMenuElement,
  queryMenuElementChoose,
  addGroupRole,
  queryRoleUser,
  updateElement,
} from '../services/group';
import { resetLocal } from '../utils/utils';

export default {
  namespace: 'group',

  state: {
    groupList: [],
    typeAllList: [],
    typeList: [],
    roleIdData: {},
    connectUserList: {},
    searchUserList: [],
    allUserList: {
      total: 0,
      rows: [],
    },
    searchPowerListChoose: [],
    powerElementsList: [],
    searchPowerList: [],
    choosedMenuElementArr: [],
    userLeader: {
      total: 0,
      rows: [],
    },
    userMember: {
      total: 0,
      rows: [],
    },
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(querGroupList, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *deleteGroup({ payload }, { call, put }) {
      const response = yield call(deleteGroup, payload);
      if (response.rel === true) {
        message.success('删除成功');
        const res = yield call(querGroupList, { page: 1, limit: 20 });
        yield put({
          type: 'save',
          payload: res.data,
        });
      } else {
        message.error('删除失败');
      }
    },
    *updateGroup({ payload }, { call, put }) {
      const response = yield call(updateGroupInfo, payload);
      if (response.rel === true) {
        message.success('更新成功');
        const res = yield call(querGroupList, { page: 1, limit: 20 });
        yield put({
          type: 'save',
          payload: res.data,
        });
      } else {
        message.error('更新失败');
      }
    },
    *updateElement({ payload }, { call }) {
      const response = yield call(updateElement, payload);
      if (response.rel === true) {
        message.success('更新成功');
      } else {
        message.error('更新失败');
      }
    },
    *deleteConnectUser({ payload }, { call, put }) {
      const response = yield call(deleteUserConnect, payload);
      if (response.rel === true) {
        message.success('删除成功');
        // 重新获取当前角色的数据

        const memberRes = yield call(queryRoleUser, { groupId: payload.id, keyword: '', limit: 20, page: 1, type: 1 });
        yield put({
          type: 'userMembers',
          payload: memberRes.data,
        });

        // freash notLinkted User
        const notLinkUser = yield call(querySearchUser, { id: payload.id, name: '', limit: 20, page: 1 });
        yield put({
          type: 'searchUserAll',
          payload: notLinkUser,
        });
      } else {
        message.error('删除失败');
      }
    },
    *updateConnectUser({ payload }, { call, put }) {
      const response = yield call(updateUserConnect, payload);
      if (response.rel === true) {
        message.success('更新成功');
        // 重新获取当前角色的数据

        const memberRes = yield call(queryRoleUser, {
          groupId: payload.id,
          keyword: '',
          limit: 20,
          page: 1,
          type: 1 });
        yield put({
          type: 'userMembers',
          payload: memberRes.data,
        });

        // freash notLinkted User
        const notLinkUser = yield call(querySearchUser, { id: payload.id,
          name: '',
          limit: 20,
          page: 1 });
        yield put({
          type: 'searchUserAll',
          payload: notLinkUser,
        });
      } else {
        message.error('更新失败');
      }
    },
    *updatePowerMenu({ payload }, { call }) {
      const response = yield call(updatePowerMenu, payload);
      if (response.rel === true) {
        message.success('更新成功');
      } else {
        message.error('更新失败');
      }
    },
    *removeMenuElement({ payload }, { call }) {
      const response = yield call(moveMenuElement, payload);
      if (response.rel === true) {
        message.success('移除成功');
      } else {
        message.error('移除失败');
      }
    },
    *addMenuElement({ payload }, { call }) {
      const response = yield call(addMenuElement, payload);
      if (response.rel === true) {
        message.success('新增成功');
      } else {
        message.error('新增失败');
      }
    },
    *fetchChoosedMenuElement({ payload }, { call, put }) {
      const response = yield call(queryMenuElementChoose, payload);
      yield put({
        type: 'choosedMenuElement',
        payload: response,
      });
    },
    *fetchTypeAll({ payload }, { call, put }) {
      const response = yield call(queryGroupTypeAll, payload);
      yield put({
        type: 'typeAll',
        payload: response,
      });
      if (response && response[0]) {
        const res = yield call(queryTypeById, { id: response[0].id });
        localStorage.currentKey = response[0].id;
        yield put({
          type: 'typeByIdList',
          payload: res,
        });
      } else {
        resetLocal();
        window.location.reload();
      }
    },
    *fetchTypeById({ payload }, { call, put }) {
      const response = yield call(queryTypeById, payload);
      yield put({
        type: 'typeByIdList',
        payload: response,
      });
    },
    *fetchRoleId({ payload }, { call, put }) {
      const response = yield call(queryRoleById, payload);
      localStorage.curType = response.data.type ? response.data.type : '';
      yield put({
        type: 'roleById',
        payload: response.data,
      });
    },
    *fetchPutGroup({ payload }, { call, put }) {
      const response = yield call(updateGroup, payload);
      if (response.rel === true) {
        message.success('更新成功');
        const key = localStorage.currentKey ? localStorage.currentKey : '1';
        const res = yield call(queryTypeById, { id: key });
        yield put({
          type: 'typeByIdList',
          payload: res,
        });
      } else {
        message.error('更新失败');
      }
    },
    *fetchDeleteRole({ payload }, { call, put }) {
      const response = yield call(deleteGroupRole, payload);
      if (response.rel === true) {
        message.success('删除成功');
        const key = localStorage.currentKey ? localStorage.currentKey : '1';
        const res = yield call(queryTypeById, { id: key });
        yield put({
          type: 'typeByIdList',
          payload: res,
        });
      } else {
        message.error('删除失败');
      }
    },
    *fetchAddRole({ payload }, { call, put }) {
      const response = yield call(addGroupRole, payload);
      if (response.rel === true) {
        message.success('增加成功');
        const key = localStorage.currentKey ? localStorage.currentKey : '1';
        const res = yield call(queryTypeById, { id: key });
        yield put({
          type: 'typeByIdList',
          payload: res,
        });
      } else {
        message.error('增加失败');
      }
    },

    *fetchConnectUserLeaders({ payload }, { call, put }) {
      const response = yield call(queryRoleUser, payload);
      yield put({
        type: 'userLeaders',
        payload: response.data,
      });
    },
    // new
    *fetchConnectUserMembers({ payload }, { call, put }) {
      const response = yield call(queryRoleUser, payload);
      yield put({
        type: 'userMembers',
        payload: response.data,
      });
    },
    *fetchSearchUser({ payload }, { call, put }) {
      const response = yield call(querySearchUser, payload);
      yield put({
        type: 'searchUser',
        payload: response.data.rows,
      });
    },
    *fetchUser({ payload }, { call, put }) {
      const response = yield call(querySearchUser, payload);
      yield put({
        type: 'searchUserAll',
        payload: response,
      });
    },
    *fetchPowerMenu({ payload }, { call, put }) {
      const response = yield call(queryPowerMenu, payload);

      if (response && response.length) {
        yield put({
          type: 'searchPowerMenu',
          payload: response,
        });
      }
    },
    *fetchPowerMenuChoose({ payload }, { call, put }) {
      const response = yield call(queryPowerMenuChoose, payload);
      // console.log(response, '获取选中菜单');
      const res = response.data;
      const result = [];
      res.forEach((item) => {
        result.push(`${item.id}`);
      });

      yield put({
        type: 'searchPowerMenuChoose',
        payload: result,
      });
    },
    *fetchElementList({ payload }, { call, put }) {
      const response = yield call(queryPowerElements, payload);
      yield put({
        type: 'powerElements',
        payload: response.data,
      });
    },
    *emptyRoleIdData(_, { put }) {
      yield put({
        type: 'empty',
      });
    },
    *emptyElementData(_, { put }) {
      yield put({
        type: 'emptyElement',
      });
    },
  },

  reducers: {
    empty(state) {
      return {
        ...state,
        roleIdData: [],
      };
    },
    save(state, action) {
      return {
        ...state,
        groupList: action.payload,
      };
    },
    choosedMenuElement(state, action) {
      return {
        ...state,
        choosedMenuElementArr: action.payload.data,
      };
    },
    typeAll(state, action) {
      return {
        ...state,
        typeAllList: action.payload,
      };
    },
    typeByIdList(state, action) {
      return {
        ...state,
        typeList: action.payload,
      };
    },
    roleById(state, action) {
      return {
        ...state,
        roleIdData: action.payload,
      };
    },
    connectUser(state, action) {
      return {
        ...state,
        connectUserList: action.payload,
      };
    },
    userLeaders(state, action) {
      return {
        ...state,
        userLeader: action.payload,
      };
    },
    userMembers(state, action) {
      return {
        ...state,
        userMember: action.payload,
      };
    },
    searchUser(state, action) {
      return {
        ...state,
        searchUserList: action.payload,
      };
    },
    searchUserAll(state, action) {
      return {
        ...state,
        allUserList: action.payload.data,
      };
    },
    searchPowerMenuChoose(state, action) {
      return {
        ...state,
        searchPowerListChoose: action.payload,
      };
    },
    searchPowerMenu(state, action) {
      return {
        ...state,
        searchPowerList: action.payload,
      };
    },
    powerElements(state, action) {
      return {
        ...state,
        powerElementsList: action.payload,
      };
    },
    emptyElement(state) {
      return {
        ...state,
        powerElementsList: { rows: [] },
      };
    },
  },
};
