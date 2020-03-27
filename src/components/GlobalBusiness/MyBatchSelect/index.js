import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form } from 'antd';
import { dateTimeToDate, formatUnits } from '../../../../utils/utils';
import FsTable from '../FsTable';
import FsSearch from '../FsSearch';
import FsArea from '../FsArea';
import FsSegmentSelect from '../FsSegmentSelect';
import styles from './index.less';

@connect(({ fsCommon, loading }) => ({
  fsCommon,
  batchList: fsCommon.batchList,
  loading: loading.effects['fsCommon/post'],
}))
@Form.create()
export default class Index extends PureComponent {
  state = {
    page: 1,
    limit: 20,
  };

  componentDidMount() {
    this.getTableData();
  }

  getTableData = (params) => {
    const { page, limit, form } = this.state;
    this.props.dispatch({
      type: 'fsCommon/post',
      uri: '/feed_scheduling/myLivestockSituation/dwhBatchInfo',
      name: 'batchList',
      payload: { ...form, page, limit, ...params },
    });
  };

  handleTableChange = ({ current, pageSize }) => {
    this.setState({
      page: current,
      limit: pageSize,
    }, () => this.getTableData());
  };

  handleSearch = (values) => {
    const newValues = {
      ...values,
      provinceId: values.field && values.field[0],
      areaId: values.field && values.field[1],
      fieldId: values.field && values.field[2],
    };
    this.setState({
      form: newValues,
      page: 1,
      limit: 20,
    }, () => this.getTableData());
  };

  selectList = (selectedRowKeys, selectedRows) => {
    this.props.selectList(selectedRowKeys, selectedRows);
  };

  render() {
    const { batchList = [], loading } = this.props;
    const { page, limit } = this.state;
    const formItem = [{
      key: 'field',
      component: <FsArea onChange={this.onFieldChange} />,
    },
    {
      key: 'segmentId',
      component: <FsSegmentSelect />,
    },
    ];
    const columns = [{
      title: '批次号',
      dataIndex: 'FBatchNo',
      width: 200,
    },
    {
      title: '批次信息',
      dataIndex: 'FBatchAFSU',
      width: 330,
    },
    {
      title: '开启时间',
      dataIndex: 'FStartTime',
      width: 90,
      render: text => dateTimeToDate(text),
    },
/*    {
      title: '日龄',
      dataIndex: 'FDayOld',
      width: 50,
    },
    {
      title: '存栏',
      dataIndex: 'FLiveStock',
      width: 50,
    },*/
    {
      title: '单元',
      dataIndex: 'FUnitNames',
      width: 100,
      render: text => formatUnits(text),
    },
    {
      title: '饲养员',
      dataIndex: 'FFeederName',
      width: 70,
    },
    ];
    return [
      <FsSearch formItem={formItem} handleSearch={this.handleSearch} className={styles.search} key="search" />,
      <FsTable
        pageElement={null}
        columns={columns}
        data={batchList}
        current={page}
        pageSize={limit}
        loading={loading}
        handleTableChange={this.handleTableChange}
        selectList={this.selectList}
        scroll={{ x: 1150, y: 300 }}
        operation={false}
        type="radio"
        ref={this.myRef}
        tableKey="FBatchNo"
        key="batchTable"
      />,
    ];
  }
}
