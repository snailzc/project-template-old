import React, { PureComponent } from 'react';
import { Popover } from 'antd';
import BaseTable from '../GlobalAdminTable';
import { dateTimeToDate } from '../../../utils/utils';

class DataInterfaceGroupTable extends PureComponent {
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
    this.props.onChange(pagination, {});
  };

  render() {
    const { data, loading, pageElement, pageSize, current } = this.props;
    const columns = [
      { title: '角色名称', dataIndex: 'name', width: 120 },
      { title: '授权人', dataIndex: 'crt_name', width: 70 },
      { title: '授权日期',
        dataIndex: 'crt_time',
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
    ];

    return (
      <BaseTable
        columns={columns}
        rowClassName={this.tableClass}
        data={data}
        loading={loading}
        pageElement={pageElement}
        handleTableChange={this.handleTableChange}
        pageSize={pageSize}
        current={current}
        selectRows="selectRow"
      />
    );
  }
}

export default DataInterfaceGroupTable;
