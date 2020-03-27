import React, { Component } from 'react';
import { Form, Button, Input } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;

@Form.create()
class PsdForm extends Component {
  state = {};


  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const values = {
        ...fieldsValue,
      };
      this.props.handleChangePsd(values);
    });
  }

  checkPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不匹配');
    } else {
      callback();
    }
  }

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
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
            label="新密码"
            key="chanPsd001"
          >
            {getFieldDecorator('password', {
              rules: [{
                required: true, message: '请输入新密码!',
              }, {
                validator: this.checkConfirm,
              }],
            })(
              <Input type="password" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="重复新密码"
            key="chanPsd002"
          >
            {getFieldDecorator('confirm', {
              rules: [{
                required: true, message: '请输入新密码',
              }, {
                validator: this.checkPassword,
              }],
            })(
              <Input type="password" onBlur={this.handleConfirmBlur} />
            )}
          </FormItem>
          <FormItem
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: 16, offset: 8 },
            }}
            key="chanPsd003"
          >
            <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }}>保存</Button>
            <Button onClick={this.props.handleCancel}>取消</Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default PsdForm;
