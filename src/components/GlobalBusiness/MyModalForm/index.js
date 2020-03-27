import React, { PureComponent } from 'react';
import { Button, Form, Row, Col, Spin } from 'antd';
import styles from './index.less';
import { getMenuName } from '../../../utils/utils';

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

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      formItem,
      header = {
        title: getMenuName(this.props.pageElement),
      },
      content,
      ifEdit,
      ifHide = false, // 是否显示更新按钮，默认显示
      loading,
    } = this.props;
    const formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };
    return (
      <Spin spinning={loading === undefined ? false : loading} key="modalForm" wrapperClassName={styles.spin}>
        <div key="titleKey" className={styles.titleWrap}>
          {header && (
            <ul className={styles.mainTitle}>
              <li className={styles.titleItem}>{header.title}{ifHide ? '查看' : (ifEdit ? '修改' : '新增')}</li>
              {header.content ?
                header.content.map(item => (
                  <li key={item.key}>
                    {item.key}：{item.value}
                  </li>
                ))
                : (<li key="crtUser">录入人:{JSON.parse(localStorage.info).name}</li>)
              }
            </ul>
          )}
        </div>
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
                  {item.name}：{item.value}
                </li>
              ))}
          </ul>
        </div>
        <Form
          key="formWrap"
          className={styles.formWrap}
          onSubmit={this.handleSubmit}
        >
          <Row>
            {formItem.filter(item => item.show === undefined || item.show === true).map(item => (
              <Col span={item.span !== undefined ? item.span : 12} key={item.key}>
                <FormItem
                  label={item.label}
                  {...formLayout}
                  {...item.formLayout}
                  validateStatus={item.validateStatus}
                >
                  {getFieldDecorator(item.key, {
                    initialValue: item.initialValue,
                    rules: item.rules || [],
                  })(item.component)}
                </FormItem>
              </Col>
            ))}
          </Row>
          <Row className={styles.buttonRow}>
            <Button icon="arrow-left" onClick={this.props.goBack} htmlType="button">
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
      </Spin>);
  }
}
