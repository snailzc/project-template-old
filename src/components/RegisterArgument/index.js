import React, { Component } from 'react';
import { Modal, Button } from 'antd';

export default class RegisterArgument extends Component {
  render() {
    const { ifDigital, argumentVisible } = this.props;
    return (
      <Modal
        title={ifDigital ? '牧原数字化养殖平台协议' : '使用授权协议'}
        visible={argumentVisible}
        onCancel={this.props.handleClose}
        footer={<Button type="primary" onClick={this.props.handleClose}>我已阅读</Button>}
      />
    );
  }
}
