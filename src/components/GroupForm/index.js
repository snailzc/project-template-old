import React, { Component } from 'react';
import { Form, Button, Input, Select } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
class GroupForm extends Component {
  state = {
    typeArr: [
      {
        name: '应用角色',
        key: 'INNER_ACCOUNT',
      },
      {
        name: '外部角色',
        key: 'EXTERNAL_ACCOUNT',
      },
    ],
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const values = {
        ...fieldsValue,
      };
      this.props.handleUpdate(values);
    });
  }

  reset() {
    this.props.form.resetFields();
  }

  render() {
    if (localStorage.reset === 'true') {
      this.reset();
      localStorage.reset = false;
    }
    const { data, ifEdit, ifAdd, currentId, currentName } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (
      <div className={styles.menuForm}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="名称"
            key="powerMenu01"
          >
            {getFieldDecorator('name', {
              initialValue: data.name,
              rules: [{
                required: true, message: '请填写名称',
              }],
            })(
              <Input disabled={(ifEdit && ifAdd)} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="编码"
            key="powerMenu02"
          >
            {getFieldDecorator('code', {
              initialValue: data.code,
              rules: [{
                required: true, message: '请填写编码',
              }],
            })(
              <Input disabled={(ifEdit && ifAdd)} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="类型"
            key="powerMenu03"
          >
            {getFieldDecorator('type', {
              initialValue: data.type,
              rules: [{
                required: true, message: '请选择类型',
              }],
            })(
              <Select disabled={(ifAdd)}>
                {
                  this.state.typeArr.map((item) => {
                    return <Option value={item.key} key={item.key}>{item.name}</Option>;
                  })
                }
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="排序"
          >
            {getFieldDecorator('orderNum', {
              initialValue: data.orderNum,
            })(
              <Input disabled={ifEdit} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="目录"
            key="powerMenu04"
          >
            {getFieldDecorator('mullu', {
              initialValue: currentId ? currentName : '',
            })(
              <Input disabled />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="描述"
            key="powerMenu05"
          >
            {getFieldDecorator('description', {
              initialValue: data.description,
            })(
              <Input disabled={(ifEdit && ifAdd)} />
            )}
          </FormItem>
          <FormItem
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: 16, offset: 8 },
            }}
            style={{ display: (ifEdit && ifAdd) ? 'none' : '' }}
            key="powerMenu06"
          >
            <Button type="primary" htmlType="submit" style={{ marginRight: '10px', display: ifEdit ? 'none' : 'inline-block' }}>更新</Button>
            <Button type="primary" htmlType="submit" style={{ marginRight: '10px', display: ifAdd ? 'none' : 'inline-block' }}>保存</Button>
            <Button onClick={this.props.handleCancel}>取消</Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default GroupForm;
