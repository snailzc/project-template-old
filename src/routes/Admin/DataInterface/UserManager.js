import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Modal, Row } from 'antd';
import { getConfigElement } from '../../../utils/utils';
import styles from './UserManager.less';
import DataInterfaceUserSearch from '../../../components/Admin/DataInterface/UserSearch';
import DataInterfaceUserTable from '../../../components/Admin/DataInterface/UserTable';

let pageElement = {};

@connect(({ dataInterface, loading }) => ({
  dataInterface,
  loading: loading.effects['dataInterface/fetchUser'],
}))
@Form.create()
export default class DataInterfaceUserManager extends PureComponent {
  state = {
    initGet: {
      page: 1,
      limit: 20,
      elementId: this.props.elementId,
      keyword: '',
    },
    pageAccount: 1,
    limitAccount: 20,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataInterface/fetchUser',
      payload: this.state.initGet,
      pageElement,
    });
  }

  handleStandardTableChange = (pagination) => {
    const { dispatch } = this.props;
    const params = {
      ...this.state.initGet,
      page: pagination.current,
      limit: pagination.pageSize,
    };

    this.setState({
      limitAccount: pagination.pageSize,
      pageAccount: pagination.current,
    });

    dispatch({
      type: 'dataInterface/fetchUser',
      payload: params,
      pageElement,
    });
  };

  handleSearch = (val) => {
    const values = {
      page: 1,
      limit: 20,
      ...val,
      elementId: this.props.elementId,
    };

    this.setState({
      initGet: val,
      pageAccount: 1,
      limitAccount: 20,
    });

    this.props.dispatch({
      type: 'dataInterface/fetchUser',
      payload: values,
      pageElement,
    });
  };

  // 重置搜索框
  handleReset = () => {
    this.setState({
      page: 1,
      limit: 20,
    });
    this.props.form.resetFields();
    const values = {
      page: 1,
      limit: 20,
      name: '',
      crtName: '',
    };
    this.props.dispatch({
      type: 'dataInterface/fetchUser',
      payload: values,
    });
  };

  render() {
    const {
      dataInterface: { userList },
      loading,
      visible,
      handleVisible,
    } = this.props;
    const { limitAccount, pageAccount } = this.state;
    pageElement = getConfigElement('dataInterface');
    return (
      <Modal
        title="授权用户"
        onCancel={handleVisible}
        width="80%"
        visible={visible}
        className={styles.modal}
      >
        <Row>
          <div style={{ padding: '4px' }}>
            <DataInterfaceUserSearch
              handleSearch={this.handleSearch}
              getRefreshData={this.getRefreshData}
            />
          </div>
          <div style={{ height: 400 }} className={styles.modal}>
            <DataInterfaceUserTable
              loading={loading}
              data={userList}
              onChange={this.handleStandardTableChange}
              pageSize={limitAccount}
              current={pageAccount}
            />
          </div>
        </Row>
      </Modal>
    );
  }
}
