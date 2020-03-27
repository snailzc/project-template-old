import React, { Component } from 'react';
import { Form, Button, DatePicker, Input, Select } from 'antd';
import { appShortCode } from '../../../config/app.config';
import styles from './index.less';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
class EvpSearchForm extends Component {
  state = {
    searchData: {
      beginDate: '',
      endDate: '',
      jobNo: '',
      accountType: '',
      appCode: appShortCode,
    },
    beginDate: null,
    endDate: null,
  };

  rangeYear = (year, str) => {
    this.setState({
      beginDate: str[0],
      endDate: str[1],
    });
  };

  handleReset() {
    this.props.form.resetFields();
    this.setState({
      beginDate: null,
      endDate: null,
    });
    const values = {
      beginDate: '',
      endDate: '',
      jobNo: '',
      accountType: '',
    };
    this.props.handleSearch(values);
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const values = {
        ...this.state.searchData,
        ...fieldsValue,
        beginDate: this.state.beginDate ? this.state.beginDate : '',
        endDate: this.state.endDate ? this.state.endDate : '',
      };
      this.props.handleSearch(values);
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { pageElement } = this.props;

    return (
      <Form key="evpSearchForm" layout="inline" onSubmit={this.handleSubmit}>
        <FormItem label="日期">
          {getFieldDecorator('ddd', {
            initialValue: '',
          })(
            <RangePicker
              style={{ width: '210px' }}
              format="YYYY-MM-DD"
              onChange={this.rangeYear}
              size="small"
            />,
          )}
        </FormItem>
        <FormItem label="工号">
          {getFieldDecorator('jobNo', {
            initialValue: this.state.searchData.jobNo,
          })(<Input size="small" style={{ width: '120px' }} maxLength={20} />)}
        </FormItem>
        <FormItem label="用户类型">
          {getFieldDecorator('accountType', {
            initialValue: this.state.searchData.accountType,
          })(
            <Select size="small" style={{ width: '76px' }}>
              <Option value="0" key="0">
                运维
              </Option>
              <Option value="1" key="1">
                内部
              </Option>
              <Option value="2" key="2">
                外部
              </Option>
              <Option value="3" key="3">
                单项疾病外部
              </Option>
            </Select>,
          )}
        </FormItem>
        <div className={styles.buttonBlock} key="evpSearchButton">
          <Button
            type="primary"
            icon="search"
            size="small"
            htmlType="submit"
            className="ant-btn-plus-margin"
          >
            查询
          </Button>
          <Button
            icon="reload"
            size="small"
            className="ant-btn-plus-margin"
            onClick={() => {
              this.handleReset();
            }}
          >
            重置
          </Button>

          {pageElement && pageElement.btn_edit ? (
            <Button
              type="primary"
              icon="edit"
              size="small"
              onClick={() => {
                this.props.edit();
              }}
            >
              编辑
            </Button>
          ) : (
            ''
          )}
        </div>
      </Form>
    );
  }
}

export default EvpSearchForm;
