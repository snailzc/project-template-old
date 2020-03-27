import React from 'react';
import PropTypes from 'prop-types';
import { Layout, message, Icon } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Route, Redirect, Switch } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
// import io from 'socket.io-client';
// import Stomp from 'stompjs';
import classNames from 'classnames';
import { enquireScreen } from 'enquire-js';
import GlobalHeader from '../components/GlobalHeader';
import GlobalFooter from '../components/GlobalFooter';
import SiderMenu from '../components/SiderMenu';
import NotFound from '../routes/Exception/404';
import { getRoutes, resetLocal } from '../utils/utils';
import Authorized from '../utils/Authorized';
import { menuList } from '../common/menu';
import TabController from './TabController';
import logo from '../assets/logo.png';
import FarmHeaderBiz from '../components/Navigation/FarmHeaderBiz';
import styles from './BasicLayout.less';
// const adminSocket = io('ws://10.106.11.43/v1');
// var client = Stomp.over(adminSocket);

// client.connect({ token: localStorage.getItem('user-token') }, function(frame) {
//   setConnected(true);
//   console.log('Connected: ' + frame);

//   client.subscribe(
//     'http://10.106.11.43/topic/' + '6vG9o3zjAi6ECtNNIgzqTj' + '.time',
//     function(greeting) {
//       console.log(JSON.parse(greeting.body).content);
//     }
//   );

//   client.subscribe(
//     'http://10.106.11.43/topic/' + '6vG9o3zjAi6ECtNNIgzqTj',
//     function(response) {
//       console.log(JSON.parse(response.body).content);
//     }
//   );
// });

const { Content, Footer } = Layout;
const { AuthorizedRoute } = Authorized;
let timer;

/**
 * 根据菜单取得重定向地址.
 */
const redirectData = [];
const getRedirect = (item) => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `/${item.path}`,
        to: `/${item.children[0].path}`,
      });
      item.children.forEach((children) => {
        getRedirect(children);
      });
    }
  }
};

menuList.forEach(getRedirect);

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};

let isMobile;
enquireScreen((b) => {
  isMobile = b;
});

class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  };
  state = {
    isMobile,
    psdVisible: false,
  };
  getChildContext() {
    const { location, routerData } = this.props;
    return {
      location,
      breadcrumbNameMap: routerData,
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    enquireScreen((mobile) => {
      this.setState({
        isMobile: mobile,
      });
    });
    dispatch({
      type: 'local/getDefaultCondition',
    });
    dispatch({
      type: 'user/fetchCurrent',
    });
    dispatch({
      type: 'local/getUploadUrl',
    });
  }

  getCount = (val) => {
    this.props.dispatch({
      type: 'login/queryCountInner',
      payload: val,
    });
  };

  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = sessionStorage.webTitle ? sessionStorage.webTitle : '牧原数字化养殖平台';
    if (routerData[pathname] && routerData[pathname].name) {
      title = sessionStorage.webTitle ? sessionStorage.webTitle : '牧原数字化养殖平台';
    }
    return title;
  }

  handleNoticeVisibleChange = (visible) => {
    if (visible) {
      // this.props.dispatch({
      //   type: 'global/fetchNotices',
      // });
    }
  };

  sendCode = (val) => {
    this.props.dispatch({
      type: 'login/sendCode',
      payload: val,
    });
  };

  // 取消重置密码
  cancelResetPwd = () => {
    this.setState({
      psdVisible: false,
    });
  };

  validCode = (val) => {
    this.props.dispatch({
      type: 'login/validCode',
      payload: val,
    });
  };

  resetPsd = (val) => {
    this.props.dispatch({
      type: 'login/resetPsd',
      payload: val,
    });
  };

  handleMenuCollapse = (collapsed) => {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  handleNoticeClear = (type) => {
    message.success(`清空了${type}`);
    this.props.dispatch({
      type: 'global/clearNotices',
      payload: type,
    });
  };

  handleMenuClick = ({ key }) => {
    const envir = process.env.API_ENV;
    localStorage.ifPigLogout = false;
    if (key === 'logout') {
      this.props.dispatch({
        type: 'login/logout',
      });
    }
    if (envir !== 'local' && sessionStorage.webTitle && sessionStorage.webTitle === '牧原养猪管理平台') {
      localStorage.ifPigLogout = true;
      localStorage.farmId = '';
      localStorage.farmName = '';
      resetLocal();
    }


    if (key === 'psd') {
      // this.props.dispatch({
      //   type: 'login/logout',
      // }).then(() => {
      // window.location.href = '#/adminSys/resetPsd';
      // });
      // 修改密码model
      const userInfo = localStorage.info && JSON.parse(localStorage.info);
      if (String(userInfo.type) === '2') {
        message.warning('外部用户暂时不能修改密码！');
      } else {
        this.setState({
          psdVisible: true,
        });
      }
    }
  };

  scrollTop = () => {
    cancelAnimationFrame(timer);
    timer = requestAnimationFrame(function fn() {
      // console.log(document.getElementById("paneContent"),document.getElementById("paneContent").parentElement);
      var oTop = document.getElementById("paneContent").scrollTop || document.body.scrollTop || document.documentElement.scrollTop;
      if(oTop > 0){
        document.getElementById("paneContent").scrollTop = document.body.scrollTop = document.documentElement.scrollTop = oTop - 30;
        timer = requestAnimationFrame(fn);
      }else{
        cancelAnimationFrame(timer);
      }
    });
  };

  render() {
    const {
      currentUser,
      collapsed,
      fetchingNotices,
      notices,
      routerData,
      match,
      location,
      countList,
    } = this.props;
    const { psdVisible } = this.state;
    const tasParams = {
      ...this.props.routerData[location.pathname],
      keys: location.pathname,
      location,
      routerData: this.props.routerData,
      dispatch: this.props.dispatch,
      match,
    };
    const layout = (
      <Layout>
        <SiderMenu
          logo={logo}
          // 不带Authorized参数的情况下如果没有权限,会强制跳到403界面
          // If you do not have the Authorized parameter
          // you will be forced to jump to the 403 interface without permission
          Authorized={Authorized}
          menuData={menuList}
          collapsed={collapsed}
          location={location}
          isMobile={this.state.isMobile}
          onCollapse={this.handleMenuCollapse}
        />
        <Layout>
          <GlobalHeader
            logo={logo}
            currentUser={currentUser}
            fetchingNotices={fetchingNotices}
            notices={notices}
            collapsed={collapsed}
            isMobile={this.state.isMobile}
            onNoticeClear={this.handleNoticeClear}
            onCollapse={this.handleMenuCollapse}
            onMenuClick={this.handleMenuClick}
            onNoticeVisibleChange={this.handleNoticeVisibleChange}
            psdVisible={psdVisible}
            countList={countList}
            getCount={this.getCount}
            cancelResetPwd={this.cancelResetPwd}
            sendCode={this.sendCode}
            validCode={this.validCode}
            resetPsd={this.resetPsd}
          />
           <Content className={styles.content}>
            <div className={styles.main}>
              <Switch>
                <Route path="/" exact component={FarmHeaderBiz} />
                <TabController {...tasParams} />
                {/* {getRoutes(match.path, routerData).map(item => (
                  <AuthorizedRoute
                    key={item.key}
                    path={item.path}
                    component={item.component}
                    exact={item.exact}
                    authority={item.authority}
                    redirectPath="/exception/403"
                  />
                ))}
                {redirectData.map(item => (
                  <Redirect
                    key={item.from}
                    exact
                    from={item.from}
                    to={item.to}
                  />
                ))} */}

                <Redirect exact from="/" to="/welcome" />
                <Route render={NotFound} />
              </Switch>
            </div>
            {/* <Icon className={styles.scrollTop} type="up-square" onClick={this.scrollTop} title="返回顶部"/> */}
          </Content>
          {/* <Footer className={styles.footer}>
            <GlobalFooter
              copyright={
                <div>
                  Copyright <Icon type="copyright" /> 2018
                  深圳牧原数字技术有限公司
                </div>
              }
            />
          </Footer> */}
        </Layout>
      </Layout>
    );

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default connect(({ user, global, local, loading, login }) => ({
  countList: login.countList,
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  local,
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
}))(BasicLayout);
