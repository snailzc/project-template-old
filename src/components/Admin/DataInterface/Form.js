import React, { Component } from 'react';
import { Form, Button, Row, Col, Input, Modal, Select, Radio, Upload, Icon } from 'antd';
import { noteLimit, getBackUrl } from '../../../utils/utils';
import styles from './Form.less';
import appConfig from '../../../../config/app.config';

const { Option } = Select;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { TextArea } = Input;

const uploadHeader = {
  appCode: appConfig.appShortCode,
  Authorization: localStorage.getItem('user-token'),
};

@Form.create()
class DataInterfaceForm extends Component {
  state = {
    appUpdateType: 1,
    fileList: [],
    attachements: [],
    isUpload: true,
    previewVisible: false,
    previewImage: '',
  };

  componentWillMount() {
    if (localStorage.edit === 'true') {
      this.props.form.resetFields();
    }
    const { ifEdit, values } = this.props;
    if (ifEdit) {
      const old = [];
      let index = 0;
      if (values.attachements) {
        values.attachements.forEach((item) => {
          index += 1;
          old.push({
            uid: index,
            name: item.fileName,
            url: item.url,
          });
        });
        this.setState({
          isUpload: false,
          fileList: old,
        });
      }
    }
  }

  componentWillReceiveProps() {
    if (localStorage.edit === 'true') {
      this.props.form.resetFields();
      this.setState({});
      localStorage.edit = false;
    }
    if (localStorage.addFlag === 'true') {
      this.props.form.resetFields();
      localStorage.addFlag = false;
    }
    localStorage.ifBatch = false;
  }

  // 重置表单
  handleReset = () => {
    this.props.resetValues();
    this.props.form.resetFields();
  };

  handleChange = ({ file, fileList }) => {
    this.setState({ fileList });
    if (file.status === 'done' && file.response && file.response.data.rows) {
      const res = file.response.data.rows[0];
      this.setState({
        attachements: [
          ...this.state.attachements,
          {
            id: res.id,
            fileName: res.fileName,
            fileSize: res.fileSize,
          },
        ],
        isUpload: false,
      });
    }
  };

  handleRemove = (file) => {
    const { attachements } = this.state;
    for (let i = 0; i < attachements.length; i += 1) {
      if (attachements[i].fileName === file.name) {
        attachements.splice(i, 1);
      }
    }
    this.setState({
      attachements,
    });
  };

  handleCancelPreview = () => {
    this.setState({
      previewVisible: false,
    });
  }

  handlePreview = (file) => {
    if (file.url) {
      const fileName = file.name.split('.');
      const imgArr = ['png', 'jpg', 'jpeg', 'gif', 'ico'];
      if (imgArr.indexOf(fileName[fileName.length - 1]) > -1) {
        this.setState({
          previewImage: file.url || file.thumbUrl,
          previewVisible: true,
        });
      } else {
        window.open(file.url, 'blank');
      }
    }
    if (file.response &&
      file.response.data &&
      file.response.data.rows &&
      file.response.data.rows[0]) {
      const uid = file.response.data.rows[0].id;
      window.open(`/file/fetch/v1/${uid}`);
    }
  };

  // 删除
  handleDelete = () => {
    this.props.delete();
  };

  handleSubmitUpdate = () => {
    this.handleSubmit(true);
  };

  handleSubmitGone = () => {
    this.handleSubmit(false);
  };

  // 修改
  handleEdit = () => {
    this.handleReset();
    this.props.edit();
  };

  // 返回
  goBack = () => {
    this.handleReset();
    const backUrl = getBackUrl();
    window.location.href = `#${backUrl}`;
    localStorage.edit = false;
  };

  cancelEdit = () => {
    this.props.cancelEdit();
  };

  // 提交表单
  handleSubmit = (ifHide) => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const values = {
        ...fieldsValue,
        attachements: this.state.attachements,
      };
      this.props.handleSubmit(values, ifHide);
    });
  };

  render() {
    const {
      values,
      ifEdit,
      submitting,
      updataLoading,
      updateTypeList,
      appList,
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { previewVisible, previewImage, fileList, isUpload, appUpdateType } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 12 },
        sm: { span: 24 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
    };
    const textItemLayout = {
      labelCol: {
        xs: { span: 12 },
        sm: { span: 24 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
    };
    const uploadLayout = {
      labelCol: {
        xs: { span: 12 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
      },
    };
    return (
      <div>
        <Form className="normalAddForm">
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col span={6}>
              <FormItem
                style={{ display: 'none' }}
                {...formItemLayout}
                label="id"
              >
                {getFieldDecorator('id', {
                  initialValue: values.id,
                })(<Input />)}
              </FormItem>
              <FormItem {...formItemLayout} label="所属应用">
                {getFieldDecorator('appCode', {
                  initialValue: values.appCode,
                  rules: [
                    {
                      required: true,
                      message: '请选择所属应用',
                    },
                  ],
                })(
                  <Select>
                    {appList && appList.map(item => (
                      <Option value={item.code} key={item.code} >
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem {...formItemLayout} label="APP名称">
                {getFieldDecorator('appName', {
                  initialValue: values.appName,
                  rules: [{
                    required: true,
                    message: '请输入APP名称',
                  }],
                })(<Input className="h25" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem {...formItemLayout} label="版本号">
                {getFieldDecorator('appVersion', {
                  initialValue: values.appVersion,
                  rules: [{
                    required: true,
                    message: '请输入版本号',
                  }],
                })(<Input className="h25" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem {...formItemLayout} label="更新类型">
                {getFieldDecorator('appUpdateType', {
                  initialValue: values.appUpdateType !== undefined ? values.appUpdateType : appUpdateType,
                })(
                  <RadioGroup>{
                    updateTypeList.map(item => (
                      <Radio value={item.value}>{item.title}</Radio>
                    ))
                  }
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem
                {...textItemLayout}
                label={
                  <span>
                  应用描述
                    <span style={{
                      fontSize: 12,
                      color: '#c6c6c6',
                      fontWeight: 'normal',
                      marginLeft: '5px',
                    }}
                    >
                    (最多输入150个字)
                    </span>
                  </span>}
              >
                {getFieldDecorator('description', {
                  initialValue: values.description,
                })(<TextArea className="normalTextArea" {...noteLimit} />)}
              </FormItem>
            </Col>
          </Row>
          <Row className={styles.fileUpload}>
            <Col span={24}>
              <FormItem
                {...uploadLayout}
                label="附&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;件"
              >
                {getFieldDecorator('attachements', {
                  initialValue: values.attachements,
                })(
                  <Upload
                    action={localStorage.v4Upload}
                    headers={uploadHeader}
                    listType="text"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                    onRemove={this.handleRemove}
                    showUploadList={{ showRemoveIcon: values.status !== 'AUDITED' }}
                    name="upload_file"
                  >
                    {values.status !== 'AUDITED' && (<Button>
                      <Icon type="upload" /> 上传
                    </Button>)}
                    { isUpload && ' 无'}
                  </Upload>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem>
                <div className="buttonWrapper">
                  <Button
                    icon="arrow-left"
                    className="backBtn"
                    onClick={() => this.goBack()}
                  >
                    返回列表
                  </Button>
                  {values.status !== 'AUDITED' &&
                  (ifEdit ? (
                    <Button
                      type="primary"
                      onClick={this.handleSubmitUpdate}
                      loading={updataLoading}
                    >
                      更新
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      onClick={this.handleSubmitGone}
                      loading={submitting}
                    >
                      保存
                    </Button>
                  ))}
                </div>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancelPreview}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default AppMobileVersionForm;
