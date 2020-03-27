import React, { PureComponent } from 'react';
import { Table, message } from 'antd';
import styles from './index.less';

class EnvironmentalTable extends PureComponent {
  state = {
    selectedRowKeys: [],
  };

  onSelectChange = (selectedRowKeys) => {
    const { data } = this.props;
    let list = [];
    let flag = false;

    list = data.rows ? data.rows : data;
    list.forEach((item) => {
      if (item.id === selectedRowKeys[0]) {
        flag = true;
      }
    });

    if (!flag) {
      selectedRowKeys.shift();
    }
    this.setState({ selectedRowKeys });
    this.props.selectList(selectedRowKeys);
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.props.handleTableChange(pagination, filters, sorter);
  }

  showTotal = (total) => {
    return `总共 ${total}条`;
  }

  tableClass = (record, index) => {
    const { end, progressRatio } = this.props;
    const today = (new Date()).getTime();

    if (end && record.planFinishTime) {
      const finishTime = (new Date(record.planFinishTime.split(' ')[0]).getTime());
      if (today < finishTime) {
        return 'tableOrangeRed';
      }
    } else if (progressRatio) {
      if (record.progressRatio < 100) {
        return 'red';
      }
    } else if (index % 2) {
      return 'tableCss';
    } else {
      return '';
    }
  }

  render() {
    const {
      data, loading, pageElement,
      columns, scroll, pageSize, current,
    } = this.props;
    const { selectedRowKeys } = this.state;
    let list = [];
    const pagination = {
      total: data ? data.total : 0,
      pageSize,
      current,
      showTotal: this.showTotal,
    };
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    list = data && data.rows ? data.rows : data;

    return (
      <div className={styles.standardTable}>
        <Table
          bordered
          loading={loading}
          rowSelection={rowSelection}
          pagination={paginationProps}
          rowClassName={this.tableClass}
          rowKey={record => record.id}
          dataSource={list}
          onChange={this.handleTableChange}
          columns={columns}
          size="small"
          padding={0}
          scroll={scroll}
          className="table-can-click"
          onRow={record => ({
            onDoubleClick: () => {
              this.props.edit([record.id]);
            },
          })}
        />
      </div>
    );
  }
}

export default EnvironmentalTable;
