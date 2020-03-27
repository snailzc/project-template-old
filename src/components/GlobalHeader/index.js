import React, { PureComponent } from 'react';
import {
  Layout,
  Menu,
  Tag,
  Icon,
  Dropdown,
  Avatar,
  Divider,
  Modal,
} from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import { Link } from 'dva/router';
import { getOnline } from '../../common/menu';
import NoticeIcon from '../../components/NoticeIcon';
import HeaderSearch from '../../components/HeaderSearch';
import ResetCode from '../../components/ResetCode';
import styles from './index.less';

const { Header } = Layout;

export default class GlobalHeader extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      online: '',
    };
  }

  componentDidMount() {
    getOnline().then((res) => {
      this.setState({
        online: res,
      });
    });
  }
  componentWillUnmount() {
    this.triggerResizeEvent && this.triggerResizeEvent.cancel();
  }
  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map((notice) => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      // transform id to item key
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

  render() {
    const {
      currentUser,
      isMobile,
      logo,
      psdVisible,
      onNoticeVisibleChange,
      onMenuClick,
      onNoticeClear,
      countList,
    } = this.props;
    const { online } = this.state;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item disabled>
          <Icon type="user" />个人中心
        </Menu.Item>
        <Menu.Item disabled>
          <Icon type="setting" />设置
        </Menu.Item>
        <Menu.Item key="psd">
          <Icon type="lock" />修改密码
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />退出登录
        </Menu.Item>
      </Menu>
    );
    const noticeData = this.getNoticeData();
    const ifLogin = window.location.hash === '#/user/resetPsd';


    return (
      <Header className={styles.header}>
        {isMobile && [
          <Link to="/" className={styles.logo} key="logo">
            <img src={logo} alt="logo" width="32" />
          </Link>,
          <Divider type="vertical" key="line" />,
        ]}
        <div className={styles.right}>
          {
            online && (<span>在线人数：{online}</span>)
          }
          {/* <HeaderSearch
            className={`${styles.action} ${styles.search}`}
            placeholder="站内搜索"
            dataSource={['搜索提示一', '搜索提示二', '搜索提示三']}
            onSearch={(value) => {
              // console.log("input", value); // eslint-disable-line
            }}
            onPressEnter={(value) => {
              // console.log("enter", value); // eslint-disable-line
            }}
          />
          <NoticeIcon
            className={styles.action}
            count={0}
            onItemClick={(item, tabProps) => {
              // console.log(item, tabProps); // eslint-disable-line
            }}
            onClear={onNoticeClear}
            onPopupVisibleChange={onNoticeVisibleChange}
            loading={false}
            popupAlign={{ offset: [20, -16] }}
          >
            <NoticeIcon.Tab
              list={noticeData['通知']}
              title="通知"
              emptyText="你已查看所有通知"
              emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
            />
            <NoticeIcon.Tab
              list={noticeData['消息']}
              title="消息"
              emptyText="您已读完所有消息"
              emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
            />
            <NoticeIcon.Tab
              list={noticeData['待办']}
              title="待办"
              emptyText="你已完成所有待办"
              emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg"
            />
          </NoticeIcon> */}
          {currentUser.name ? (
            <Dropdown overlay={menu}>
              <span className={`${styles.action} ${styles.account}`}>
                <Avatar
                  size="small"
                  className={styles.avatar}
                  src={currentUser.avatar}
                />
                <span className={styles.name}>{currentUser.name}</span>
              </span>
            </Dropdown>
          ) : (
            currentUser.username && (
              <Dropdown overlay={menu}>
                <span className={styles.name}>{currentUser.username}</span>
              </Dropdown>
            )
          )}
          {psdVisible ? (
            <Modal
              visible={psdVisible}
              title="修改密码"
              footer={null}
              onCancel={this.props.cancelResetPwd}
            >
              <ResetCode
                sendCode={this.props.sendCode}
                getCount={this.props.getCount}
                resetPsd={this.props.resetPsd}
                countList={countList}
                ifLogin={ifLogin}
                cancelResetPwd={this.props.cancelResetPwd}
              />
            </Modal>
          ) : (
            ''
          )}
        </div>
      </Header>
    );
  }
}
