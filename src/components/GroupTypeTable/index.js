import React, { PureComponent, Fragment } from 'react';
import { Table, Divider, Button } from 'antd';
import styles from './index.less';

class StandardTable extends PureComponent {
  state = {};

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  };

  showTotal = total => `总共${total}条`;

  render() {
    const { data, loading, element, pageSize, current } = this.props;
    const list = data.rows;
    const pagination = {
      total: data.total,
      pageSize,
      current,
      showTotal: this.showTotal,
    };

    const columns = [
      // {
      //   title: 'id',
      //   dataIndex: 'id',
      // },
      {
        title: '编码',
        dataIndex: 'code',
        width: 70,
      },
      {
        title: '类型名称',
        dataIndex: 'name',
        width: 70,
      },
      {
        title: '描述',
        dataIndex: 'description',
        width: 100,
      },
      {
        title: '最后更新时间',
        dataIndex: 'updTime',
        width: 100,
        render: val => <span>{val && val.split(' ')[0]}</span>,
      },
      {
        title: '最后更新人',
        dataIndex: 'updName',
        width: 100,
      },
      {
        title: '最后更新主机',
        dataIndex: 'updHost',
        width: 100,
      },
      {
        title: '操作',
        width: 200,
        render: (text, record, index) => (
          <Fragment>
            <Button
              type="primary"
              size="small"
              onClick={() => this.props.groupEdit(text, record, index)}
              style={{ display: element.btn_edit ? 'auto' : 'none' }}
            >
              {element.btn_edit && element.btn_edit.name}
            </Button>
            <Divider type="vertical" />
            <Button
              type="danger"
              size="small"
              onClick={() => this.props.groupDelete(text, record, index)}
              style={{ display: element.btn_del ? 'auto' : 'none' }}
            >
              {element.btn_del && element.btn_del.name}
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
      <div className={styles.standardTable}>
        <Table
          loading={loading}
          rowKey={record => record.id}
          dataSource={list}
          bordered
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          size="small"
          scroll={{ x: 840, y: 3000 }}
        />
      </div>
    );
  }
}

export default StandardTable;
