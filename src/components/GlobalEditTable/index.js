import React from 'react';
import ReactDOM from 'react-dom';
import { Table, Button, Form, Popconfirm } from 'antd';
import EditableCell from './EditableCell';

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

export default class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: props.dataSource, // 表格数据
      count: props.count, // 表格数量
    };
  }
  componentWillReceiveProps(nextProps) {
    // 根据count判断是否更新数据
    if (nextProps.count !== this.props.count) {
      this.setState({
        dataSource: nextProps.dataSource,
        count: nextProps.count,
      });
    }
  }


  /**
 * 新增可编辑行
 * @params dataSource =>当前表格列表数据
 * @params count => 当前计数
 */
  handleAdd = () => {
    const { dataSource, count } = this.state;
    this.props.handleAdd(dataSource, count); // 新增表格行数
  };

  /**
   * 保存编辑行数据
   * @params dataSource => 当前数据
   * @params count => 当前计数
   */
  handleSave = (row) => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.order === item.order);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
    this.props.handleSave(this.state.dataSource, this.state.count); //  保存编辑行
  };

  /**
   * 删除行
   * params newData => 删除后的数据
   * params count => 当前计数
   */
  handleDelete = (val) => {
    const { dataSource, count } = this.state;
    const newData = dataSource.filter(item => item.order !== val);
    this.props.handleDelete(newData, count);
  };

  render() {
    const {
      columns, // 配置列
      tableKey, // 表格行key值，默认为id
    } = this.props;
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const newColumns = [
      ...columns,
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => (
          <Popconfirm
            title="确定删除吗?"
            onConfirm={() => this.handleDelete(record.order)}
          >
            <a href="javascript:;">删除</a>
          </Popconfirm>
        ),
      },
    ];
    const curColumns = newColumns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
        <Button
          onClick={this.handleAdd}
          type="primary"
          style={{ marginBottom: 16 }}
        >
          增加分录
        </Button>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={curColumns}
          rowKey={tableKey || (record => record.id)}
        />
      </div>
    );
  }
}
