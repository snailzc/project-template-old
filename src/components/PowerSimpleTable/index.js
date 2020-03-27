import React, { PureComponent } from 'react';
import { Table, Button } from 'antd';
import styles from './index.less';

class PowerSimpleTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      choosed: '',
    };
  }

  savePower = () => {
    this.props.elementChange(this.state.choosed);
  }

  tableClass = (record, index) => {
    if (index % 2) {
      return 'tableCss';
    } else {
      return '';
    }
  }

  render() {
    const { data, loading, curId, choosedData } = this.props;
    let tableData = [];
    const list = data.rows;
    if (list && list.length) {
      list.forEach((item, index) => {
        list[index].key = `${item.id}`;

        if (curId === 'muyuan_role_root' && choosedData.length) {
          for (let i = 0; i < choosedData.length; i += 1) {
            if (item.id === choosedData[i]) {
              tableData.push(item);
              break;
            }
          }
        }
      });
    }

    if (curId !== 'muyuan_role_root') {
      tableData = list;
    }

    let choose = [];
    if (localStorage.GroupChange === 'false') {
      this.setState({
        choosed: '',
      });
      tableData.map((item) => {
        choosedData.map((key) => {
          if (item.id === key) {
            choose.push(key);
          }
          return '';
        });
        return '';
      });
    }

    const rowSelection = curId !== 'muyuan_role_root' ? {
      onSelect: () => {
      },
      onChange: (selectedRowKeys) => {
        localStorage.GroupChange = 'true';
        choose = [];
        this.setState({
          choosed: selectedRowKeys,
        });
      },
      hideDefaultSelections: true,
      selectedRowKeys: [...choose, ...this.state.choosed],
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
      }),
    } : null;

    const columns = [
      {
        title: '资源编码',
        dataIndex: 'code',
        width: 160,
      },
      {
        title: '资源类型',
        dataIndex: 'type',
        width: 80,
      },
      {
        title: '资源名称',
        dataIndex: 'name',
        width: 100,
      },
      {
        title: '资源地址',
        dataIndex: 'uri',
        width: 100,
      },
      {
        title: '资源请求类型',
        dataIndex: 'method',
        width: 100,
      },
    ];

    return (
      <div className={styles.standardTable}>
        <Button type="primary" icon="exception" style={{ marginBottom: '16px' }} onClick={this.savePower}>保存资源</Button>
        <Table
          rowSelection={rowSelection}
          loading={loading}
          rowKey={record => record.id}
          dataSource={tableData}
          columns={columns}
          bordered
          size="small"
          rowClassName={this.tableClass}
          padding={0}
          scroll={{ x: '120%', y: 400 }}
        />
      </div>
    );
  }
}

export default PowerSimpleTable;
