import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Form,
  Input,
  Button,
  Select,
  Row,
  Col,
  Popover,
  Progress,
  Layout,
  Divider,
  Checkbox,
  message,
} from 'antd';
import RegisterArgument from '../../components/RegisterArgument';
import styles from './Register.less';

const { Header, Content } = Layout;
const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

const passwordStatusMap = {
  ok: <div className={styles.success}>强度：强</div>,
  pass: <div className={styles.warning}>强度：中</div>,
  pool: <div className={styles.error}>强度：太短</div>,
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  pool: 'exception',
};

@connect(({ register, loading }) => ({
  register,
  submitting: loading.effects['register/submit'],
}))
@Form.create()
export default class Register extends Component {
  state = {
    count: 0,
    confirmDirty: false,
    visible: false,
    help: '',
    prefix: '86',
    argumentVisible: false,
    ifDigital: true,
    ifDisabled: true,
    validationInfo: '发送验证码',
    mobileDisabled: false,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.register.status === 'ok') {
      this.props.dispatch(routerRedux.push('/user/register-result'));
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onGetCaptcha = () => {
    const curMobile = this.props.form.getFieldValue('mobile');
    if (curMobile && curMobile.match(/^1\d{10}$/)) {
      this.setState({
        validationInfo: '发送中',
      });
      const { dispatch } = this.props;
      dispatch({
        type: 'register/getCode',
        payload: {
          mobile: curMobile,
        },
      }).then(() => this.getValidate(this.props.register.ifCode));
    } else {
      message.error('请输入正确的手机号！');
    }
  };

  // 倒计时
  getValidate = (val) => {
    if (val) {
      this.setState({
        mobileDisabled: true,
      });
      let count = 59;
      this.setState({ count });
      this.interval = setInterval(() => {
        count -= 1;
        this.setState({ count });
        if (count === 0) {
          clearInterval(this.interval);
          this.setState({
            validationInfo: '发送验证码',
            mobileDisabled: false,
          });
        }
      }, 1000);
    } else {
      this.setState({
        validationInfo: '发送验证码',
      });
    }
  };

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'pool';
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        dispatch({
          type: 'register/validate',
          payload: {
            mobile: values.mobile,
            code: values.captcha,
          },
        }).then(() => this.handleForm(this.props.register.ifValidate, values));
      }
    });
  };

  // 提交表单
  handleForm = (res, values) => {
    if (res) {
      this.props.dispatch({
        type: 'register/submit',
        payload: {
          ...values,
          prefix: this.state.prefix,
        },
      });
    } else {
      message.warning('验证码错误');
    }
  }

  handleConfirmBlur = (e) => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不匹配!');
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    if (!value) {
      this.setState({
        help: '请输入密码！',
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      if (!this.state.visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
    }
  };

  changePrefix = (value) => {
    this.setState({
      prefix: value,
    });
  };

  // 数字化协议
  showMYDigital = () => {
    this.setState({
      argumentVisible: true,
      ifDigital: true,
    });
  };

  // 授权协议
  showAuthorization = () => {
    this.setState({
      argumentVisible: true,
      ifDigital: false,
    });
  };

  changeCheckbox = (e) => {
    this.setState({
      ifDisabled: !e.target.checked,
    });
  };

  // 关闭协议
  handleClose = () => {
    this.setState({
      argumentVisible: false,
    });
  };

  // 更改手机号
  changePhone = () => {
    this.setState({
      validationInfo: '发送验证码',
    });
  }

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const {
      count,
      prefix,
      argumentVisible,
      ifDigital,
      ifDisabled,
      validationInfo,
      mobileDisabled,
    } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 18,
          offset: 6,
        },
      },
    };

    return (
      <Layout className={styles.registerLayout}>
        <Header>
          <Row>
            <Col span={2} offset={22}>
              <a href="#/user/login" style={{ color: '#fff' }}>
                用户登录
              </a>
            </Col>
          </Row>
        </Header>
        <Content className={styles.main}>
          <h2>用户注册</h2>
          {/* <h2>企业／养殖户注册</h2>
          <h4>企业／养殖户信息</h4> */}
          <Form onSubmit={this.handleSubmit}>
            {/* <FormItem
              {...formItemLayout}
              label="企业／养殖户名称"
            >
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入名称！',
                  },
                ],
              })(<Input placeholder="企业／养殖户名称" />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="出栏规模"
            >
              {getFieldDecorator('columnScale', {
                rules: [
                  {
                    required: true,
                    message: '请选择出栏规模！',
                  },
                ],
              })(
                <Select>
                  <Option value="1" key="1">1~100</Option>
                  <Option value="2" key="2">100~500</Option>
                  <Option value="3" key="3">500~1000</Option>
                  <Option value="4" key="4">1000~10000</Option>
                  <Option value="5" key="5">10000~100000</Option>
                  <Option value="6" key="6">100000头以上</Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="人员规模"
            >
              {getFieldDecorator('staffScale', {
                rules: [
                  {
                    required: true,
                    message: '请选择人规模！',
                  },
                ],
              })(
                <Select>
                  <Option value="1" key="1">1-50</Option>
                  <Option value="2" key="2">50-100</Option>
                  <Option value="3" key="3">100-500</Option>
                  <Option value="4" key="4">500-1000</Option>
                  <Option value="5" key="5">1000人以上</Option>
                </Select>
              )}
            </FormItem>

            <Divider /> */}

            {/* <h4>管理员信息信息</h4> */}
            {/* <FormItem
              {...formItemLayout}
              label="用&nbsp;&nbsp;户&nbsp;&nbsp;名"
            >
              {getFieldDecorator('manager', {
                rules: [
                  {
                    required: true,
                    message: '请输入用户名！',
                  },
                ],
              })(<Input placeholder="用户名" />)}
            </FormItem> */}
            <FormItem
              {...formItemLayout}
              label="手&nbsp;&nbsp;机&nbsp;&nbsp;号"
            >
              <InputGroup compact>
                <Select
                  value={prefix}
                  onChange={this.changePrefix}
                  style={{ width: '30%' }}
                >
                  <Option value="86">+86</Option>
                </Select>
                {getFieldDecorator('mobile', {
                  rules: [
                    {
                      required: true,
                      message: '请输入手机号！',
                    },
                    {
                      pattern: /^1\d{10}$/,
                      message: '手机号格式错误！',
                    },
                  ],
                })(<Input disabled={mobileDisabled} onChange={this.changePhone} style={{ width: '70%' }} placeholder="11位手机号" />)}
              </InputGroup>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="验&nbsp;&nbsp;证&nbsp;&nbsp;码"
            >
              <Row gutter={8}>
                <Col span={16}>
                  {getFieldDecorator('captcha', {
                    rules: [
                      {
                        required: true,
                        message: '请输入验证码！',
                      },
                    ],
                  })(<Input placeholder="验证码" />)}
                </Col>
                <Col span={8} style={{ marginTop: '4px' }}>
                  <Button
                    disabled={count}
                    className={styles.getCaptcha}
                    onClick={this.onGetCaptcha}
                  >
                    {count ? `${count} s` : validationInfo}
                  </Button>
                </Col>
              </Row>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="登录密码"
              help={this.state.help}
            >
              <Popover
                content={
                  <div style={{ padding: '4px 0' }}>
                    {passwordStatusMap[this.getPasswordStatus()]}
                    {this.renderPasswordProgress()}
                    <div style={{ marginTop: 10 }}>
                      请至少输入 6 个字符。请不要使用容易被猜到的密码。
                    </div>
                  </div>
                }
                overlayStyle={{ width: 240 }}
                placement="right"
                visible={this.state.visible}
              >
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                      message: '请输入登录密码！',
                    },
                    {
                      validator: this.checkPassword,
                    },
                  ],
                })(
                  <Input
                    type="password"
                    placeholder="至少6位密码，区分大小写"
                  />,
                )}
              </Popover>
            </FormItem>
            <FormItem {...formItemLayout} label="确认密码">
              {getFieldDecorator('confirm', {
                rules: [
                  {
                    required: true,
                    message: '请确认密码！',
                  },
                  {
                    validator: this.checkConfirm,
                  },
                ],
              })(<Input type="password" placeholder="确认密码" />)}
            </FormItem>

            <Divider />

            <FormItem {...tailFormItemLayout}>
              {getFieldDecorator('agreement', {
                valuePropName: 'checked',
              })(<Checkbox onChange={this.changeCheckbox} />)}
              <span>
                我同意并遵守
                <a onClick={this.showMYDigital}>《牧原数字化养殖平台协议》</a>
                <a onClick={this.showAuthorization}>《使用授权协议》</a>
              </span>
            </FormItem>
            <div className={styles.registerButton}>
              <Button
                loading={submitting}
                className={styles.submit}
                type="primary"
                htmlType="submit"
                disabled={ifDisabled}
              >
                注册
              </Button>
            </div>
          </Form>
          <RegisterArgument
            argumentVisible={argumentVisible}
            ifDigital={ifDigital}
            handleClose={this.handleClose}
          />
        </Content>
      </Layout>
    );
  }
}
