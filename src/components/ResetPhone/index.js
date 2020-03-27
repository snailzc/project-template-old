import React, { Component } from 'react';
import { Form, Button, Input, Select, message } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
class ResetPhone extends Component {
  state = {
    mobile: '',
    ifSend: false,
    seconds: 59,
  };

  getUserCount = () => {
    const { mobile } = this.state;
    if (mobile.length) {
      this.props.form.setFieldsValue({ loginName: '' });
      this.props.getCount({ jobNo: mobile });
    } else {
      message.warning('请先输入手机号！');
    }
  }

  jobnoChange = (e) => {
    this.setState({
      mobile: e.target.value,
    });
  }


  goLogin = () => {
    window.history.go(-1);
  }

  sendCode = () => {
    let timer = null;
    if (!this.state.ifSend && this.state.mobile) {
      this.setState({
        ifSend: true,
      });
      clearInterval(timer);
      timer = setInterval(() => {
        let { seconds } = this.state;
        if (seconds <= 1) {
          clearInterval(timer);
          this.setState({
            seconds: 59,
            ifSend: false,
          });
        } else {
          seconds -= 1;
          this.setState({
            seconds,
          });
        }
      }, 1000);
      this.props.sendCode({ jobNo: this.state.mobile });
    }
  }

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不一致!');
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  handleSubmit= (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.resetPsd({
          verifyCode: values.verifyCode,
          mobile: this.state.mobile,
          newPwd: values.password,
          loginName: values.loginName,
        });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { seconds, ifSend } = this.state;
    const { ifLogin, countList } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 14 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 8,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    return (
      <div className={styles.main}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="手&nbsp;&nbsp;机&nbsp;&nbsp;号"
          >
            {getFieldDecorator('jobNo', {
              rules: [{
                required: true, message: '请输入手机号!',
              }],
            })(
              <div>
                <Input style={{ width: '65%', borderTopRightRadius: 0, borderBottomRightRadius: 0 }} onChange={this.jobnoChange} />
                <Button type="primary" onClick={this.getUserCount} style={{ width: '35%', borderTopLeftRadius: 0, borderBottomLeftRadius: 0, padding: '0 10px' }}>
                  查询账户
                </Button>
              </div>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="账户列表"
          >
            {getFieldDecorator('loginName', {
              rules: [{
                required: true, message: '请选择一个账户!',
              }],
            })(
              <Select
                style={{ width: '100%' }}
                placeholder="请选择一个账户"
                onChange={this.handleChange}
              >
                {
                   countList.map((item) => {
                    return <Option value={item.username} key={item.id}>{item.username}</Option>;
                  })
                }
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="验&nbsp;&nbsp;证&nbsp;&nbsp;码"
          >
            {getFieldDecorator('verifyCode', {
              rules: [{
                required: true, message: '请输入验证码!',
              }],
            })(
              <div>
                <Input style={{ width: '65%', borderTopRightRadius: 0, borderBottomRightRadius: 0 }} />
                <Button
                  type="primary"
                  onClick={this.sendCode}
                  disabled={ifSend}
                  style={{
                    width: '35%',
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    padding: '0 10px',
                  }}
                >
                  {
                    ifSend
                      ?
                      `${seconds}s`
                      :
                      '获取验证码'
                  }
                </Button>
              </div>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="新&nbsp;&nbsp;密&nbsp;&nbsp;码"
          >
            {getFieldDecorator('password', {
              rules: [{
                required: true, message: '请输入新密码',
              }, {
                validator: this.validateToNextPassword,
              }],
            })(
              <Input type="password" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="再次输入"
          >
            {getFieldDecorator('confirm', {
              rules: [{
                required: true, message: '请再次输入新密码!',
              }, {
                validator: this.compareToFirstPassword,
              }],
            })(
              <Input type="password" onBlur={this.handleConfirmBlur} />
            )}
          </FormItem>
          <FormItem {...tailFormItemLayout} style={{ textAlign: 'left' }}>
            {
              ifLogin
                ?
                  <span>
                    <Button key="sureSubmit" type="primary" htmlType="submit" className="ant-btn-plus-margin">确认修改</Button>
                    <Button key="backLogin" onClick={this.goLogin} style={{ marginLeft: '70px'}} >返回登录</Button>
                  </span>
                :
                  <span>
                    <Button key="modalSubmit" type="primary" htmlType="submit" className="ant-btn-plus-margin">确认修改</Button>
                    <Button key="modalCancel" onClick={() => this.props.cancelResetPwd()}>取消</Button>
                  </span>
            }
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default ResetPhone;
