import React, { Component } from 'react';
import { Form, Button, Input, Select, Icon } from 'antd';
import styles from './index.less';
import { searlizeMenu } from '../../utils/utils';
import iconJson from '../../utils/icon.json';

const { Option } = Select;
const FormItem = Form.Item;

@Form.create()
class MenuForm extends Component {
  state = {
    curType: '',
  };

  typeChange = (val) => {
    this.setState({
      curType: val,
    });
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
    const { data, ifEdit, ifAdd } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { curType } = this.state;
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
    const allMenu = searlizeMenu();
    const condition1 = !curType && data.type === 'report';
    const condition2 = ifEdit && curType === 'report';
    const condition3 = condition1 || curType === 'report';
    const condition4 = !ifEdit && condition3;
    return (
      <div className={styles.menuForm}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="编码"
          >
            {getFieldDecorator('code', {
              initialValue: data.code,
              rules: [{ required: true, message: '请填写编码!' }],
            })(
              <Input disabled={ifEdit && ifAdd} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="标题"
          >
            {getFieldDecorator('title', {
              initialValue: data.title,
              rules: [{ required: true, message: '请填写标题!' }],
            })(
              <Input disabled={ifEdit && ifAdd} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="父级节点"
          >
            {getFieldDecorator('parentId', {
              initialValue: data.parentId,
              rules: [{ required: true, message: '请选择父级节点!' }],
            })(
              <Select disabled={ifEdit && ifAdd}>
                <Option value="-1" key="-1">
                  根目录
                </Option>
                {
                  allMenu.map((item) => {
                    return (<Option value={item.id} key={item.id}>{item.title}</Option>);
                  })
                }
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="图标"
          >
            {getFieldDecorator('icon', {
              initialValue: data.icon,
              rules: [{ required: true, message: '请填写图标!' }],
            })(
              <Select disabled={ifEdit && ifAdd} >
                {
                  iconJson.map((item) => {
                    return (
                      <Option
                        value={item.value}
                        key={item.key}
                      >
                        <Icon type={item.value} />
                      </Option>
                    );
                  })
                }
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="类型"
          >
            {getFieldDecorator('type', {
              initialValue: data.type,
              rules: [{ required: true, message: '请选择类型!' }],
            })(
              <Select disabled={ifEdit && ifAdd} onChange={this.typeChange}>
                <Option value="menu" key="1">menu</Option>
                <Option value="dirt" key="2">dirt</Option>
                <Option value="report" key="3">report</Option>
              </Select>
            )}
          </FormItem>
          {
            condition4 || condition2
            ?
              <FormItem
                {...formItemLayout}
                label="报表路径"
              >
                {getFieldDecorator('url', {
                  initialValue: data.url,
                })(
                  <Input disabled={ifEdit && ifAdd} />
                )}
              </FormItem>
            : ''
          }
          <FormItem
            {...formItemLayout}
            label="排序"
          >
            {getFieldDecorator('orderNum', {
              initialValue: data.orderNum,
            })(
              <Input disabled={ifEdit && ifAdd} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="描述"
          >
            {getFieldDecorator('description', {
              initialValue: data.description,
            })(
              <Input disabled={ifEdit && ifAdd} />
            )}
          </FormItem>
          {/* <FormItem
            {...formItemLayout}
            label="前端组件"
          >
            {getFieldDecorator('attr1', {
              initialValue: data.attr1,
              rules: [{ required: true, message: '请填写前端组件!' }],
            })(
              <Input  disabled={ifEdit} />
            )}
          </FormItem> */}
          <FormItem
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: 16, offset: 8 },
            }}
            style={{ display: !ifAdd || !ifEdit ? '' : 'none' }}
          >
            <Button type="primary" htmlType="submit" style={{ marginRight: '10px', display: ifEdit ? 'none' : '' }}>更新</Button>
            <Button type="primary" htmlType="submit" style={{ marginRight: '10px', display: ifAdd ? 'none' : '' }}>保存</Button>
            <Button onClick={this.props.handleCancel}>取消</Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default MenuForm;
