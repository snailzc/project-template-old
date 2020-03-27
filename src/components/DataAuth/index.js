import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import StandardTable from '../StandardTable';
import './index.less';

class DataAuthTable extends PureComponent {
  state = {
    field: '',
    order: 'desc',
    pagination: {
      current: 1,
      pageSize: 20,
    },
  };

  handleTableChange = (pagination) => {
    const { field, order } = this.state;
    const sorter = {
      field,
      order,
    };

    this.setState({
      pagination: {
        ...this.state.pagination,
      },
    });

    this.props.onChange(pagination, sorter);
  };

  sortTable = (index) => {
    const { field, order, pagination } = this.state;
    let sorter = {};

    if (field === index) {
      const whichDirec = order === 'desc' ? 'asc' : 'desc';
      this.setState({
        field: index,
        order: whichDirec,
      });
      sorter = {
        field: index,
        order: whichDirec,
      };
    } else {
      this.setState({
        field: index,
        order: 'desc',
      });
      sorter = {
        field: index,
        order: 'desc',
      };
    }
    this.props.onChange(pagination, sorter);
  };

  render() {
    const { data, loading, pageElement, current, edit, pageSize } = this.props;
    const { field, order } = this.state;
    const columns = [
      {
        title: (
          <span
            onClick={() => {
              this.sortTable('username');
            }}
            className="table-icon"
          >
            用户名
            <Icon
              type={field === 'username' && order === 'asc' ? 'caret-up' : 'caret-down'}
              className={field === 'username' ? 'sorter-active' : ''}
            />
          </span>
        ),
        dataIndex: 'username',
        width: 200,
      },
      {
        title: (
          <span
            onClick={() => {
              this.sortTable('accountType');
            }}
            className="table-icon"
          >
            账户类型
            <Icon
              type={field === 'accountType' && order === 'asc' ? 'caret-up' : 'caret-down'}
              className={field === 'accountType' ? 'sorter-active' : ''}
            />
          </span>
        ),
        dataIndex: 'accountType',
        width: 200,
        render: (text) => {
          if (text === '0') {
            return <span>运维</span>;
          } else if (text === '1') {
            return <span>内部</span>;
          } else if (text === '2') {
            return <span>外部</span>;
          } else if (text === '3') {
            return <span>单项疾病外部</span>;
          }
        },
      },
      {
        title: (
          <span
            onClick={() => {
              this.sortTable('jobNo');
            }}
            className="table-icon"
          >
            工号
            <Icon
              type={field === 'jobNo' && order === 'asc' ? 'caret-up' : 'caret-down'}
              className={field === 'jobNo' ? 'sorter-active' : ''}
            />
          </span>
        ),
        dataIndex: 'jobNo',
        width: 200,
      },
      {
        title: (
          <span
            onClick={() => {
              this.sortTable('updTime');
            }}
            className="table-icon"
          >
            更新时间
            <Icon
              type={field === 'updTime' && order === 'asc' ? 'caret-up' : 'caret-down'}
              className={field === 'updTime' ? 'sorter-active' : ''}
            />
          </span>
        ),
        dataIndex: 'updTime',
        width: 100,
        render: (text) => {
          return text ? text.split(' ')[0] : '';
        },
      },
    ];

    return (
      <StandardTable
        columns={columns}
        data={data}
        loading={loading}
        edit={edit}
        pageElement={pageElement}
        handleTableChange={this.handleTableChange}
        pageSize={pageSize}
        scroll={{ y: 30000, x: 600 }}
        selectList={this.props.selectList}
        current={current}
      />
    );
  }
}

export default DataAuthTable;
