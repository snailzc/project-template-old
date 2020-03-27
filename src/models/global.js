import { queryNotices } from '../services/api';


// function formateRoute(data) {
//   const DataArr = [];
//   data.map((item) => {
//     const path = item
//       .path
//       .split('/')[
//         item
//           .path
//           .split('/')
//           .length - 1
//       ];
//     const obj = item;
//     obj.children = obj.children.length
//       ? formateRoute(obj.children)
//       : [];
//     DataArr.push({ name: item.title, icon: item.icon, path, children: obj.children });
//     return '';
//   });
//   return DataArr;
// }

// function formatter(data, parentPath = '', parentAuthority) {
//   return data.map((item) => {
//     const result = {
//       ...item,
//       path: `${parentPath}${item.path}`,
//       authority: item.authority || parentAuthority,
//     };
//     if (item.children) {
//       result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
//     }
//     return result;
//   });
// }

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    menuData: [],
  },

  effects: {
    *fetchNotices(_, { call, put }) {
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: data.length,
      });
    },
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      yield put({
        type: 'user/changeNotifyCount',
        payload: count,
      });
    },
    // *fetchMenu({ payload }, { call, put }) {
    //   const response = yield call(queryMenu, payload);
    //   console.log(response, 'gff');
    //   yield put({
    //     type: 'getMenu',
    //     payload: response,
    //   });
    // },
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
    // getMenu(state, action) {
    //   return {
    //     ...state,
    //     menuData: formatter(formateRoute(action.payload)),
    //   };
    // },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
