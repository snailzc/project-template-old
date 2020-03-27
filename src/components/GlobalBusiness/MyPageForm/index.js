import React, { PureComponent } from 'react';
import { Button, Form, Row, Col, Spin } from 'antd';
import styles from './index.less';
import { getBackUrl } from '../../../../utils/utils';

const FormItem = Form.Item;

@Form.create()
export default class Index extends PureComponent {
  static defaultProps = {
    formItem: [],
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { content } = this.props;
        const infoData = {};
        if (content && content.length) {
          content
            .filter(item => item)
            .map(it => (infoData[it.key] = it.value));
        }
        this.props.handleSubmit({ ...values, ...infoData });
        this.props.form.resetFields();
      }
    });
  };

  goBack = () => {
    if (this.props.handleReset) {
      this.props.handleReset();
    }
    const backUrl = getBackUrl();
    window.location.href = `#${backUrl}`;
    localStorage.edit = false;
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      formItem,
      ifEdit,
      content,
      ifHide = false, // 是否显示更新按钮，默认显示
      loading = false,
    } = this.props;
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
      <div className={styles.normalContentNew}>
        <Spin spinning={loading}>
          <div
            key="contentKey"
            className={styles.contentWrap}
            style={{ display: content ? 'block' : 'none' }}
          >
            <ul className={styles.mainContent}>
              {content &&
              content.map(item => (
                <li
                  key={item.key}
                  style={{ display: item.ifHide ? 'none' : 'inline-block' }}
                >
                  <b>{item.name}</b>：{item.value}
                </li>
              ))}
            </ul>
          </div>
          <Form
            key="formWrap"
            className="normalAddForm"
            onSubmit={this.handleSubmit}
          >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              {formItem.map(item => (
                <Col span={item.span !== undefined ? item.span : 12} key={item.key}>
                  {item.component ? (
                    <FormItem
                      label={item.label}
                      {...formItemLayout}
                      {...item.formLayout}
                      validateStatus={item.validateStatus}
                    >
                      {getFieldDecorator(item.key, {
                        initialValue: item.initialValue,
                        rules: item.rules || [],
                      })(item.component)}
                    </FormItem>) : (<FormItem />)}
                </Col>
              ))}
            </Row>
            <Row className={styles.buttonRow}>
              <Button icon="arrow-left" onClick={this.goBack} htmlType="button">
                返回列表
              </Button>
              {ifEdit ? (
                <Button
                  className={styles.submitBtn}
                  htmlType="submit"
                  style={{ display: ifHide ? 'none' : 'inline-block' }}
                >
                  更新
                </Button>
              ) : (
                <Button
                  className={styles.submitBtn}
                  htmlType="submit"
                >
                  保存
                </Button>
              )}
            </Row>
          </Form>
        </Spin>
      </div>);
  }
}
