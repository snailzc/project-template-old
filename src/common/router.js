import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import { menuList } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => namespace === model);

// wrapper of dynamic
const dynamicWrapper = (app, models, component, sys) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach((model) => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        if (sys) {
          app.model(require(`../models/${sys}/${model}`).default);
        } else {
          app.model(require(`../models/${model}`).default);
        }
      }
    });
    return (props) => {
      // 去掉路由缓存
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () => models.filter(
      model => modelNotExisted(app, model)).map((m) => {
      if (sys) {
        return import(`../models/${sys}/${m}.js`);
      } else {
        return import(`../models/${m}.js`);
      }
    }
    ),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then((raw) => {
        const Component = raw.default || raw;
        return props => createElement(Component, {
          ...props,
          routerData: routerDataCache,
        });
      });
    },
  });
};

function getFlatMenuData(menus = []) {
  let keys = {};
  menus.forEach((item) => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = (app) => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login'], () =>
        import('../layouts/BasicLayout'),
      ),
    },
    '/index': {
      code: 'index',
      component: dynamicWrapper(app, [], () =>
        import('../components/Navigation/Welcome'),
      ),
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () =>
        import('../routes/Exception/403'),
      ),
    },

    '/exception/404': {
      component: dynamicWrapper(app, [], () =>
        import('../routes/Exception/404'),
      ),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () =>
        import('../routes/Exception/500'),
      ),
    },
    '/exception/trigger': {
      component: dynamicWrapper(app, ['error'], () =>
        import('../routes/Exception/triggerException'),
      ),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },

    '/user/login': {
      component: dynamicWrapper(app, ['login'], () =>
        import('../routes/User/Login'),
      ),
    },
    '/user/resetPsd': {
      component: dynamicWrapper(app, ['login'], () =>
        import('../routes/User/ResetPassword'),
      ),
    },
    '/adminSys/resetPsd': {
      name: '修改密码',
      component: dynamicWrapper(app, ['login'], () =>
        import('../routes/User/ResetPassword'),
      ),
    },
    '/user/register': {
      component: dynamicWrapper(app, ['register'], () =>
        import('../routes/User/Register'),
      ),
    },

    // 菜单配置
    '/*/groupManager': {
      code: 'groupManager',
      name: '角色权限管理',
      component: dynamicWrapper(app, ['group'], () =>
        import('../routes/Admin/Group'),
      ),
    },
    '/*/menuManager': {
      code: 'menuManager',
      name: '菜单管理',
      component: dynamicWrapper(app, ['menu'], () =>
        import('../routes/Admin/Menus'),
      ),
    },
    '/*/dataManager': {
      name: '数据权限管理',
      code: 'dataManager',
      component: dynamicWrapper(app, ['data'], () =>
        import('../routes/Admin/DataAuth/DataAuthManager'),
      ),
    },

    // 前端工程模板示例页面 -- start
    '/*/generalList': {
      code: 'generalList',
      component: dynamicWrapper(
        app, ['myCommon'], () =>
          import('../routes/Demo/GeneralList/index'),
      ),
    },
    '/*/generalList_slide': {
      code: 'generalList_slide',
      component: dynamicWrapper(
        app, ['myCommon'], () =>
          import('../routes/Demo/GeneralList_slide/index'),
      ),
    },
    // 前端工程模板示例页面 -- end
  };

  // Get name from ./menu.js or just set it in the router data.
  // console.log(getMenuData(), 'start');
  const menuData = getFlatMenuData(menuList);
  for (const i in menuData) {
    if (
      menuData.hasOwnProperty(i) &&
      menuData[i].url &&
      menuData[i].url.search('.cpt')
    ) {
      const hashUrl = `/*/${menuData[i].code}`;
      routerConfig[hashUrl] = {
        code: menuData[i].code,
        component: dynamicWrapper(app, ['report'], () =>
          import('../routes/Report/Report'),
        ),
      };
    } else if (menuData[i].code && menuData[i].code.endsWith('DataInterface')) {
      const hashUrl = `/*/${menuData[i].code}`;
      routerConfig[hashUrl] = {
        code: menuData[i].code,
        component: dynamicWrapper(app, ['dataInterface'], () =>
          import('../routes/Admin/DataInterface/Manager')
        ),
      };
    }
  }

  const routerData = {};
  const menuDataArr = Object.keys(menuData);
  let appCode = '';
  Object.keys(routerConfig).forEach((item) => {
    let curKey = '';
    let flag = false;
    let curTitle = '';
    const menuItem = menuData[item.replace(/^\//, '')] || {};
    if (menuDataArr && menuDataArr.length) {
      menuDataArr.map((item2) => {
        if (
          menuData[item2].name === '菜单管理' &&
          !routerData[item2] &&
          routerConfig[item].code === 'menuManager'
        ) {
          curKey = `/${item2}`;
          curTitle = menuData[item2].title;
          flag = true;
          routerData[curKey] = {
            appCode: menuData[item2].appCode,
            ...routerConfig[item],
            name: routerConfig[item].name || menuItem.name || curTitle,
            authority: routerConfig[item].authority || menuItem.authority,
          };
        } else if (
          menuData[item2].name === '角色权限管理' &&
          !routerData[item2] &&
          routerConfig[item].code === 'groupManager'
        ) {
          curKey = `/${item2}`;
          curTitle = menuData[item2].title;
          flag = true;
          routerData[curKey] = {
            ...routerConfig[item],
            appCode: menuData[item2].appCode,
            name: routerConfig[item].name || menuItem.name || curTitle,
            authority: routerConfig[item].authority || menuItem.authority,
          };
        } else if (
          menuData[item2].name === '数据权限管理' &&
          !routerData[item2] &&
          routerConfig[item].code === 'dataManager'
        ) {
          curKey = `/${item2}`;
          curTitle = menuData[item2].title;
          flag = true;
          routerData[curKey] = {
            ...routerConfig[item],
            appCode: menuData[item2].appCode,
            name: routerConfig[item].name || menuItem.name || curTitle,
            authority: routerConfig[item].authority || menuItem.authority,
          };
        } else if (menuData[item2].code === routerConfig[item].code) {
          curKey = `/${item2}`.replace('//', '/');
          curTitle = menuData[item2].title;
          flag = true;
          routerData[curKey] = {
            ...routerConfig[item],
            appCode: menuData[item2].appCode,
            name: routerConfig[item].name || menuItem.name || curTitle,
            authority: routerConfig[item].authority || menuItem.authority,
          };
        } else if (
          routerConfig[item].new &&
          menuData[item2].code === routerConfig[item].new
        ) {
          const itemArr = item.split('/');
          curKey = `/${item2}/${itemArr[itemArr.length - 1]}`.replace(
            '//',
            '/',
          );
          flag = true;
          routerData[curKey] = {
            ...routerConfig[item],
            appCode: menuData[item2].appCode,
            name: routerConfig[item].name || menuItem.name || curTitle,
            authority: routerConfig[item].authority || menuItem.authority,
          };
          routerData[itemArr[itemArr.length - 1]] = curKey;
          // routerData[itemArr[itemArr.length - 1]] = {
          //   ...routerData[curKey],
          //   path: curKey,
          // };
        }
        appCode = menuData[item2].appCode;
        return '';
      });
    }

    if (!flag) {
      curKey = item.replace('//', '/');
      routerData[curKey] = {
        ...routerConfig[item],
        appCode,
        name: routerConfig[item].name || menuItem.name || curTitle,
        authority: routerConfig[item].authority || menuItem.authority,
      };
    }
  });
  localStorage.routerData = JSON.stringify(routerData);
  return routerData;
};
