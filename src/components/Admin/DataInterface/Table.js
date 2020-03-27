import React, { Fragment, PureComponent } from 'react';
import { Popover, Button } from 'antd';
import GlobalAdminTable from '../GlobalAdminTable';
import { dateTimeToDate } from '../../../utils/utils';

export default class DataInterfaceTable extends PureComponent {
  state = {
    pagination: {
      current: 1,
      pageSize: 20,
    },
  };

  handleTableChange = (pagination) => {
    this.setState({
      pagination: this.state.pagination,
    });
    this.props.onChange(pagination);
  };

  render() {
    const { data, loading, pageSize, current, pageElement } = this.props;
    const columns = [
      { title: '所属菜单',
        dataIndex: 'title',
        width: 80,
        render: (text) => {
          return (
            <Fragment>
              {text == null ? '默认菜单' : text}
            </Fragment>
          );
        },
      },
      { title: '接口描述', dataIndex: 'name', width: 200 },
      { title: '方法类型', dataIndex: 'method', width: 50 },
      { title: 'URI', dataIndex: 'uri', width: 200 },
      { title: '对外开放',
        dataIndex: 'open',
        width: 50,
        render: (text) => {
          return (
            <Fragment>
              {text === '1' ? '是' : '否'}
            </Fragment>
          );
        },
      },
      {
        title: '录入日期',
        dataIndex: 'crt_time',
        width: 50,
        render: (text) => {
          return (
            <Popover content={text}>
              <div className="letter-overflow">
                {dateTimeToDate(text)}
              </div>
            </Popover>
          );
        },
      },
      {
        title: '权限所属',
        width: 50,
        dataIndex: 'operation',
        render: (text, record, index) => (
          <Fragment>
            <div className="normalOperateBtn">
              <Button
                type="primary"
                size="small"
                className="viewBtn"
                onClick={() => this.props.viewAuthByRole(text, record, index)}
              >
                  角色
              </Button>
              <Button
                type="primary"
                size="small"
                className="viewBtn"
                onClick={() => this.props.viewAuthByUser(text, record, index)}
              >
                人员
              </Button>
            </div>
          </Fragment>
        ),
      },
    ];
    return (
      <GlobalAdminTable
        columns={columns}
        data={data}
        loading={loading}
        pageElement={pageElement}
        handleTableChange={this.handleTableChange}
        pageSize={pageSize}
        current={current}
        selectRows="selectRows"
        operation="none"
      />
    );
  }
}

