import React, { Component } from 'react';
import { Button, Col, Form, Input, Row } from 'antd';

const FormItem = Form.Item;

@Form.create()
class DataInterfaceGroupSearch extends Component {
  state = {
    searchData: {},
  };

  handleReset() {
    this.props.form.resetFields();
    const values = {};
    this.props.handleSearch(values);
  }

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

export default DataInterfaceGroupSearch;
