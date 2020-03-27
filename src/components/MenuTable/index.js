import React, { PureComponent, Fragment } from 'react';
import { Table, Divider, Button } from 'antd';
import styles from './index.less';

class StandardTable extends PureComponent {
  state = {};

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  };

  showTotal = (total) => {
    return `总共 ${total}条`;
  };

  render() {
    const { data, loading, element, pageSize, current } = this.props;
    const list = (Object.keys(data).indexOf('rows') !== -1 && data.rows) || data;
    const pagination = {
      total: data.total,
      pageSize,
      current,
      showTotal: this.showTotal,
    };

    const columns = [
      {
        title: '资源编码',
        dataIndex: 'code',
        width: 270,
      },
      {
        title: '资源类型',
        dataIndex: 'type',
        width: 100,
      },
      {
        title: '资源名称',
        dataIndex: 'name',
        width: 150,
      },
      {
        title: '资源地址',
        dataIndex: 'uri',
        width: 400,
      },
      {
        title: '资源请求类型',
        dataIndex: 'method',
        width: 100,
      },
      {
        title: '描述',
        dataIndex: 'description',
        width: 100,
      },
      {
        title: '操作',
        fixed: 'right',
        width: 180,
        render: (text, record, index) => (
          <Fragment>
            <Button
              type="primary"
              size="small"
              onClick={() => this.props.userEdit(text, record, index)}
              style={{ display: element.btn_element_edit ? 'auto' : 'none' }}
            >
              {element.btn_element_edit && element.btn_element_edit.name}
            </Button>
            <Divider type="vertical" />
            <Button
              type="danger"
              size="small"
              onClick={() => this.props.userDelete(text, record, index)}
              style={{ display: element.btn_element_del ? 'auto' : 'none' }}
            >
              {element.btn_element_del && element.btn_element_del.name}
            </Button>
          </Fragment>
        ),
      },
    ];
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };
    return (
      <div className={styles.menuTable}>
        <Table
          loading={loading}
          rowKey={record => record.id}
          dataSource={list}
          columns={columns}
          bordered
          pagination={paginationProps}
          onChange={this.handleTableChange}
          scroll={{ x: 1300, y: 300 }}
        />
      </div>
    );
  }
}

export default StandardTable;
