import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Form } from 'antd';
import DataInterfaceTable from '../../../components/Admin/DataInterface/Table';
import DataInterfaceSearch from '../../../components/Admin/DataInterface/Search';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import { getConfigElement } from '../../../utils/utils';
import styles from './Manager.less';
import DataInterfaceGroupManager from './GroupManager';
import DataInterfaceUserManager from './UserManager';

let pageElement = {};

@connect(({ dataInterface, loading }) => ({
  dataInterface,
  loading: loading.effects['dataInterface/fetch'],
}))
@Form.create()
export default class DataInterfaceManager extends PureComponent {
  state = {
    elementId: '',
    groupVisible: false,
    userVisible: false,
    initGet: {
      page: 1,
      limit: 20,
      id: '',
      status: '',
    },
    pageAccount: 1,
    limitAccount: 20,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataInterface/fetch',
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
      type: 'dataInterface/fetch',
      payload: params,
      pageElement,
    });
  };

  handleSearch = (val) => {
    const values = {
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
      type: 'dataInterface/fetch',
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
      type: 'dataInterface/fetch',
      payload: values,
    });
  };

  handleFreshData() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataInterface/fetch',
      payload: {
        page: this.state.page,
        limit: this.state.limit,
      },
    });
  }

  handleGroupShow = (text, element) => {
    this.setState({
      groupVisible: true,
      elementId: element.id,
    });
  };

  handleGroupHide = () => {
    this.setState({
      groupVisible: false,
    });
  };

  handleUserShow = (text, element) => {
    this.setState({
      userVisible: true,
      elementId: element.id,
    });
  };

  handleUserHide = () => {
    this.setState({
      userVisible: false,
    });
  };

  render() {
    const {
      dataInterface: { dataList },
      loading,
    } = this.props;
    const { limitAccount, pageAccount, userVisible, groupVisible, elementId } = this.state;
    pageElement = getConfigElement('dataInterface');
    return (
      <PageHeaderLayout title="接口管理">
        <Row className="normalContent">
          <div style={{ padding: '4px' }}>
            <DataInterfaceSearch
              handleSearch={this.handleSearch}
              pageElement={pageElement}
            />
          </div>
          <div className={styles.fieldInfoTable}>
            {<DataInterfaceTable
              loading={loading}
              data={dataList}
              onChange={this.handleStandardTableChange}
              pageElement={pageElement}
              pageSize={limitAccount}
              current={pageAccount}
              viewAuthByRole={this.handleGroupShow}
              viewAuthByUser={this.handleUserShow}
            />}
          </div>
          { groupVisible &&
            <DataInterfaceGroupManager
              handleVisible={this.handleGroupHide}
              visible={groupVisible}
              elementId={elementId}
            />
          }
          {userVisible &&
            <DataInterfaceUserManager
              handleVisible={this.handleUserHide}
              visible={userVisible}
              elementId={elementId}
            />
          }
        </Row>
      </PageHeaderLayout>
    );
  }
}
