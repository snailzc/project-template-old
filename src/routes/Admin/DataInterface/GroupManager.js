import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Modal, Row } from 'antd';
import { getConfigElement } from '../../../utils/utils';
import styles from './GroupManager.less';
import DataInterfaceGroupSearch from '../../../components/Admin/DataInterface/GroupSearch';
import DataInterfaceGroupTable from '../../../components/Admin/DataInterface/GroupTable';

let pageElement = {};

@connect(({ dataInterface, loading }) => ({
  dataInterface,
  loading: loading.effects['dataInterface/fetchGroup'],
}))
@Form.create()
export default class DataInterfaceGroupManager extends PureComponent {
  state = {
    initGet: {
      page: 1,
      limit: 20,
      elementId: this.props.elementId,
    },
    pageAccount: 1,
    limitAccount: 20,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataInterface/fetchGroup',
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
      type: 'dataInterface/fetchGroup',
      payload: params,
      pageElement,
    });
  };

  handleSearch = (val) => {
    const values = {
      elementId: this.props.elementId,
      page: 1,
      limit: 20,
      ...val,
    };

    this.setState({
      initGet: val,
      pageAccount: 1,
      limitAccount: 20,
    });

    this.props.dispatch({
      type: 'dataInterface/fetchGroup',
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
      type: 'dataInterface/fetchGroup',
      payload: values,
    });
  };

  handleFreshData() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataInterface/fetchGroup',
      payload: {
        page: this.state.page,
        limit: this.state.limit,
      },
    });
  }

  render() {
    const {
      dataInterface: { groupList },
      loading,
      handleVisible,
      visible,
    } = this.props;
    const { limitAccount, pageAccount } = this.state;
    pageElement = getConfigElement('dataInterface');
    return (
      <Modal
        title="授权角色"
        onCancel={handleVisible}
        width="80%"
        visible={visible}
        className={styles.modal}
      >
        <Row>
          <div style={{ padding: '4px' }}>
            <DataInterfaceGroupSearch
              handleSearch={this.handleSearch}
              getRefreshData={this.getRefreshData}
            />
          </div>
          <div style={{ height: 400 }} className={styles.modal}>
            <DataInterfaceGroupTable
              loading={loading}
              data={groupList}
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
