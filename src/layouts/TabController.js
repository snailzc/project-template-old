import React from 'react';
import { Tabs, message, Dropdown, Menu, Icon } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './Tab.less';

const { TabPane } = Tabs;

/**
* tab控制
*/
export default class TabController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: null,
      panes: [],
    };
  }

  componentWillMount() {
    const { name, keys, component, code = '' } = this.props;
    if (keys === '/' || !name) {
      return;
    }
    const { panes } = this.state;
    const activeKey = keys;
    panes.push({ name, key: activeKey, component, code });
    this.setState({ panes, activeKey });
  }

  componentWillReceiveProps(nextProps) {
    const { name, keys, component, code = '' } = nextProps;
    // console.log(nextProps);
    const { panes } = this.state;
    const activeKey = keys;
    const { hash } = window.location;
    if (hash.split('?').length === 2 && hash.split('?')[1] === 'edit') {
      panes.forEach((item) => {
        if (hash.search(item.key) > -1) {
          item.name = item.name.replace('新增', '编辑');
          this.setState({ panes });
        }
      });
    }
    if (hash.split('?')[1] != 'edit' && hash.search('New') > -1) {
      panes.forEach((item) => {
        if (hash.search(item.key) > -1) {
          item.name = item.name.replace('编辑', '新增');
          this.setState({ panes });
        }
      });
    }
    if (hash.search('New') === -1) {
      window.location.href = window.location.href.split('?')[0];
    }
    if (keys === '/' || !name) {
      return;
    }

    let isExist = false;
    let activeCode = '';
    for (let i = 0; i < panes.length; i += 1) {
      if (panes[i].key === activeKey) {
        isExist = true;
        activeCode = panes[i].code;
        break;
      }
    }

    if (isExist) {
      // 如果已经存在
      this.setState({ activeKey });
    } else {
      panes.push({ name, key: activeKey, component, code});
      this.setState({ panes, activeKey });
    }
    // console.log(activeKey);
    activeCode != '' && (localStorage.activeCode = activeCode);
  }

  onChange = (activeKey) => {
    localStorage.appcode = this.props.routerData[activeKey].appCode;
    const curPath = activeKey.split('/');
    // console.log(curPath)
    localStorage[curPath[curPath.length - 1]] = 'true';
    if (activeKey.indexOf('menuManager') > -1) {
      localStorage.ifMenuManager = 'true';
    } else if (activeKey.indexOf('dataManager') > -1) {
      localStorage.ifDataManager = 'true';
    } else if (activeKey.indexOf('groupManager') > -1) {
      localStorage.ifGroupManager = 'true';
    }
    if (activeKey.search('New') === -1) {
      window.location.href = window.location.href.split('?')[0];
    }
    // this.setState({ activeKey });
    this.props.dispatch(routerRedux.push({ pathname: activeKey }));
  }

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  }

  remove = (targetKey) => {
    if (this.state.panes.length === 1) {
      message.warning('窗口不能全部关闭');
      return;
    }
    let { activeKey } = this.state;
    let lastIndex;
    this.state.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const panes = this.state.panes.filter(pane => pane.key !== targetKey);
    if (lastIndex < 0) {
      lastIndex = 0;
    }

    if (lastIndex >= 0 && activeKey === targetKey) {
      activeKey = panes[lastIndex].key;
      this.props.dispatch(routerRedux.push({ pathname: activeKey }));
    }
    this.setState({ panes, activeKey });
  }

  handleMenuClick = (e) => {
    const curUrl = window.location.hash.split('#')[1];
    const targetkey = curUrl.length > 2 ? curUrl : '';
    if (!targetkey) {
      return false;
    }

    if (e.key === '1') {
      this.remove(targetkey);
    } else if (e.key === '2') {
      const panes = this.state.panes.filter(pane => pane.key === targetkey);
      this.setState({
        panes,
        activeKey: targetkey,
      });
    }
  }

  render() {
    const { location, match } = this.props;
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="1">关闭当前页</Menu.Item>
        <Menu.Item key="2">关闭其他</Menu.Item>
      </Menu>
    );
    const operation = (
      <Dropdown overlay={menu}>
        <span style={{ marginRight: '10px', cursor: 'pointer' }}>
          页签操作 <Icon type="down" />
        </span>
      </Dropdown>
    );
    return (
      <div className={styles.indexContent}>
        <Tabs
          hideAdd
          onChange={this.onChange}
          activeKey={this.state.activeKey}
          type="editable-card"
          onEdit={this.onEdit}
          tabBarExtraContent={this.state.panes.length >= 2 ? operation : ''}
        >
          {
            this.state.panes.map(pane => (
              <TabPane
                tab={pane.name}
                key={pane.key}
                id={pane.key === this.state.activeKey ? "paneContent" : ""}
                style={{
                  height: 'calc(100vh - 142px)',
                  overflowY: 'auto',
                  overflowX: 'hidden',
                }}
              >
                {
                  pane.key === this.state.activeKey && // 控制tab页切换是否刷新页面                  
                  <pane.component location={location} match={match} />
                }
              </TabPane>
            ))}
        </Tabs>
      </div>
    );
  }
}
