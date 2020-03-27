import React, { PureComponent } from 'react';
import { Layout, Menu, Icon } from 'antd';
import Debounce from 'lodash-decorators/debounce';
import { Link } from 'dva/router';
import styles from './index.less';
import { formatMenu, isYwAccount, searlizeMenu } from '../../utils/utils';

const { Sider } = Layout;
const { SubMenu } = Menu;

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
const getIcon = (icon) => {
  if (typeof icon === 'string' && icon.indexOf('http') === 0) {
    return <img src={icon} alt="icon" className={styles.icon} />;
  }
  if (typeof icon === 'string') {
    return <Icon type={icon} />;
  }
  return icon;
};

const resultMenu = searlizeMenu();
const ywAccount = isYwAccount();
export default class SiderMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.menus = props.menuData;
    this.state = {
      openKeys: this.getDefaultCollapsedSubMenus(props),
      width: 240,
      show: false,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      this.setState({
        openKeys: this.getDefaultCollapsedSubMenus(nextProps),
      });
    }
  }
  getDefaultCollapsedSubMenus(props) {
    const { location: { pathname } } = props || this.props;
    const snippets = pathname.split('/').slice(1, -1);
    const currentPathSnippets = snippets.map((item, index) => {
      const arr = snippets.filter((_, i) => i <= index);
      return arr.join('/');
    });
    let currentMenuSelectedKeys = [];
    currentPathSnippets.forEach((item) => {
      currentMenuSelectedKeys = currentMenuSelectedKeys.concat(this.getSelectedMenuKeys(item));
    });
    if (currentMenuSelectedKeys.length === 0) {
      return this.menus.length ? [this.menus[0].path] : '';
    }
    return currentMenuSelectedKeys;
  }
  getFlatMenuKeys(menus) {
    let keys = [];
    menus.forEach((item) => {
      if (item.children) {
        keys.push(item.path);
        keys = keys.concat(this.getFlatMenuKeys(item.children));
      } else {
        keys.push(item.path);
      }
    });
    return keys;
  }
  getSelectedMenuKeys = (path) => {
    const flatMenuKeys = this.getFlatMenuKeys(this.menus);
    if (flatMenuKeys.indexOf(path.replace(/^\//, '')) > -1) {
      return [path.replace(/^\//, '')];
    }
    if (flatMenuKeys.indexOf(path.replace(/^\//, '').replace(/\/$/, '')) > -1) {
      return [path.replace(/^\//, '').replace(/\/$/, '')];
    }
    return flatMenuKeys.filter((item) => {
      const itemRegExpStr = `^${item.replace(/:[\w-]+/g, '[\\w-]+')}$`;
      const itemRegExp = new RegExp(itemRegExpStr);
      return itemRegExp.test(path.replace(/^\//, '').replace(/\/$/, ''));
    });
  }
  /**
  * 判断是否是http链接.返回 Link 或 a
  * Judge whether it is http link.return a or Link
  * @memberof SiderMenu
  */
  getMenuItemPath = (item) => {
    const itemPath = this.conversionPath(item.path);
    const icon = getIcon(item.icon);
    const { target, name } = item;
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          {icon}<span>{name}</span>
          <Icon type="double-right" />
        </a>
      );
    }
    return (
      <Link
        to={itemPath}
        target={target}
        replace={itemPath === this.props.location.pathname}
        onClick={this.props.isMobile ? () => { this.props.onCollapse(true); } : undefined}
      >
        <Icon type="double-right" />
        {icon}<span>{name}</span>
      </Link>
    );
  }


  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem=(item) => {
    // code -> evpDataInterface , href -> evp
    //  根据数据接口菜单的特征，特殊处理 数据接口 菜单，不再展示下级
    if (item.code.endsWith('DataInterface')) {
      /*return (
        <Menu.Item key={item.key || item.path} className="lastNodeClass">
          {this.getMenuItemPath(item)}
        </Menu.Item>
      );*/
      return null;
    }
    if (item.children && item.children.some(child => child.name) && (item.path.split('/').length !== 4)) {
      return (
        <SubMenu
          title={
            item.icon ? (
              <span>
                {getIcon(item.icon)}
                <span>{item.name}</span>
              </span>
            ) : item.name
            }
          key={item.key || item.path}
          className={`menu${item.keys}`}
        >
          {this.getNavMenuItems(item.children)}
        </SubMenu>
      );
    } else if (item.path.split('/').length === 4 && item.children && item.children.some(child => child.name)) {
      return (
        <Menu.Item key={item.key || item.path} className="NodeClass">
          {this.difference(item)}
        </Menu.Item>
      );
    } else {
      return (
        <Menu.Item key={item.key || item.path} className="lastNodeClass">
          {this.getMenuItemPath(item)}
        </Menu.Item>
      );
    }
  }

  /**
  * 获得菜单子节点
  * @memberof SiderMenu
  */
  getNavMenuItems = (menusData) => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name && !item.hideInMenu)
      .map((item) => {
        // 如果不是运维账号，不展示移动APP菜单
        if (!ywAccount && item.appCode.startsWith('my-app')) {
          return null;
        }
        const ItemDom = this.getSubMenuOrItem(item);
        return this.checkPermissionItem(item.authority, ItemDom);
      })
      .filter(item => !!item);
  }

  difference = (item) => {
    const path = this.props.location.pathname;
    return (
      <Menu
        mode="vertical"
        className={styles.difference}
        onClick={this.handleOpenChanges}
        selectedKeys={[path.substr(1)]}
      >
        <SubMenu
          title={
            item.icon ? (
              <span>
                {getIcon(item.icon)}
                <span>{item.name}</span>
              </span>
            ) : item.name
            }
          key={item.key || item.path}
          className={`menu${item.keys}`}
        >
          {this.getNavMenuItems(item.children)}
        </SubMenu>
      </Menu>
    );
  }
  handleOpenChanges = (e) => {
    this.setState({
      openKeys: [e.key],
    });
  }

  // conversion Path
  // 转化路径
  conversionPath=(path) => {
    if (path && path.indexOf('http') === 0) {
      return path;
    } else {
      return `/${path || ''}`.replace(/\/+/g, '/');
    }
  }
  // permission to check
  checkPermissionItem = (authority, ItemDom) => {
    if (this.props.Authorized && this.props.Authorized.check) {
      const { check } = this.props.Authorized;
      return check(
        authority,
        ItemDom
      );
    }
    return ItemDom;
  }
  handleClick = ({ key }) => {
    localStorage.menuKey = key;
    const curPath = key.split('/');
    const curKey = curPath[curPath.length - 1];
    if (curKey === 'groupManager' && !localStorage.ifGroupManager) {
      localStorage.ifGroupManager = 'true';
    } else if (curKey === 'menuManager') {
      localStorage.ifMenuManager = 'true';
    } else if (curKey === 'dataManager') {
      localStorage.ifDataManager = 'true';
    }
    /*resultMenu.forEach((item2) => {
      if (item2.code === curPath[1]) {
        localStorage.appcode = item2.appCode;
      }
    });*/
  }
  handleOpenChange = (openKeys) => {
    const lastOpenKey = openKeys[openKeys.length - 1];
    const state = this.state.openKeys;
    const isMainMenu = this.menus.some(
      item => lastOpenKey && (item.key === lastOpenKey || item.path === lastOpenKey)
    );
    let num = 0;
    if (lastOpenKey) {
      num = lastOpenKey.split('/').length;
    }
    if (num > state.length || !lastOpenKey) {
      this.setState({
        openKeys: isMainMenu ? [lastOpenKey] : [...openKeys],
      });
    } else if (num === state.length) {
      if ( !(state[state.length - 1] === lastOpenKey)) {
        openKeys.splice(openKeys.length - 2, 1);
      }
      this.setState({
        openKeys,
      });
    } else {
      state.forEach((item, index) => {
        if (item.split('/').length === num) {
          state.splice(index, 1000, lastOpenKey)
        }
      });
      this.setState({
        openKeys: isMainMenu ? [lastOpenKey] : [...state],
      });
    }
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  }
  close = () => {
    const { width } = this.state;
    if (width === 240) {
      this.setState({
        width: 0,
      });
    }
  }
  open = () => {
    const { width } = this.state;
    if (width === 0) {
      this.setState({
        width: 240,
      });
    }
  }

  @Debounce(600)
  triggerResizeEvent() { // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  render() {
    const { logo, collapsed, location: { pathname }, onCollapse } = this.props;
    const webTitle = sessionStorage.webTitle ? sessionStorage.webTitle : '';
    const { openKeys } = this.state;
    // Don't show popup menu when it is been collapsed
    const menuProps = collapsed ? {} : {
      openKeys,
    };
    // if pathname can't match, use the nearest parent's key
    // let selectedKeys = this.getSelectedMenuKeys(pathname);
    // console.log(selectedKeys, 1);
    // if (!selectedKeys.length) {
    //   selectedKeys = [openKeys[openKeys.length - 1]];
    // }
    // console.log(selectedKeys, 2);
    const path = this.props.location.pathname.substr(1);
    formatMenu(this.menus);
    return (
      <div style={{ background: '#fff' }} >
        <div className={styles.logo} key="logo">
          <Link to="/">
            <img src={logo} alt="logo" />
            <h1>{webTitle}</h1>
          </Link>
        </div>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint="md"
          onCollapse={onCollapse}
          width={this.state.width}
          className={this.state.width === 0 ? (styles.siders) : (styles.sider)}
        >

          <div
            className={this.state.width === 0 ? (styles.backTelescopic) : (styles.telescopic)}
            onClick={this.close}
            onMouseEnter={this.open}
            // onBlur={this.open}
          >
            <Icon
              type="left"
              theme="outlined"
              style={{ color: '#fff' }}
            />
          </div>

          <div className={styles.sideMenu}>
            {/* <Icon
              className={styles.trigger}
              type={collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            /> */}
            <div
              className={styles.menuContent}
            >
              <Menu
                key="Menu"
                mode="inline"
                inlineIndent={18}
                {...menuProps}
                onOpenChange={this.handleOpenChange}
                selectedKeys={[path]}
                onClick={this.handleClick}
                style={{ width: '100%' }}
              >
                {this.getNavMenuItems(this.menus)}
              </Menu>
            </div>

          </div>
        </Sider>
      </div>
    );
  }
}
