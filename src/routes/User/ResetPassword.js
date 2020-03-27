import React, { Component } from 'react';
import { Tabs } from 'antd';
import { connect } from 'dva';
import ResetCode from '../../components/ResetCode';
import ResetPhone from '../../components/ResetPhone';
import styles from './Reset.less';

const TabPane = Tabs.TabPane;

@connect(({ login }) => ({ login }))
export default class ResetPsdPage extends Component {
  state= {}

  getCount = (val) => {
    this
      .props
      .dispatch({ type: 'login/queryCountOut', payload: val });
  }

  getPhone = (val) => {
    this
      .props
      .dispatch({ type: 'login/queryPhone', payload: val });
  }

  sendPhoneCode = (val) => {
    this.props.dispatch({ type: 'login/queryPhoneCode', payload: val });
  }

  sendCode= (val) => {
    this
      .props
      .dispatch({ type: 'login/sendCode', payload: val });
  }

  validCode = (val) => {
    this
      .props
      .dispatch({ type: 'login/validCode', payload: val });
  }

  resetPsd = (val) => {
    this
      .props
      .dispatch({ type: 'login/resetPsd', payload: val });
  }

  render() {
    const ifLogin = window.location.hash === '#/user/resetPsd';
    const { login: { countList, poneList }, psdVisible } = this.props;

    return (
      <Tabs defaultActiveKey="1" className={styles.margin_top}>
        <TabPane tab="工号找回" key="1">
          <div className={styles.main}>
            {
              ifLogin
              ?
                <div className={styles.title}>重置密码</div>
              :
                ''
            }
            <ResetCode
              countList={countList}
              sendCode={this.sendCode}
              resetPsd={this.resetPsd}
              getCount={this.getCount}
              ifLogin={ifLogin}
              psdVisible={psdVisible}
            />
          </div>
        </TabPane>
        <TabPane tab="手机号找回" key="2">
          <div className={styles.main}>
            {
              ifLogin
              ?
                <div className={styles.title}>重置密码</div>
              :
                ''
            }
            <ResetPhone
              countList={poneList}
              sendCode={this.sendPhoneCode}
              resetPsd={this.resetPsd}
              getCount={this.getPhone}
              ifLogin={ifLogin}
              psdVisible={psdVisible}
            />
          </div>
        </TabPane>
      </Tabs>
    );
  }
}
