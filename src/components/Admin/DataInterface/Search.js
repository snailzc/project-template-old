import React, { Component } from 'react';
import { Form, Button, Row, Col, Input } from 'antd';

const FormItem = Form.Item;

@Form.create()
export default class DataInterfaceSearch extends Component {
  state = {
    title: '',
  };

  handleReset() {
    this.props.form.resetFields();
    this.props.handleSearch(this.state);
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
      this.props.handleSearch(values);
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
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
                {getFieldDecorator('title', {
                  initialValue: '',
                })(
                  <Input
                    size="small"
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <div className="searchButton" key="backupSearchButton">
            <Button
              size="small"
              type="primary"
              htmlType="submit"
              style={{ marginRight: '10px' }}
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
        </Form>
      </div>
    );
  }
}
