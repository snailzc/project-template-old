import moment from 'moment';
import { stringify } from 'query-string';
import { routerRedux } from 'dva/router';
import { menuList } from '../common/menu';
import { fieldMapList } from './constant';

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTime() {
  const newDate = new Date();
  const hour =
    newDate.getHours() < 10 ? `0${newDate.getHours()}` : newDate.getHours();
  const minute =
    newDate.getMinutes() < 10
      ? `0${newDate.getMinutes()}`
      : newDate.getMinutes();
  const second =
    newDate.getSeconds() < 10
      ? `0${newDate.getSeconds()}`
      : newDate.getSeconds();
  return `${hour}:${minute}:${second}`;
}

export function getRandomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(
        moment(
          `${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`,
        ).valueOf() - 1000,
      ),
    ];
  }

  if (type === 'year') {
    const year = now.getFullYear();

    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
  }
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach((node) => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(num * 10 * 10 ** index) % 10] + item).replace(
      /零./,
      '',
    );
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return s
    .replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  } else if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path,
  );
  routes = routes.map(item => item.replace(path, ''));
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    let isAdd = false;
    isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  const renderRoutes = renderArr.map((item) => {
    const exact = !routes.some(
      route => route !== item && getRelation(route, item) === 1,
    );
    return {
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
      exact,
    };
  });
  return renderRoutes;
}

export function getConfigElement(pageName) {
  if (localStorage.info && localStorage.info !== 'undefined') {
    const elements = JSON.parse(localStorage.info);
    const pageElement = {};
    if (elements.status === 2100003) {
      this.resetLocal();
      window.location.reload();
    } else if (elements && !elements.elements) {
      this.resetLocal();
      window.location.reload();
    } else {
      elements.elements.forEach((item) => {
        if (item.code.split(':')[0] === pageName) {
          pageElement[item.code.split(':')[1]] = item;
        }
      });
      return pageElement;
    }
  } else {
    return {};
  }
}

export function searlizeMenu() {
  const resultMenu = [];
  const menuAll = (data) => {
    for (let i = 0; i < data.length; i += 1) {
      const node = data[i];
      resultMenu.push(node);
      if (node.children && node.children.length) {
        menuAll(node.children);
      }
    }
  };
  const localMenu = menuList;
  menuAll(localMenu);
  return resultMenu;
}

export function formatTime(time) {
  const localTime = new Date(time);
  let date = localTime.getMonth();
  date += 1;
  return `${localTime.getFullYear()}-${fixedZero(date)}-${fixedZero(
    localTime.getDate(),
  )} ${fixedZero(localTime.getHours())}:${fixedZero(
    `${localTime.getMinutes()}:${fixedZero(localTime.getSeconds())}`,
  )}`;
}

export function formatMenu(menuArr) {
  for (let i = 0; i < menuArr.length; i += 1) {
    if (menuArr[i].children) {
      format(menuArr[i].children, 0);
    }
  }

  function format(data, init) {
    const menu = data;
    data.map((item, key) => {
      if (item.children && item.children.length) {
        menu[key].keys = init;
        const next = init + 1;
        format(item.children, next);
      }
      return '';
    });
  }
}

// 存储localStorage
export function setLocalSt(key, value) {
  return localStorage.setItem(key, JSON.stringify(value));
}

// 获取存储的值
export function getLocalSt(key) {
  const value = JSON.parse(localStorage.getItem(key));
  return value;
}

export function delLocalSt(key) {
  return localStorage.removeItem(key);
}

export function getBackUrl() {
  const hash = window.location.hash.split('#')[1];
  const urlSplit = hash.split('/');
  urlSplit.pop();
  return urlSplit.join('/');
}

export function exportTableExcel(val, pageElement) {
  const searchKey = Object.keys(val);
  let searchData = '';
  searchKey.map((item) => {
    if (val[item]) {
      searchData += `&${item}=${val[item]}`;
    }
    return '';
  });
  window.open(
    `/api${pageElement.excel_down.uri}?token=${localStorage.getItem(
      'user-token',
    )}${searchData}`,
    'blank',
  );
}

// select可搜索项
export function filterOption(input, option) {
  return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}

export function filterArea(data, ifLoad) {
  const result = [];
  data.map((item) => {
    result.push({
      label: item.regionName,
      value: item.regionNum,
      isLeaf: ifLoad || false,
    });
    return '';
  });
  return result;
}

export function changeLabelValue(tree) {
  tree.map((item) => {
    item.label = item.name;
    item.value = item.id;
    if (item.children && item.children.length) {
      changeLabelValue(item.children);
    }
    return '';
  });
  return tree;
}

export function changeLabel(tree) {
  tree.map((item) => {
    item.label = item.name;
    item.value = item.path;
    if (item.children && item.children.length) {
      changeLabelValue(item.children);
    }
    return '';
  });
  return tree;
}

export function changeLabelPath(tree) {
  tree.map((item) => {
    item.label = item.name;
    item.value = item.path;
    if (item.children && item.children.length) {
      changeLabelPath(item.children);
    }
    return '';
  });
  if (tree.length === 1) {
    return tree[0].children;
  } else {
    return tree;
  }
}

export function changeLabelType(list) {
  list.map((item) => {
    if (item) {
      item.label = item.name;
      item.value = item.path;
      if (item.children && item.children.length) {
        changeLabelType(item.children);
      }
      if (item.children && item.children.length === 0) {
        delete item.children;
      }
    }
    return '';
  });
  if (list.length === 1) {
    return list[0].children;
  } else {
    return list;
  }
}

export function changeLabelArea(tree) {
  tree.map((item) => {
    item.label = item.regionName;
    item.value = item.regionNum;
    if (item.children && item.children.length) {
      changeLabelArea(item.children);
    }
    if (item.children && item.children.length === 0) {
      delete item.children;
    }
    return '';
  });
  return tree;
}

export function changeStr(str) {
  if (str) {
    return str.split('/');
  } else {
    return [];
  }
  // if (!str) {
  //   return '';
  // }
  // const strToArray = str.split('/');
  // const resultArr = [];
  // let cur = '';
  // if (strToArray.length === 1) {
  //   return [str];
  // }

  // for (let i = 0; i < strToArray.length; i += 1) {
  //   if (i === 0) {
  //     cur += strToArray[0];
  //     resultArr.push(cur);
  //   } else {
  //     resultArr.push(cur + '/' + strToArray[i]);
  //   }
  // }
  // return resultArr;
}

export function filterSample(arr) {
  const obj = {
    all: {},
    parentArr: [],
  };
  if (arr) {
    arr.map((item) => {
      if (obj.all[item.parentId]) {
        obj.all[item.parentId].push(item);
      } else if (!obj.all[item.parentId]) {
        obj.all[item.parentId] = [item];
      }
      if (item.path.split('/').length === 3) {
        obj.parentArr.push(item);
      }
      return '';
    });
  }
  return obj;
}

// 地区遍历／筛选
export function changeList(
  provinceList,
  areaList,
  marketList,
  values,
  curProvince,
  targetOption,
) {
  const province = filterArea(provinceList);
  let marketArr = [];
  let areaArr = [];

  if (marketList && marketList.length) {
    marketArr = filterArea(marketList, true);
  }
  if (areaList && areaList.length && (values.provinceName || curProvince)) {
    province.map((item, index) => {
      if (item.label === values.provinceName || item.label === curProvince) {
        // console.log(index);
        province[index].children = filterArea(areaList, true);
        targetOption.loading = false;
        areaArr = province;
      }
      return '';
    });
  } else {
    areaArr = province;
  }

  if (!values.provinceName && !curProvince) {
    marketArr = [];
  }
  return {
    marketArr,
    areaArr,
  };
}

// 过滤编辑选中项
export function filterSelectData(data, list) {
  const selectData = [];
  data.filter((item) => {
    list.map((ite) => {
      if (ite.id === item) {
        selectData.push(item);
      }
      return '';
    });
    return '';
  });
  return selectData;
}

// 业务类型bizType
export function formatBizType(text) {
  if (text === 'SALE') {
    return '销售';
  }
  if (text === 'ABLA') {
    return '断奶';
  }
  if (text === 'MATE') {
    return '配种';
  }
  if (text === 'PRENG') {
    return '妊娠';
  }
  if (text === 'CHILD') {
    return '分娩';
  }
  if (text === 'CHANGE') {
    return '转群';
  }
}

// 变动类型changeType
export function formatChangeType(text) {
  if (text === 'IN') {
    return '转入';
  }
  if (text === 'OUT') {
    return '转出';
  }
  if (text === 'SALE') {
    return '销售';
  }
  if (text === 'RETIRE') {
    return '退役';
  }
  if (text === 'DIE') {
    return '死亡';
  }
  if (text === 'DELIVERY') {
    return '进产房';
  }
}

// 状态
export function formatStatus(text) {
  if (text === 'AUDITED') {
    return '已审核';
  } else if (text === 'INIT') {
    return '初始化';
  } else {
    return '未审核';
  }
}

export function assignStatus(text) {
  if (text === '1') {
    return '已分配';
  } else {
    return '未分配';
  }
}
// 开启状态
export function formatOpenStatus(text) {
  if (text === 'OPEN') {
    return '开启';
  }
  if (text === 'CLOSED') {
    return '关闭';
  }
  if (text === 'INIT') {
    return '初始化';
  }
}

export function filterMenu(menu, code) {
  const r = [];
  menu.forEach((item) => {
    const cur = item;
    if (!item.appCode) {
      if (item.children && item.children.length) {
        const filterSon = item.children.filter((val) => {
          return code.indexOf(val.appCode) > -1 || val.appCode === 'common';
        });
        cur.children = filterSon;
        r.push(cur);
      }
    } else if (code.indexOf(item.appCode) > -1 || item.appCode === 'common') {
      r.push(item);
    }
  });

  return r;
}

// 性别
export function formatPigSex(text) {
  if (text === 'WOMAN') {
    return '母猪';
  }
  if (text === 'MAN') {
    return '公猪';
  }
}

export function formatSex(data) {
  const text = parseFloat(data);
  if (text === '0') {
    return '母猪';
  } else if (text === '1') {
    return '公猪';
  } else {
    return '';
  }
}

export function resetLocal() {
  localStorage.removeItem('user-token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('antd-pro-authority');
  localStorage.removeItem('info');
  localStorage.removeItem('menu');
  localStorage.removeItem('leftSeconds');
  localStorage.removeItem('routerData');
  localStorage.removeItem('bytes');
}

export function loopValue(v, list) {
  const arr = [];

  function format(val, data) {
    for (let i = 0; i < data.length; i += 1) {
      if (data[i].id === val) {
        arr.push(data[i]);
        return data[i];
      } else if (data[i].children && data[i].children.length) {
        format(val, data[i].children);
      }
    }
  }

  format(v, list);
  return arr;
}

// InputNumber:最小值为0，整数
export const intIN = {
  precision: 0,
  min: 0,
  // maxLength: '11',
};

// InputNumber:最小值为0，保留两位小数
export const doubleIN = {
  precision: 2,
  min: 0,
  maxLength: '11',
};

// 备注信息：长度<=150
export const noteLimit = {
  maxLength: 150,
};

// 介绍限制: 长度 <=
export const noteLimit255 = {
  maxLength: 255,
};
// 数组去重，替代Array.form();
export function uniqueArray(arr) {
  const list = [];
  for (let i = 0; i < arr.length; i += 1) {
    if (list.indexOf(arr[i]) === -1) {
      list.push(arr[i]);
    }
  }
  return list;
}

// json数组去重
export function uniqueJson(arr, key) {
  const result = [arr[0]];
  for (let i = 0; i < arr.length; i += 1) {
    const item = arr[i];
    let repeatFlag = false;
    for (let j = 0; j < result.length; j += 1) {
      if (item[key] === result[j][key]) {
        repeatFlag = true;
        break;
      }
    }
    if (!repeatFlag) {
      result.push(item);
    }
  }
  return result;
}

// 查询字段处理
export function formatSearch(params) {
  let data = '';
  for (const i in params) {
    if (i !== 'ddd' && i !== 'page' && i !== 'limit') {
      if (i && params[i]) {
        data += `&${i}=${params[i]}`;
      } else {
        data += `&${i}=`;
      }
    }
  }
  return data;
}

// 饲料调度监控的地址
export function getMonitorAddr() {
  const envir = process.env.API_ENV;
  if (envir === 'pro') {
    // 正式环境
    return 'http://10.106.10.10:8085';
  } else {
    // 测试版本
    return 'http://10.106.11.37:8085';
  }
}

// 图片标记的地址
export function getAnnotatePhotoAddr() {
  const envir = process.env.API_ENV;
  if (envir === 'pro') {
    // 正式环境
    return 'http://10.106.10.10:8080';
  } else {
    // 测试版本
    return 'http://10.106.11.37:8080';
  }
}

// 单点登录
export function FETCH_ENV() {
  const envir = process.env.API_ENV;
  if (envir === 'pro') {
    // 正式环境
    return 'https://passport.imuyuan.com/cas/login?service=';
  } else {
    // 测试版本
    return 'https://passport-test.imuyuan.com:8443/cas/login?service=';
  }
}

// 单点登出
export function FETCH_LOGOUT() {
  const envir = process.env.API_ENV;
  if (envir === 'pro') {
    // 正式环境
    return 'https://passport.imuyuan.com/cas/logout?service=';
  } else {
    // 测试版本
    return 'https://passport-test.imuyuan.com:8443/cas/logout?service=';
  }
}

export function getLocal(key) {
  return localStorage.getItem(key);
}

export function setLocal(key, value) {
  return localStorage.setItem(key, value);
}

export function removeLocal(key) {
  return localStorage.removeItem(key);
}

// 存储json数据
export function setJson(key, value) {
  return localStorage.setItem(key, JSON.stringify(value));
}

export function getJson(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function parseParam(param, key) {
  let paramStr = '';
  if (
    typeof param === 'string' ||
    typeof param === 'number' ||
    typeof param === 'boolean'
  ) {
    paramStr += `&${key}=${encodeURIComponent(param)}`;
  } else {
    Object.keys(param).forEach((i) => {
      const k =
        key == null ? i : key + (param instanceof Array ? `[${i}]` : `.${i}`);
      if (param[i] !== '' && (param[i] !== ' ' && param[i] !== undefined)) {
        paramStr += `&${parseParam(param[i] !== '' ? param[i] : '', k)}`;
      }
    });
  }
  return paramStr.substr(1);
}

export function parseElementCode(pageElement, name) {
  return pageElement && pageElement[name] ? pageElement[name].code : '';
}

// 获取地址栏参数
export function getQueryString(name) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
  const result = window.location.search.substr(1).match(reg);
  if (result != null) {
    return decodeURIComponent(result[2]);
  } else {
    return null;
  }
}

// 处理表单日期格式
export function formatSubTime(time, timeStyle) {
  const temp = timeStyle ? timeStyle : 'YYYY-MM-DD HH:mm:ss';
  return time ? moment(time).format(temp) : '';
}

// 获取资源编码url
export function parseEleUrl(pageElement, code) {
  return pageElement && pageElement[code] && pageElement[code].uri;
}

export function handleOperation(
  select,
  list,
  emptyFn,
  successFn,
  codeArr,
  ...args
) {
  if (select && select.length) {
    for (let i = 0; i < codeArr.length; i += 1) {
      const isValid = list
        .filter(item => select.indexOf(item.id) !== -1)
        .some(item => item.status && item.status.toString() === codeArr[i]);
      if (isValid) {
        args[i]();
        return false;
      }
    }
    successFn();
  } else {
    emptyFn();
  }
}

// 单项疾病审核、发布状态
export function formatDisStatus(text) {
  if (text === 1) {
    return '未审核';
  } else if (text === 2) {
    return '已审核';
  } else if (text === 3) {
    return '已发布';
  } else {
    return '';
  }
}

export function formatPublishStatus(text) {
  if (text === 3) {
    return '已发布';
  } else {
    return '未发布';
  }
}

// 去掉收尾空格 用空字符串代替
export function removeSpace(val) {
  return val && val.replace(/(^\s*)|(\s*$)/g, '');
}

// 将日期时间字符串截取，保留时间
export function dateTimeToDate(val) {
  return val ? val.split(' ')[0] : '';
}

// 猪舍全寿命计算进度条颜色
export function progressColor(progress) {
  if (isNaN(progress)) return 'blue';
  if (progress >= 60) return 'green';
  if (progress >= 30 && progress < 60) return 'yellow';
  if (progress < 30) return 'red';
}

// 处理联级区域选择
export function handleAreaInfo(arr) {
  let children = [];
  const newArr = [];
  const testArr = arr.concat({});
  for (let i = 0; i < arr.length; i += 1) {
    if (testArr[i].FAreaID !== testArr[i + 1].FAreaID) {
      children.push({ value: testArr[i].FAreaID, label: testArr[i].FAreaName });
      if (testArr[i].FProID !== testArr[i + 1].FProID) {
        newArr.push({
          value: testArr[i].FProID,
          label: testArr[i].FProName,
          children,
        });
        children = [];
      }
    }
  }
  return newArr;
}

// 通过areaId,查找相关provinceId
export function getProId(areaId, data) {
  const arr = [];
  for (let i = 0; i < data.length; i += 1) {
    const children = JSON.stringify(data[i].children);
    if (children.includes(areaId)) {
      arr.push(data[i].value, areaId.toString());
      return arr;
    }
  }
}

// 品控格式化表格数据
export function formatIsExist(val) {
  if (val === 1) {
    return '是';
  } else {
    return '否';
  }
}

// 用于判断数组中所有对象中的某个参数是否等于某个值
export function parameterRegular(arr, parameter, value) {
  let regular = true;
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i][parameter] === value) {
      regular = false;
      break;
    }
  }
  return regular;
}
// 格式化单元字段显示
export function formatUnits(val) {
  // 替换汉字
  let tmp = val.replace(new RegExp('第', 'g'), '').replace(new RegExp('单元', 'g'), '');
  // 替换空;
  tmp = tmp.split(';').filter(item => item).join(';');
  return tmp.length > 0 ? `${tmp};` : '';
}

export function getCurrentMenuId() {
  const menus = menuList;
  const tempArray = localStorage.menuKey.split('/');
  const code = tempArray[tempArray.length - 1];
  const jsonMenu = JSON.parse(menus);
  return findMenuId(jsonMenu, code);
}

function findMenuId(menus, code) {
  let menuId = '';
  for (let i = 0; i < menus.length; i += 1) {
    const item = menus[i];
    if (item.code === code) {
      menuId = item.id;
      break;
    } else if (item.children.length > 0) {
      menuId = findMenuId(item.children, code);
      if (menuId !== '') {
        break;
      }
    }
  }
  return menuId;
}

// 导出表格
export function exportTable(uri, params) {
  return `api${uri}?token=${localStorage.getItem('user-token')}&${stringify(
    params,
  )}`;
}

// 格式化金钱
export function formatMoney(money) {
  if (money && money != null) {
    money = String(money);
    const left = money.split('.')[0];
    let right = money.split('.')[1];
    right = right ? (right.length >= 2 ? `.${right.substr(0, 2)}` : `.${right}0`) : '.00';
    const temp = left.split('').reverse().join('').match(/(\d{1,3})/g);
    return (Number(money) < 0 ? '-' : '') + temp.join(',').split('').reverse().join('') + right;
  } else if (money === 0) { // 注意===在这里的使用，如果传入的money为0,if中会将其判定为boolean类型，故而要另外做===判断
    return '0.00';
  } else {
    return '';
  }
}

// 格式化数字, 加逗号分隔，整数删除.00
export function formatNumber(val) {
  const str = '.00';
  const rtl = formatMoney(val);
  return rtl.endsWith(str) ? rtl.replace(str, '') : rtl;
}

// 获取默认搜索条件
export function getDefaultCondition(key) {
  const conditions = JSON.parse(localStorage.defaultConditions);
  const tempKey = fieldMapList.find(it => it.name === key).key;
  const temp = conditions.default[tempKey];
  return temp || '';
}

// 获取饲料厂搜索条件
export function getSlcCondition(key) {
  const conditions = JSON.parse(localStorage.defaultConditions);
  const tempKey = fieldMapList.find(it => it.name === key).key;
  const temp = conditions.slc[tempKey];
  return temp || '';
}

export function unitFormatter(str) {
  const arr = [];
  let i = 0;
  while (i < str.length) {
    var s = '';
    while (str.charCodeAt(i) < 256) {
      s += str.charAt(i);
      i++;
    }
    arr.push(s);
    var s = '';
    while (str.charCodeAt(i) > 256) {
      s += str.charAt(i);
      i++;
    }
    arr.push(s);
  }
  const res = Number(arr[0]) + arr[1];
  return res;
}

// 小数与百分比转换
export function percentConvert(val, submit, text) {
  if (!val || val === null) {
    return '';
  }
  if (submit) { // 向后台提交
    return val && (parseFloat(val) / 100);
  } else {
    let temp = val && (val * 100).toFixed(2);
    if (text) {
      temp += text;
    }
    return temp;
  }
}

export function getMenuName(pageElement) {
  if (!pageElement) return '';
  const keys = Object.keys(pageElement);
  for (let i = 0; i < keys.length; i += 1) {
    if (pageElement[keys[i]].menuName !== '') {
      return pageElement[keys[i]].menuName;
    }
  }
  return '';
}

// 页面跳转
export function pushPage(context, pageCode, data) {
  const routerData = JSON.parse(localStorage.routerData);
  const path = {
    pathname: routerData[pageCode],
    state: data,
  };
  context.props.dispatch(routerRedux.push(path));
}

// 去除对象空属性
export function removeObjEmptyProps(obj) {
  if (obj === null) return {};
  const val = {};
  Object.keys(obj).filter(key => obj[key] !== null).forEach((key) => {
    val[key] = obj[key];
  });
  return val;
}

export function splitArray(array, size) {
  // 获取数组的长度，如果你传入的不是数组，那么获取到的就是undefined
  const { length } = array;
  // 判断不是数组，或者size没有设置，size小于1，就返回空数组
  if (!length || !size || size < 1) {
    return [];
  }
  // 核心部分
  let index = 0;// 用来表示切割元素的范围start
  let resIndex = 0;// 用来递增表示输出数组的下标

  // 根据length和size算出输出数组的长度，并且创建它。
  const result = new Array(Math.ceil(length / size));
  // 进行循环
  while (index < length) {
    // 循环过程中设置result[0]和result[1]的值。该值根据array.slice切割得到。
    result[resIndex] = array.slice(index, (index += size));
    resIndex += 1;
  }
  // 输出新数组
  return result;
}

/**
 * 检查账号是否为运维账号
 * @returns {boolean}
 */
export function isYwAccount() {
  let rtl = false;
  if (localStorage.info && localStorage.info !== 'undefined') {
    const info = JSON.parse(localStorage.info);
    rtl = info.username.startsWith('yw');
  }
  return rtl;
}
