import React, { PureComponent, Fragment } from 'react';
import { Table, Popover, Button, Popconfirm } from 'antd';
import moment from 'moment';
import classNames from 'classnames';
import { formatMoney, formatNumber } from '../../../utils/utils';
import styles from './index.less';

/**
 * 公用表格组件
 */
class MyTable extends PureComponent {
  state = {
    selectedRowKeys: [],
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    const { data, tableKey } = this.props;
    let flag = false;
    const list = data.rows ? data.rows : data;
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
    const values = { ...pagination, ...filters, ...sorter };
    this.props.handleTableChange(values);
  };

  showTotal = (total) => {
    return `总共 ${total}条`;
  };

  // 清空选中列表
  clearTable = () => {
    this.setState({
      selectedRowKeys: [],
    });
    this.props.selectList([], []);
  };

  tableClass = (record, index) => {
    if (index % 2) {
      return 'tableCss';
    } else {
      return '';
    }
  };

  formatColumns = (item) => {
    const {
      render = '',
      width = 80,
      align = 'left',
      type = 'default', // 需要处理的数据,time => 时间; money => 金钱; number => 数字逗号分隔，替换.00
    } = item;


    const colWith = width - 10;
    if (render) {
      return {
        ...item,
        width,
        align,
      };
    } else {
      return {
        ...item,
        width,
        align,
        render: (text) => {
          const actions = new Map([
            ['default', () => text],
            ['time', () => text && moment(text).format('YYYY/MM/DD')],
            ['money', () => formatMoney(text)],
            ['number', () => formatNumber(text)],
          ]);
          return (
            <Popover content={<span>{text}</span>}>
              <div className="letter-overflow" style={{ width: colWith }}>
                {actions.get(type).call(this)}
              </div>
            </Popover>
          );
        },
      };
    }
  };

  render() {
    const {
      data, // 表格数据
      loading, // 表格加载loading
      pageElement, // 权限判断
      columns, // 表格头
      scroll, // 横向、纵向滚动
      tableKey = 'id', // key值，默认为id,传参时选中的是tableKey的值
      pageSize, //  每页数据条数
      current, // 当前页码
      selectRows = true, // 列表项是否可选，默认可选
      operation = true, // 是否显示操作列，默认显示
      rowNum = false, // 是否显示行序号，默认不显示
      operaAppend = [], // 操作列追加
      operaWidth = 150, // 操作栏宽度，默认150
      btnsRight, // 右侧功能按钮
      btnsLeft, // 左侧功能按钮
      stStr = 'status', // 需要状态判断的字段,默认审核状态
      stCode = ['AUDITED'], // 状态代码,
      expandedRowRender, // 是否显示从表, 默认不显示
      className,
      type,
      childrenColumnName,
      onDoubleClick, // 双击行事件
    } = this.props;
    const { selectedRowKeys } = this.state;
    const isTotal = Object.keys(data).indexOf('total') !== -1;
    const curPagination = {
      total: isTotal ? data.total : data.length,
      pageSize,
      current,
      showTotal: this.showTotal,
    };
    const paginationProps = {
      // position: 'bottom',
      showSizeChanger: true,
      showQuickJumper: true,
      ...curPagination,
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      type: type || 'checkbox',
    };

    const list = isTotal ? data.rows : data;

    // 添加序号
    if (rowNum) {
      columns.unshift({
        title: '序号',
        key: 'key',
        width: 30,
        align: 'center',
        render: (text, record, index) => {
          const num = ((current - 1) * pageSize) + index + 1;
          return <span>{num}</span>;
        },
      });
    }

    const formatTable = columns.map((item) => {
      if (item.children && item.children.length) {
        return {
          ...item,
          children: item.children.map(child => this.formatColumns(child)),
        };
      } else {
        return this.formatColumns(item);
      }
    });
    const newColumns = operation
      ? [
        ...formatTable,
        {
          title: '操作',
          width: operaWidth,
          dataIndex: 'operation',
          render: (text, record, index) => (
            <Fragment>
              <div className={styles.operationWrap}>
                { stCode.includes(record[stStr]) ?
                  (<a className="viewBtn" onClick={() => this.props.handleEdit(record, index)} >查看</a>)
                    :
                    (
                      <div>
                        <a
                          className="editBtn"
                          onClick={() => this.props.handleEdit(record, index)}
                          style={{ display: pageElement && pageElement.btn_edit ? 'inline-block' : 'none' }}
                        >
                          修改
                        </a>
                        <Popconfirm
                          title="确定删除吗?"
                          onConfirm={() => this.props.handleDelete(record, index)}
                        >
                          <a style={{ display: pageElement && pageElement.btn_del ? 'inline-block' : 'none' }} >
                          删除
                          </a>
                        </Popconfirm>
                      </div>)
                }
                {((operaAppend && operaAppend.length > 0) ? operaAppend.map((item) => {
                  return (
                    <a
                      style={{ display: item.isShow ? 'inline-block' : 'none' }}
                      onClick={() => item.func(record)}
                    >
                      {item.render ? item.render(record[item.key]) : item.name}
                    </a>
                  );
                }) : null)}
              </div>
            </Fragment>
          ),
        },
      ]
      : formatTable;
    return (
      <div className={styles.prepTable}>
        {/* <div className={styles.grayItem} /> */}
        <div>
          <div className={styles.btns}>
            <div className={styles.btnsLeft}>
              {btnsLeft &&
                btnsLeft.map((item) => {
                  return (
                    item.isShow &&
                    <Button
                      key={item.name}
                      className={classNames(styles.globalBtn, item.className)}
                      onClick={item.func}
                      htmlType="button"
                    >
                      {item.name}
                    </Button>
                  );
                })}
            </div>
            <div className={styles.btnsRight}>
              {btnsRight &&
                btnsRight.map((item) => {
                  return (
                    item.isShow &&
                    <Button
                      type={item.type ? item.type : ''}
                      key={item.name}
                      size={item.size ? item.size : 'default'}
                      className={item.className}
                      onClick={item.func}
                      loading={item.loading || false}
                      htmlType="button"
                    >
                      {item.name}
                    </Button>
                  );
                })}
            </div>
          </div>
          <Table
            bordered
            // footer={isAmount ? () => 'Footer' : null}
            loading={loading}
            rowClassName={this.tableClass}
            rowKey={tableKey}
            dataSource={list}
            onChange={this.handleTableChange}
            columns={newColumns}
            size="small"
            childrenColumnName={childrenColumnName}
            indentSize={30}
            padding={0}
            scroll={scroll}
            expandedRowRender={expandedRowRender}
            className={classNames('table-can-click', styles.globalTable, className)}
            rowSelection={selectRows ? rowSelection : null}
            pagination={isTotal && paginationProps}
            onRow={(record) => {
              return {
                onDoubleClick: () => {
                  if (onDoubleClick) { // 如果定义了事件
                    if (onDoubleClick === null) {
                      // 如果事件为空
                    } else {
                      this.props.onDoubleClick(record);
                    }
                  } else if (pageElement && pageElement.btn_edit && this.props.handleEdit) {
                      this.props.handleEdit(record);
                    }
                },
              };
            }}
          />
        </div>
      </div>
    );
  }
}

export default MyTable;
