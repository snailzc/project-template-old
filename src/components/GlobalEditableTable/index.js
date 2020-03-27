import React, { Component } from 'react';
import { Table, Form, Input, Button, Select, InputNumber, message } from 'antd';
import styles from './index.less';
import { filterOption } from '../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

const EditableCell = ({
  editing,
  dataIndex,
  title,
  record,
  controllertype,
  getController,
  ...restProps
}) => (
  <EditableContext.Consumer>
    {(form) => {
      const { getFieldDecorator } = form;
      return (
        <td {...restProps}>
          {editing ? (
            <FormItem style={{ margin: 0 }}>
              {getFieldDecorator(dataIndex, {
                rules: [
                  {
                    required: dataIndex === 'amount' || dataIndex === 'type',
                    message: `请输入${title}`,
                  },
                ],
                initialValue: record[dataIndex],
              })(getController(controllertype))}
            </FormItem>
          ) : (
            restProps.children
          )}
        </td>
      );
    }}
  </EditableContext.Consumer>
);

class GlobalEditableTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editingKey: '',
      dataSource: props.dataSource || [],
      count: props.count, // 可编辑表格序号,初始化为1
    };

    /**
     * params => columns => 配置列
     */
    this.columns = props.columns.concat({
      title: '操作',
      dataIndex: 'operation',
      width: '10%',
      render: (text, record) => {
        const editable = this.isEditing(record);
        return (
          <div>
            {editable ? (
              <span>
                <EditableContext.Consumer>
                  {form => (
                    <a
                      onClick={() => this.save(form, record.key)}
                      style={{ marginRight: 8 }}
                    >
                      保存
                    </a>
                  )}
                </EditableContext.Consumer>
                <a onClick={() => this.cancel(record.key)}>退出</a>
              </span>
            ) : (
              <span>
                <a
                  onClick={() => this.edit(record.key)}
                  style={{ marginRight: 8 }}
                >
                  编辑
                </a>
                <a onClick={() => this.delete(record.key)}>删除</a>
              </span>
            )}
          </div>
        );
      },
    });
  }

  componentWillMount() {
    let count = 1;
    const dataSource = this.state.dataSource.map((item, index) => {
      const newItem = { ...item, key: index + 1 };
      count += 1;
      return newItem;
    });
    this.setState({
      count,
      dataSource,
    });
  }

  /**
   * 通过nextProps和this.props的count判断是否需要更新数据
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.count !== this.props.count) {
      this.setState({
        dataSource: nextProps.dataSource,
        count: nextProps.count,
      });
    }
  }

  getController = (controllertype) => {
    const { typeList } = this.props;
    if (controllertype === 'type') {
      return (
        <Select showSearch filterOption={filterOption} style={{ width: 120 }}>
          {typeList.map(item => (
            <Option key={item.code}>{item.title}</Option>
          ))}
        </Select>
      );
    } else if (controllertype === 'description') {
      return <Input />;
    } else {
      return <InputNumber min={0} />;
    }
  };

  /**
   * 新增可编辑行
   * @params => dataSource => 当前行数据
   * @params => count => 当前序号
   */
  addTableData = () => {
    const { dataSource, count } = this.state;
    this.props.addTableData(dataSource, count);

    this.setState({
      editingKey: count,
    });
  };

  isEditing = (record) => {
    return record.key === this.state.editingKey;
  };

  edit(key) {
    this.setState({ editingKey: key });
  }

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const { totalAmount } = this.props; // 评估总头数
      const { dataSource, editingKey } = this.state;
      const newData = dataSource;
      const index = newData.findIndex(item => key === item.key);
      const { typeList } = this.props;
      let newRow = row;
      typeList.map((item) => {
        if (item.code === row.type || item.title === row.type) {
          newRow = {
            ...newRow,
            type: item.title,
            typeId: parseInt(item.code, 10),
            ratio: (parseInt(row.amount, 10) / totalAmount).toFixed(2),
            typeRatio: parseInt(row.amount, 10)
              ? (parseInt(row.amount, 10) / total).toFixed(2)
              : 0,
          };
        }
      });
      const newArr = [];
      newData.map((item) => {
        if (item.amount) {
          newArr.push({
            ...item,
            typeRatio: parseInt(row.amount, 10)
              ? (parseInt(item.amount, 10) / total).toFixed(2)
              : 0,
          });
        } else {
          newArr.push(item);
        }
      });
      if (index > -1) {
        const item = newArr[index];
        newArr.splice(index, 1, {
          ...item,
          ...newRow,
        });
        this.setState({ dataSource: newArr, editingKey: '' });
        this.props.getTableInfo(this.props.tableName, newArr);
      } else {
        newArr.push(newRow);
        this.setState({ dataSource: newArr, editingKey: '' });
        this.props.getTableInfo(this.props.tableName, newArr);
      }
    });
  }

  delete = (key) => {
    const dataSource = [...this.state.dataSource];
    const newData = dataSource.filter(item => item.key !== key);
    this.setState({ dataSource: newData });
    this.props.getTableInfo(this.props.tableName, newData);
  };

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  render() {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          dataIndex: col.dataIndex,
          title: col.title,
          controllertype: col.dataIndex,
          editing: this.isEditing(record),
          getController: this.getController,
        }),
      };
    });
    const { dataSource } = this.state;
    const { tableTitle, btnTitle } = this.props;
    const title = () => {
      return (
        <div>
          <b>{tableTitle}</b>
          <Button size="small" className={styles.tableButton} type="primary" onClick={this.addTableData}>
            {btnTitle}
          </Button>
        </div>);
    };
    return (
      <div className={styles.editableTable}>

        <Table
          components={components}
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          rowClassName={styles.editableRow}
          title={title}
        />
      </div>
    );
  }
}

export default GlobalEditableTable;
