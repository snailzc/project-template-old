import React, { PureComponent, Fragment } from 'react';
import { Table, Popover, Button } from 'antd';
import styles from './index.less';

/**
 * 系统管理公用表格组件
 */
class GlobalAdminTable extends PureComponent {
  state = {
    selectedRowKeys: [],
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    const { data, tableKey } = this.props;
    let list = [];
    let flag = false;
    list = data.rows ? data.rows : data;
    list.forEach((item) => {
      if (((tableKey && item[tableKey]) || item.id) === selectedRowKeys[0]) {
        flag = true;
      }
    });

    if (!flag) {
      selectedRowKeys.shift();
    }
    this.setState({ selectedRowKeys });
    /**
     * 选中传参
     * @selectedRowKeys => 当前选中行的key值，默认id，当tableKey存在时为tableKey
     * @selectedRows => 当前选中行的整条数据
     */
    this.props.selectList(selectedRowKeys, selectedRows);
  };

  handleTableChange = (pagination, filters, sorter) => {
    this.props.handleTableChange(pagination, filters, sorter);
  };

  showTotal = (total) => {
    return `总共 ${total}条`;
  };

  tableClass = (record, index) => {
    const { end, progressRatio } = this.props;
    const today = new Date().getTime();

    if (end && record.planFinishTime) {
      const finishTime = new Date(
        record.planFinishTime.split(' ')[0],
      ).getTime();
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
  };

  formatColumns = (title, dataIndex, width = 100, cueRender, className) => {
    const colWith = width - 10;
    if (cueRender) {
      return {
        title,
        dataIndex,
        width,
        className,
        render: cueRender,
      };
    } else {
      return {
        title,
        dataIndex,
        width,
        className,
        render: (text) => {
          return (
            <Popover content={<span>{text || ' '}</span>}>
              <div className="letter-overflow" style={{ width: colWith }}>
                {dataIndex && dataIndex.toLowerCase().indexOf('time') !== -1
                  ? text && text.split(' ')[0]
                  : text}
              </div>
            </Popover>
          );
        },
      };
    }
  };

  handleCheck = () => {
    this.props.handleCheck();
    this.setState({
      selectedRowKeys: [],
    });
    this.props.selectList([], []);
  }

  handleUnChecked = () => {
    this.props.handleUnChecked();
    this.setState({
      selectedRowKeys: [],
    });
    this.props.selectList([], []);
  }

  render() {
    const {
      data, // 表格数据
      loading, // 表格加载loading
      pageElement, // 权限判断
      columns, // 表格头
      scroll, // 横向、纵向滚动
      tableKey, // key值，默认为id,传参时选中的是tableKey的值
      pageSize, //  每页数据条数
      current, // 当前页码
      selectRows, // 列表项是否可选，默认可选
      operation, // 是否显示操作列，默认显示，传参为none不显示
      isAdd, // 是否显示表格上新增按钮，默认显示，传参为none不显示
    } = this.props;
    const { selectedRowKeys } = this.state;
    let list = [];
    const isTotal = Object.keys(data).indexOf('total') !== -1;

    const curPagination = {
      total: isTotal ? data.total : data.length,
      pageSize,
      current,
      showTotal: this.showTotal,
    };

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...curPagination,
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    list = isTotal ? data.rows : data;

    const formatTable = columns.map((item) => {
      const { title, dataIndex, width, render = '', className = '' } = item;
      return this.formatColumns(title, dataIndex, width, render, className);
    });
    const newColumns = (operation && operation === 'none') ? formatTable : [
      ...formatTable,
      {
        title: '操作',
        width: 150,
        dataIndex: 'operation',
        render: (text, record, index) => (
          <Fragment>
            <div className="normalOperateBtn">
              <Button
                type="primary"
                size="small"
                className={record.status !== 'AUDITED' ? 'editBtn' : 'viewBtn'}
                onClick={() => this.props.handleEdit(text, record, index)}
                style={{
                  display:
                  pageElement && (pageElement.btn_edit || pageElement.btn_update)
                      ? 'auto'
                      : 'none',
                }}
              >
                {record.status === 'AUDITED' ? '查看' : '编辑'}
              </Button>
              <Button
                type="danger"
                size="small"
                className="normalDelBtn"
                onClick={() => this.props.handleDelete(text, record, index)}
                style={{ display: pageElement && pageElement.btn_del && (record.status !== 'AUDITED') ? 'inline-block' : 'none' }}
              >
                {pageElement && pageElement.btn_del && pageElement.btn_del.name}
              </Button>
            </div>
          </Fragment>
        ),
      },
    ];
    return (
      <div className={styles.standardTable}>
        <div className={styles.grayItem} />
        <div className={styles.btnWrap}>
          <Button
            type="primary"
            icon="plus"
            size="small"
            className="addBtn"
            onClick={() => this.props.handleAdd()}
            style={{
            display: (isAdd !== 'none' && pageElement && pageElement.btn_add) ? 'auto' : 'none',
          }}
          >
            {pageElement && pageElement.btn_add && pageElement.btn_add.name}
          </Button>
          <Button
            type="primary"
            size="small"
            className="checkBtn"
            onClick={this.handleCheck}
            style={{
            display: pageElement && pageElement.check_review ? 'auto' : 'none',
          }}
          >
            {pageElement && pageElement.check_review && pageElement.check_review.name}
          </Button>
          <Button
            type="primary"
            size="small"
            className="uncheckBtn"
            onClick={this.handleUnChecked}
            style={{
            display:
              pageElement && pageElement.check_unreview ? 'auto' : 'none',
          }}
          >
            {pageElement && pageElement.check_unreview && pageElement.check_unreview.name}
          </Button>
        </div>
        <Table
          bordered
          loading={loading}
          rowClassName={this.tableClass}
          rowKey={tableKey || (record => record.id)}
          dataSource={list}
          onChange={this.handleTableChange}
          columns={newColumns}
          size="small"
          padding={0}
          scroll={scroll}
          className="table-can-click"
          rowSelection={selectRows ? null : rowSelection}
          pagination={isTotal && paginationProps}
          onRow={(record) => {
            if (pageElement && pageElement.btn_edit) {
              return {
                onDoubleClick: () => {
                  this.props.handleEdit(record);
                },
              };
            }
          }}
        />
      </div>
    );
  }
}

export default GlobalAdminTable;
