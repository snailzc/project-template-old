import React, { PureComponent } from 'react';
import { Input } from 'antd';
import { connect } from 'dva';
import MySearch from '../../../components/GlobalBusiness/MySearch';
import MyTable from '../../../components/GlobalBusiness/MyTable';
import MyGlobalDrawer from '../../../components/GlobalBusiness/MyGlobalDrawer';
import { getConfigElement, formatStatus } from '../../../utils/utils';
import MyGlobalRadio from '../../../components/GlobalBusiness/MyGlobalRadio';

let pageElement = {};

@connect(({ myCommon, loading }) => ({
  tableData: myCommon.tableData,
  loading: loading.effects['myCommon/getData'],
}))
export default class Manager extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      limit: 20,
      addCount: 0,
      close: 0,
      status: 'AUDITED',
      form: {},
      stationType: [{
        label: '中转站',
        value: 0,
      },
      {
        label: '消毒站',
        value: 1,
      }],
    };
    pageElement = getConfigElement('generalList_slide');
    this.myRef = React.createRef();
  }

  componentWillMount() {
    this.getTableData();
  }

//   componentWillReceiveProps(nextProps) {
//     if(localStorage.activeCode == 'generalList'){
//       localStorage.activeCode = '';
//       this.getTableData();
//     }
//   }

  getTableData = (params) => {
    const { page, limit, form, status } = this.state;
    this.props.dispatch({
      type: 'myCommon/getData',
      uri: pageElement && pageElement.view && pageElement.view.uri,
      payload: { ...form, page, limit, status, ...params },
    });
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

  handleAdd = () => {
    this.setState({
      addCount: this.state.addCount + 1,
      ifEdit: false,
      values: {
      },
    });
  };

  handleSubmit = (values) => {
    console.log(values);
  }

  render() {
    const { tableData, loading } = this.props;
    const { page, limit, stationType, addCount, close, values={} } = this.state;
    const formItem = [{
      key: 'stationName',
      component: <Input placeholder="名称" />,
    },
    {
      key: 'innerCode',
      component: <Input placeholder="场内编码" />,
    },
    {
      key: 'deviceManufactor',
      component: <Input placeholder="设备厂家" />,
    },
    {
      key: 'stationType',
      initialValue: '',
      component: <MyGlobalRadio options={stationType} allowAll />,
    },
    ];
    const expandFormItem = [{
        key: 'areaName',
        component: <Input placeholder="区域" />,
      },
      {
        key: 'fieldName',
        component: <Input placeholder="场区" />,
      },
      {
        key: 'model',
        component: <Input placeholder="型号" />,
      },
      ];
    const columns = [{
      title: '名称',
      dataIndex: 'stationName',
      width: 120,
    },
    {
      title: '区域',
      dataIndex: 'areaName',
      width: 80,
    },
    {
      title: '场区',
      dataIndex: 'fieldName',
      width: 100,
    },
    {
      title: '场内编码',
      dataIndex: 'innerCode',
      width: 80,
    },
    {
      title: '设备厂家',
      dataIndex: 'deviceManufactor',
      width: 100,
    },
    {
      title: '型号',
      dataIndex: 'model',
      width: 80,
    },
    {
      title: '站点类型',
      dataIndex: 'stationType',
      width: 80,
      render: (text) => {
        return stationType[text] && stationType[text].label;
      },
    },
    {
      title: '站号',
      dataIndex: 'stationNum',
      width: 80,
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      width: 150,
      render: (text, record) => {
        return <span>{`${record.prefix}://${record.ip}:${record.port}`}</span>;
      },
    },
    {
      title: '产能(T/H)',
      dataIndex: 'capacity',
      width: 80,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: val => formatStatus(val),
    }, {
      title: '创建日期',
      dataIndex: 'crtTime',
      type: 'time',
      width: 100,
    }, {
      title: '创建人',
      dataIndex: 'crtName',
      width: 80,
    },
    ];
    const btnsLeft = [{
      name: '新增',
      func: this.handleAdd,
      isShow: true,
    }];

    const slideformItem = [
      {
        key: 'id',
        label: 'id',
        initialValue: values && values.id,
        span: 0,
        component: <Input />,
      },
      {
        key: 'age',
        label: '日龄',
        initialValue: values && values.age,
        span: 12,
        component: <Input addonAfter="天" />,
        rules: [
          {
            required: true,
            message: '请输入日龄',
          }
        ],
      },
      {
        key: 'feedIntake',
        label: '标准采食量',
        initialValue: values && values.feedIntake,
        span: 12,
        component: <Input addonAfter="克" />,
        rules: [
          {
            required: true,
            message: '请输入标准采食量',
          }
        ],
      },
      {
        key: 'correctionOefficient',
        label: '矫正系数',
        initialValue: values && values.correctionOefficient || 1,
        span: 12,
        component: <Input />,
        rules: [
          {
            required: true,
            message: '请输入矫正系数',
          }
        ],
      },
    ];
    return [
      <MySearch formItem={formItem} expandFormItem={expandFormItem} handleSearch={this.handleSearch} key="search" />,
      <MyTable
        pageElement={pageElement}
        columns={columns}
        data={tableData}
        current={page}
        pageSize={limit}
        loading={loading}
        selectList={this.selectList}
        handleEdit={this.handleEdit}
        handleDelete={this.handleDelete}
        btnsLeft={btnsLeft}
        operation={false}
        selectRows={false}
        scroll={{ x: 1400, y: 300 }}
        ref={this.myRef}
        key="table"
      />,
      <MyGlobalDrawer 
        count={addCount}
        close={close}
        handleSubmit={this.handleSubmit}
        formItem={slideformItem}
      />
    ];
  }
}
