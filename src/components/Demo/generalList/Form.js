import React, { PureComponent } from 'react';
import { Input } from 'antd';
import FsForm from '../../GlobalBusiness/MyModalForm';
import { doubleFF } from '../../../utils/pattern';

export default class AgeFendGroupForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      values: props.values,
    };
  }

  handleSubmit = (vals) => {
    const { values } = this.state;
    const { segment } = this.props;
    const newValues = {
      ...values,
      ...vals,
      ...segment,
    };
    this.props.handleSubmit(newValues);
  };

  render() {
    const { ifEdit, values } = this.props;
    const formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };
    const formItem = [
      {
        key: 'id',
        label: 'id',
        initialValue: values && values.id,
        span: 0,
        component: <Input />,
      },
      {
        key: 'age',
        label: '日龄',
        formLayout,
        initialValue: values && values.age,
        span: 20,
        component: <Input addonAfter="天" />,
        rules: [
          {
            required: true,
            message: '请输入日龄',
          }, {
            pattern: doubleFF.reg,
            message: doubleFF.msg,
          },
        ],
      },
      {
        key: 'feedIntake',
        label: '标准采食量',
        formLayout,
        initialValue: values && values.feedIntake,
        span: 20,
        component: <Input addonAfter="克" />,
        rules: [
          {
            required: true,
            message: '请输入标准采食量',
          },
          {
            pattern: doubleFF.reg,
            message: doubleFF.msg,
          },
        ],
      },
      {
        key: 'correctionOefficient',
        label: '矫正系数',
        formLayout,
        initialValue: values && values.correctionOefficient || 1,
        span: 20,
        component: <Input />,
        rules: [
          {
            required: true,
            message: '请输入矫正系数',
          }, {
            pattern: doubleFF.reg,
            message: doubleFF.msg,
          },
        ],
      },
    ];
    return (
      <FsForm
        formItem={formItem}
        handleSubmit={this.handleSubmit}
        goBack={this.props.goBack}
        ifEdit={ifEdit}
        ifHide={values && values.status === 'AUDITED'}
        wrappedComponentRef={form => this.form = form}
        pageElement={this.props.pageElement}
      />);
  }
}
