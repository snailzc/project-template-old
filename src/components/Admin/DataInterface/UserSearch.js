import React, { Component } from 'react';
import { Form, Button, Input, Row, Col } from 'antd';
import { getCurrentMenuId } from '../../../utils/utils';
import appConfig from '../../../../config/app.config';

const FormItem = Form.Item;
@Form.create()
class DataInterfaceUserSearch extends Component {
  state = {
    searchData: {
      appCode: appConfig.appShortCode,
      menuId: getCurrentMenuId(),
    },
  };

  handleReset() {
    this.props.form.resetFields();
    const values = {
      appCode: appConfig.appShortCode,
      menuId: getCurrentMenuId(),
    };
    this.props.handleSearch(values);
  }

  searchData = (exportCallback) => {
    const { pageElement } = this.props;
    this.props.form.validateFields((err, fieldsValue) => {
      const values = {
        ...fieldsValue,
        // areaId: fieldsValue.areaId ? fieldsValue.areaId[0] : '',
        // fieldId: fieldsValue.areaId ? fieldsValue.areaId[1] : '',
        keyword: '',
      };
      exportCallback(values, pageElement);
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      this.props.handleSearch(fieldsValue);
    });
  };

  render() {
    const { caseTypeData } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { searchData } = this.state;
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

    return (
      <div>
        <Form layout="inline" onSubmit={this.handleSubmit} className="normalSearchForm">
          <Row>
            <Col span={8}>
              <FormItem {...formItemLayout} label="关键字">
                {getFieldDecorator('keyword', {
                  initialValue: '',
                })(
                  <Input
                    size="small"
                  />
                )}
              </FormItem>
            </Col>
            <div key="medicineRemainSearchButton" className="searchButton">
              <Button
                size="small"
                type="primary"
                htmlType="submit"
              >
                查询
              </Button>
              <Button
                size="small"
                onClick={() => {
                  this.handleReset();
                }}
              >
                重置
              </Button>
            </div>
          </Row>
        </Form>
      </div>
    );
  }
}

export default DataInterfaceUserSearch;
