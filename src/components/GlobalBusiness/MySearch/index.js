import React, { PureComponent } from 'react';
import { Button, Form, Icon } from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './index.less';

const FormItem = Form.Item;

/**
 * 页面顶部搜索框
 */

@Form.create()
export default class Index extends PureComponent {
  state = {
    showExpand: false,
  }
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.handleSearch(values);
      }
    });
  }

  handleReset = () => {
    this.props.form.resetFields();
    this.props.handleSearch({});
  }

  changeExpandStatus = () => {
    this.setState({
      showExpand: !this.state.showExpand,
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { formItem, expandFormItem, className } = this.props;
    const { showExpand } = this.state;
    return (
      <Form className={classNames(styles.main, className)} onSubmit={this.handleSearch}>
        <div className={styles.search}>
          {
            formItem && formItem.map(item => (
              <FormItem key={item.key} className={styles.formItem} style={{ flex: `0 1 ${item.width}` }} label={item.label}>
                {getFieldDecorator(item.key, {
                  initialValue: item.initialValue,
                  rules: item.rules || [],
                })(
                  item.component
                )}
              </FormItem>
            ))
          }
          <div className={styles.searchButton}>
            <Button htmlType="submit" icon="search" className={styles.button}>查询</Button>
            <Button icon="rollback" onClick={this.handleReset} className={styles.resetButton}>重置</Button>
            <Icon title="更多" style={{ display: expandFormItem && expandFormItem.length > 0 ? 'inline-block' : 'none' }} type={ showExpand ? 'up' : 'down' } className={styles.expandIcon} onClick={this.changeExpandStatus} />
          </div>
        </div>
        <div className={classNames(styles.search, !showExpand && styles.hideExpand)}>
          {
            expandFormItem && expandFormItem.map(item => (
              <FormItem key={item.key} className={styles.formItem} style={{ flex: `0 1 ${item.width}` }} label={item.label}>
                {getFieldDecorator(item.key, {
                  initialValue: item.initialValue,
                  rules: item.rules || [],
                })(
                  item.component
                )}
              </FormItem>
            ))
          }
        </div>
      </Form>
    );
  }
}

Index.defaultProps = {
  formItem: [],
};

Index.propTypes = {
  formItem: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    width: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    initialValue: PropTypes.any,
    rules: PropTypes.array,
    component: PropTypes.element.isRequired,
  })),
  handleSearch: PropTypes.func.isRequired,
};
