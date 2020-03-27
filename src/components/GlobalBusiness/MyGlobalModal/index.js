import React, { Component } from 'react';
import { Modal } from 'antd';
import classNames from 'classnames';
import styles from './index.less';
/**
 * 公用全局Modal
 * 1. 修改底部按钮位置及样式
 * 2. 默认onCancel关闭弹窗
 * 需要的父组件传值：
 *  1. 打开弹窗参数：count =>当该参数更改时，弹窗打开
 *  2. 关闭弹窗参数：close => 当该参数更改时，弹窗关闭
 */

export default class GlobalModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  /**
   * 使用count来计算当前是否需要重新赋值
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.count !== this.props.count) {
      this.setState({
        visible: true,
      });
    }
    if (nextProps.close !== this.props.close) {
      this.setState({
        visible: false,
      });
    }
  }

  onCancel = () => {
    this.setState({
      visible: false,
    });
    if (this.props.handleCancel) {
      this.props.handleCancel();
    }
  };

  onOk = () => {
    this.setState({
      visible: false,
    });
    if (this.props.handleOK) {
      this.props.handleOK();
    }
  };

  render() {
    const { visible } = this.state;
    const { children, className, width = '60%', ...props } = this.props;
    return (
      <Modal
        visible={visible}
        className={classNames(styles.globalModal, className)}
        destroyOnClose
        onOk={this.onOk}
        width={width}
        onCancel={this.onCancel}
        maskClosable={false}
        {...props}
      >
        {children}
      </Modal>
    );
  }
}
