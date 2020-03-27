import React, { Component } from 'react';
import { connect } from 'dva';
import { Alert, Row, Modal, Radio } from 'antd';
import jwtDecode from 'jwt-decode';
import Login from '../../components/Login';
import styles from './Login.less';
import bac from './img/bg.png';
import bac_left from './img/left.png';
import '../../assets/wwLogin-1.0.0.js';
import logo from './img/logo.svg';
import { redirectUrl, judgeTitle } from '../../common/menu';
import { freashToken } from '../../services/api';
import { resetLocal } from '../../utils/utils';
import { getToken } from '../../utils/usertoken';
const appConfig = require("../../../config/app.config.js");

const { Tab, UserName, Password, Submit } = Login;
const { confirm } = Modal;
const RadioGroup = Radio.Group;
let curChooseToken = {};
let timer = null;
let userToken = getToken();
const envir = process.env.API_ENV;

function freashUserToken() {
  timer = setInterval(() => {
    if (localStorage.leftSeconds <= 600 && localStorage.ifRequest === 'true') {
      clearInterval(timer);
      localStorage.ifRequest = false;
      freashToken()
        .then((res) => {
          if (res.data && res.data.rows[0]) {
            const bytes = jwtDecode(res.data.rows[0].token);
            localStorage.bytes = JSON.stringify(bytes);
            localStorage.setItem('user-token', res.data.rows[0].token);
            localStorage.setItem('refreshToken', res.data.rows[0].refreshToken);
            document.cookie = `Admin-Token=${res.data.rows[0].token}`;
            localStorage.leftSeconds =
              (`${bytes.exp}000` - new Date().getTime()) / 1000;
            freashUserToken();
          }
        })
        .catch((e) => {
          resetLocal();
        });
    } else {
      localStorage.leftSeconds -= 1;
    }
    if (localStorage.leftSeconds <= 1) {
      const cWT = sessionStorage.webTitle;
      const hash = judgeTitle(cWT);
      window.location.href = hash[0].url;
    }
  }, 1000);
}

function onChange(e) {
  curChooseToken = e.target.value;
}

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component {
  state = {
    type: 'account',
    appCode: require('../../../config/app.config.js').appShortCode,
  };

  componentWillMount() {
    // const hashUrl = window.location.hash;
    sessionStorage.webTitle = false;
    redirectUrl();
    if (localStorage.wechatRes) {
      const res = JSON.parse(localStorage.wechatRes);
      confirm({
        title: '请选择需要登录的账号?',
        content: (
          <RadioGroup onChange={onChange}>
            {res.map(item => <Radio value={item}>{item.username}</Radio>)}
          </RadioGroup>
        ),
        okText: '确认',
        cancelText: '取消',
        onOk() {
          const bytes = jwtDecode(curChooseToken.accessToken.accessToken);
          localStorage.bytes = JSON.stringify(bytes);
          localStorage.setItem(
            'user-token',
            curChooseToken.accessToken.accessToken,
          );
          localStorage.setItem(
            'refreshToken',
            curChooseToken.accessToken.refreshToken,
          );
          document.cookie = `Admin-Token=${curChooseToken.accessToken.accessToken}`;

          localStorage.leftSeconds =
            (`${bytes.exp}000` - new Date().getTime()) / 1000;
          freashUserToken();
          userToken = curChooseToken.accessToken.accessToken;
          localStorage.refreshToken = curChooseToken.accessToken.refreshToken;
          localStorage.setItem('antd-pro-authority', 'admin');
          localStorage.removeItem('wechatRes');
          window.location.href = `//${window.location.host}`;
        },
        onCancel() {
          localStorage.removeItem('wechatRes');
          window.location.search = '';
          const wTWeChat = sessionStorage.webTitle;
          const hash = judgeTitle(wTWeChat);
          window.location.href = hash[0].url;
        },
      });
    }
  }

  onTabChange = (type) => {
    this.setState({ type });
    if (type === 'wechat') {
      setTimeout(() => {
        this.props.dispatch({
          type: 'login/buildWechatInfo',
          payload: {
            systemId: 'CLEANPRODUCE',
          },
          callback: (data) => {
            const path = 'api/wechat/auth/wxLogin';
            if (envir === 'pro') {
              const url = `https://my.imuyuan.com/${path}`;
              window.WwLogin({
                id: 'login_wechat',
                appid: 'ww7d751c0944e1ab5f',
                agentid: '1000024',
                redirect_uri: encodeURI(url),
                state: data.state,
                href: '',
              });
            } else {
              const url = `https://dev.imuyuan.com/${path}`;
              window.WwLogin({
                id: 'login_wechat',
                appid: 'wwb8dcf448030bc7b1',
                agentid: '1000003',
                redirect_uri: encodeURI(url),
                state: data.state,
                href: '',
              });
            }
          },
        });
      }, 800);
    }
  };

  handleSubmit = (err, values) => {
    const { type, appCode } = this.state;
    if (!err) {
      this.props.dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
          appCode
        },
      });
    }
  };

  renderMessage = (content) => {
    return (
      <Alert
        style={{ marginBottom: 24 }}
        message={content}
        type="error"
        showIcon
        closable
      />
    );
  };

  render() {
    const { login, submitting } = this.props;
    const { type } = this.state;
    return (
      <div className={styles.main} style={{ background: `url(${bac}) no-repeat center/ cover` }}>
        <header>
          <img src={logo} alt="logo.svg" />
          appConfig.appName
		    </header>
        <div className={styles.content} >
          <div className={styles.left} style={{ background: `url(${bac_left}) no-repeat center/ cover` }}></div>
          <div className={styles.right}>
            <Login
              defaultActiveKey={type}
              onTabChange={this.onTabChange}
              onSubmit={this.handleSubmit}
              className={styles.tabs}
            >
              <Tab key="account" tab="账户登录">
                {login.status === 'error' &&
                  login.type === 'account' &&
                  !login.submitting &&
                  this.renderMessage('账户或密码错误')}
                <UserName name="username" placeholder="用户名" />
                <Password name="password" placeholder="密码" />
                <div className={styles.formBottom}>
                  <Submit className={styles.loginBtn} loading={submitting}>登录</Submit>
                  <Row>
                    {/* <a
                      style={{
                        float: 'left',
                        color: '#303B3C',
                        cursor: 'pointer',
                        padding: 4,
                        zIndex: '11',
                        fontSize: '14px',
                      }}
                      href="#/user/register"
                    >
                      立即注册
                    </a> */}
                    <a
                      style={{
                        float: 'left',
                        color: 'rgba(48,59,60,1)',
                        cursor: 'pointer',
                        //padding: 4,
                        zIndex: '11',
                        fontSize: '14px',
                        fontFamily:'PingFang SC',
                        fontWeight:400,
                      }}
                      href="#/user/resetPsd"
                    >
                      忘记密码
                    </a>
                  </Row>                 
                </div>
              </Tab>
              <Tab key="wechat" tab="扫码登录">
                {login.status === 'error' &&
                  login.type === 'wechat' &&
                  !login.submitting &&
                  this.renderMessage('登录失败')}
                <div id="login_wechat" style={{width: "300px", margin: "-45px auto"}} />
              </Tab>
            </Login>        
          </div>
        </div>
        <footer>
          <p>MuYuan Foods Co.,Ltd.牧原食品股份有限公司</p>
          <p>豫ICP备12008773号 豫公网安备 41130302000124号</p>
        </footer>
      </div>
    );
  }
}
